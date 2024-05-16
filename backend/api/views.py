from django.shortcuts import render
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError

from .serializers import AgentSerializer, PropertySerializer, AvatarSerializer
from django.core.exceptions import ObjectDoesNotExist

from .models import Agent, Property

#@permission_classes([AllowAny])
#class RegisterView(APIView):
#    def post(self, request):
#        serializer = CustomUserSerializer(data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(data=serializer.data)
#        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
################## AUTH ############################

class RegisterView(generics.CreateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AgentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
    
@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            user = Agent.objects.get(username=username)
        except Agent.DoesNotExist:
            return Response(data={"error":"Account does not exist"}, status=status.HTTP_404_NOT_FOUND)
        if user is None:
            return Response(data={'error':'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if not user.is_active:
            return Response(data={'error':'Acount is inactive'}, status=status.HTTP_403_FORBIDDEN)
        if not user.check_password(password):
            return Response(data={'error':'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_user(user)
        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh_token),
            'user': user.username
            
            
            # Aqui añadir mas campos del usuario
            # como is_active, is_admin 
        
        })

@permission_classes([AllowAny])   
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            if not refresh_token:
                return Response({'detail': 'Token is missing'})
            token = RefreshToken(refresh_token)
            #token.blacklist()
            return Response(data={"User logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e),'token':str(request.data)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
        

class InviteView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            # comprobar si email es correcto
            # send email
            return Response(data={"message":"Invitation sent to {}".format(email)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)

###########################################################

########################## AVATAR ############################

class ChangeAvatar(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, format=None):
        try:
            agent = Agent.objects.get(username=request.user)
            serializer = AvatarSerializer(agent, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data={"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)


###########################################################

####################### AGENTS ########################

class AgentListCreate(generics.ListCreateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
    # falta el permiso de solo admin 
    # solo los admin pueden listar, crear y editar otros agentes
    # no, porque los agentes pueden editar su perfil
    # eso significa que para que un agente edite su perfil tendrá que 
    # usar el AgentUpdateView? o endpoints individuales?
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
    
    if not Group.objects.filter(name='adminGroup').exists():
        Group.objects.create(name='adminGroup')
    
    def partial_update(self, request, *args, **kwargs):
        agent = Agent.objects.get(username=request.user)
        serializer = AgentSerializer(agent, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        restricted_fields = ['is_staff', 'is_superuser']
        
        for field in request.data.keys():
            if field in restricted_fields:
                return Response(data={"error":f"You cannot change this {field}"}, status=status.HTTP_400_BAD_REQUEST)

        
        if 'is_admin' in request.data.keys():
            is_admin = serializer.validated_data['is_admin']
            
            group = Group.objects.get(name='adminGroup')
            if is_admin:
                agent.user.groups.add(group)
            else:
                agent.user.groups.remove(group)
        
        
        self.perform_update(serializer)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
        
###########################################################

####################### PROPERTIES ########################

    
class PropertyListCreate(generics.ListCreateAPIView):   
    queryset = Property.objects.all()     
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        instance.delete()


# class PropertyDelete(generics.DestroyAPIView):
#     queryset = Property.objects.all()
#     serializer_class = PropertySerializer
#     permission_classes = [IsAuthenticated]
    
#     def perform_destroy(self, instance):
#         instance.delete()        
        
# @permission_classes([AllowAny])        
# def get_tokens_for_user(user):
#     try:
#         refresh = RefreshToken.for_user(user)
#     except Error:
#         return Response(data={"error":str(Error)})
#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     }     
        
        

        
class PingView(APIView):
    def get(self, request):
        return Response({"message":"pong"}, status=status.HTTP_200_OK)
    
class RestrictedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(data={"message":"You have access to this content"})
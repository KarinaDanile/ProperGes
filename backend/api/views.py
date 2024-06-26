from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import user_passes_test
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, filters
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError

from .serializers import (
    AgentSerializer, PropertySerializer, 
    AvatarSerializer, ClientSerializer, 
    ChangePasswordSerializer, VisitSerializer,
    OfferSerializer,
    )
from django.core.exceptions import ObjectDoesNotExist
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PropertyFilter, ClientFilter
from .pagination import CustomPagination

import uuid
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404

from .models import (
    Agent, Property, Client, Invitation, PropertyImage, 
    Visit, Reservation, Offer, Sale
    )


def is_admin(user):
    return user.is_admin

def send_invitation_email(email, sender):
    token = uuid.uuid4().hex
    Invitation.objects.create(email=email, sender=sender, token=token)
    invite_url = f"{settings.FRONTEND_URL}/register?token={token}"
    
    send_mail(
        'Invitación de registro ProperGes',
        f'¡Hola! Has sido invitado a registrarte en nuestra plataforma de gestión inmobiliaria. Haz click en el siguiente enlace para registrarte: {invite_url}',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

# Check if token is valid and if so, return registering user's email
class ValidateInvitationToken(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error':'Token is missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        invitation = get_object_or_404(Invitation, token=token)
        
        if invitation.is_valid():
            return Response({'email':invitation.email}, status=status.HTTP_200_OK)
        else:
            return Response({'error':'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

##################### AUTH ############################


class InviteView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            sender = request.user
            
            send_invitation_email(email, sender)
            
            return Response(data={"message":"Invitación enviada a {}".format(email)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]
    
    #def post(self, request):
    #    serializer = AgentSerializer(data=request.data)
    #    if serializer.is_valid():
    #        serializer.save()
    #        return Response(data=serializer.data)
    #    return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
    
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
            'user': user.username,
            'is_admin': user.is_admin,
            'is_active': user.is_active
        
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
        


#############################################################

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
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
    
    def partial_update(self, request, *args, **kwargs):
        agentMakingChanges = Agent.objects.get(username=request.user)
        
        if not (agentMakingChanges.is_admin or agentMakingChanges.is_superuser):
            return Response(data={"error":"You do not have permission to make changes to this account"}, status=status.HTTP_403_FORBIDDEN)
        
        agent = self.get_object()
        
        if agentMakingChanges == agent:
            return Response(data={"error":"You cannot modify your own account"}, status=status.HTTP_403_FORBIDDEN)
        
        restricted_fields = ['is_staff', 'is_superuser']
        
        for field in request.data.keys():
            if field in restricted_fields:
                return Response(data={"error":f"You cannot change this {field}"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AgentSerializer(agent, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        
        if 'is_admin' in request.data.keys():
            is_admin = serializer.validated_data['is_admin']
            
            group = Group.objects.get(name='adminGroup')
            try:
                if is_admin:
                    agent.groups.add(group)
                    
                else:
                    agent.groups.remove(group)
                    
            except Group.DoesNotExist:
                return Response(data={"error":"Group does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        self.perform_update(serializer)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    
class AgentDeleteView(generics.DestroyAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated]
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user:
            return Response(data={"error": "You cannot delete your own account"}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(data={"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

###########################################################

####################### PASSWORD ########################

        
class ChangePassword(generics.UpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user 

        
###########################################################

####################### PROPERTIES ########################

    
class PropertyListCreate(generics.ListCreateAPIView):   
    queryset = Property.objects.all().order_by('-list_date') 
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['place_name', 'place', 'region', 'property_type', 'price', 'description', 'reference']
    ordering_fields = ['place_name', 'place', 'sqft', 'region', 'property_type', 'description', 'reference', 'list_date', 'update', 'beds', 'baths', 'availability', 'is_negotiable', 'price']
    ordering = ['-list_date']
    pagination_class = CustomPagination
    
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
        images_to_delete_str = self.request.data.get('imagesToDelete', '')
        images_to_delete = [int(id) for id in images_to_delete_str.split(",") if id.strip()] if images_to_delete_str else []
        
        if serializer.is_valid():
            for image_id in images_to_delete:
                image = PropertyImage.objects.get(id=image_id)
                image.delete()
                    
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        instance.delete()


class PlaceListView(APIView):
    def get(self, request):
        places = Property.objects.values_list('place', flat=True).distinct()
        return Response(data=places, status=status.HTTP_200_OK)
    
class PropertyCount(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        property_count = Property.objects.count()
        return Response(data={"property_count":property_count}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        total_properties = Property.objects.count()
        available_properties = Property.objects.filter(availability='disponible').count()
        reserved_properties = Property.objects.filter(availability='reservada').count()
        sold_properties = Property.objects.filter(availability='vendida').count()

        return Response(
            data={
                "property_count": {
                    "total": total_properties,
                    "available": available_properties,
                    "reserved": reserved_properties,
                    "sold": sold_properties
                }
            },
            status=status.HTTP_200_OK
        )

###########################################################

####################### CLIENTS ########################


class ClientListView(generics.ListCreateAPIView):  
    queryset = Client.objects.all().order_by('-created')
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ClientFilter
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'email', 'phone', 'client_type', 'is_active', 'created']
    ordering = ['-created']
    pagination_class = CustomPagination
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnerListView(generics.ListAPIView):  
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Client.objects.filter(
            Q(client_type='vendedor') | Q(client_type='ambos')
        ).order_by('-created')
    


class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        instance.delete()
  
class ClientPropertiesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            client = Client.objects.get(client_id=pk)
        except Client.doesNotExist:
            return Response(data={"Este cliente no existe"}, status=status.HTTP_404_NOT_FOUND)
        
        if client.client_type not in ['vendedor', 'ambos']:
            return Response(data={"Este cliente no tiene propiedades"}, status=status.HTTP_404_NOT_FOUND)
        
        properties = client.properties.all()
        serializer = PropertySerializer(properties, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
        
class ClientVisitsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            client = Client.objects.get(client_id=pk)
        except Client.doesNotExist:
            return Response(data={"Este cliente no existe"}, status=status.HTTP_404_NOT_FOUND)
        
        visits = client.client_visits.all().order_by('-start')
        serializer = VisitSerializer(visits, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class ActiveClientCount(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        active_clients_count = Client.objects.filter(is_active=True).count()
        return Response(data={"active_clients":active_clients_count}, status=status.HTTP_200_OK)


###########################################################

####################### VISITS ###########################


class VisitListCreate(generics.ListCreateAPIView):
    queryset = Visit.objects.all().order_by('-start')
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserVisitsList(generics.ListAPIView):
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        username = self.request.user
        try:
            agent = Agent.objects.get(username=username)
        except Agent.DoesNotExist:
            return Response(data={"error":"Este agente no existe"}, status=status.HTTP_404_NOT_FOUND)
        
        return Visit.objects.filter(agent_id=agent.id, visit_state="pendiente").order_by('start')

class VisitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        instance.delete()

class VisitsPendingCount(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        pending_visits_count = Visit.objects.filter(visit_state='pendiente').count()
        return Response(data={"pending_visits":pending_visits_count}, status=status.HTTP_200_OK)

###########################################################

####################### OFFERS ############################

class OfferListCreate(generics.ListCreateAPIView):
    queryset = Offer.objects.all().order_by('-created')
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        instance.delete()
    
class PendingOffersCount(APIView):
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        pending_offers_count = Offer.objects.filter(offer_state='pendiente').count()
        return Response(data={"pending_offers":pending_offers_count}, status=status.HTTP_200_OK)



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
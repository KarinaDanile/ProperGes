from django.shortcuts import render
#from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError

from .serializers import CustomUserSerializer
from django.core.exceptions import ObjectDoesNotExist

from .models import CustomUser

@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        #email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response(data={"error":"Account does not exist"})
            #raise AuthenticationFailed('Account does not exist')
        if user is None:
            raise AuthenticationFailed('User does not exist')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')
        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_user(user)
        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh_token)
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
        
# def register_user(request):
#     if request.method == 'POST':
#         serializer = CustomUserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data, status=status.HTTP_201_CREATED)
#         return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response(data={"message":"Please use POST method to register a user"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# def user_login(request):
#     if request.method == 'POST':
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = None
#         if '@' in username:
#             try:
#                 user = CustomUser.objects.get(email=username)
#             except ObjectDoesNotExist:
#                 return Response(data={"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
#         if not user:
#             user = authenticate(username=username, password=password)
            
#         if user:
#             token, _ = Token.objects.get_or_create(user=user)
#             return Response(data={"token":token.key}, status=status.HTTP_200_OK)
        
#         return Response({'error':'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        

# @permission_classes([IsAuthenticated])
# def user_logout(request):
#     if request.method == 'POST':
#         try:
#             request.user.auth_token.delete()
#             return Response(data={"message":"User logged out"}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     return Response(data={"message":"Please use POST method to logout"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def verify_email(request, id):
    user = CustomUser.objects.get(id=id)
    if not user.email_verified:
        user.email_verified = True
        user.save()
    return redirect('')
   
        
class PingView(APIView):
    def get(self, request):
        return Response({"message":"pong"}, status=status.HTTP_200_OK)
    
class RestrictedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(data={"message":"You have access to this content"})
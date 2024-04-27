from django.urls import path
from .views import (
    PingView, RestrictedView, 
    RegisterView, LoginView, LogoutView, 
    verify_email,
)
from rest_framework_simplejwt.views import ( 
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    #path('ping/', PingView.as_view(), name='ping'),
    path('restricted/', RestrictedView.as_view(), name='restricted'),
    path('token/create', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    #path('verify-email/<int:id>/', verify_email, name='verify_email')
]
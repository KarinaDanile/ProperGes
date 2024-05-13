from django.urls import path
#from .views import (PingView, RestrictedView, RegisterView, LoginView, LogoutView, verify_email,)
from . import views
from rest_framework_simplejwt.views import ( 
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    # token endpoints
    path('token/create', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # auth endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('invite/', views.InviteView.as_view(), name='invite'),

    # agent endpoints
    path('agents/', views.AgentListCreate.as_view(), name='agent_list'),
    path('agents/<int:pk>/', views.AgentUpdateView.as_view(), name='agent_detail'),
    path('avatar/', views.ChangeAvatar.as_view(), name='avatar'),
    
    # property endpoints
    path('properties/', views.PropertyListCreate.as_view(), name='property_list'),
    #path('properties/delete/<int:pk>/', views.PropertyDelete.as_view(), name='property_delete'),
    
    
    #path('verify-email/<int:id>/', views.verify_email, name='verify_email')
]
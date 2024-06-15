from django.urls import path

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
    path('validate_invitation_token/', views.ValidateInvitationToken.as_view(), name='validate_invitation_token'),

    # agent endpoints
    path('agents/', views.AgentListCreate.as_view(), name='agent_list'),
    path('agents/<int:pk>/', views.AgentUpdateView.as_view(), name='agent_detail'),
    path('avatar/', views.ChangeAvatar.as_view(), name='avatar'),
    path('change-password/', views.ChangePassword.as_view(), name='change_password'),
    path('agents/<int:pk>/delete/', views.AgentDeleteView.as_view(), name='agent_delete'),
    
    # property endpoints
    path('properties/', views.PropertyListCreate.as_view(), name='property_list'),
    path('properties/<uuid:pk>/', views.PropertyDetailView.as_view(), name='property_detail'),
    path('places/', views.PlaceListView.as_view(), name='place_list'),
    path('properties/count/', views.PropertyCount.as_view(), name='property_count'),
    
    # client endpoints
    path('clients/', views.ClientListView.as_view(), name='client_list'),
    path('clients/<uuid:pk>/', views.ClientDetailView.as_view(), name='client_detail'),
    path('owners/', views.OwnerListView.as_view(), name='owner_list'),
    path('clients/<uuid:pk>/properties/', views.ClientPropertiesView.as_view(), name='client_properties'),
    path('clients/<uuid:pk>/visits/', views.ClientVisitsView.as_view(), name='client_visits'),
    path('clients/active/', views.ActiveClientCount.as_view(), name='active_clients'),
    
    # visit endpoints
    path('visits/', views.VisitListCreate.as_view(), name='visit_list'),
    path('visits/<uuid:pk>/', views.VisitDetailView.as_view(), name='visit_detail'),
    path('visits/user/', views.UserVisitsList.as_view(), name='visit_user'),
    path('visits/pending/', views.VisitsPendingCount.as_view(), name='pending_visits'),
    
    # offer endpoints
    path('offers/', views.OfferListCreate.as_view(), name='offer_list'),
    path('offers/<uuid:pk>/', views.OfferDetailView.as_view(), name='offer_detail'),
    path('offers/pending/', views.PendingOffersCount.as_view(), name='pending_offers'),
    
    path('ping/', views.PingView.as_view(), name='ping'),
    #path('verify-email/<int:id>/', views.verify_email, name='verify_email')
] 
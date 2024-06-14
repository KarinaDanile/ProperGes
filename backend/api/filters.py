
from django_filters import rest_framework as filters
from .models import Property, Client

class PropertyFilter(filters.FilterSet):
    place = filters.CharFilter(field_name='place', lookup_expr='icontains')
    beds = filters.NumberFilter(field_name='beds', lookup_expr='gte')
    baths = filters.NumberFilter(field_name='baths', lookup_expr='gte')
    availability = filters.CharFilter(field_name='availability', lookup_expr='icontains')
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    property_type = filters.CharFilter(field_name='property_type', lookup_expr='icontains')
    
    class Meta:
        model = Property
        fields = ['place', 'property_type', 'beds', 'baths', 'availability', 'price_min', 'price_max']
        
        
class ClientFilter(filters.FilterSet):
    client_type = filters.CharFilter(field_name='client_type', lookup_expr='icontains')
    is_active = filters.BooleanFilter(field_name='is_active')
    
    class Meta:
        model = Client
        fields = ['client_type', 'is_active']
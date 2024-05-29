
from django_filters import rest_framework as filters
from .models import Property

class PropertyFilter(filters.FilterSet):
    place = filters.CharFilter(field_name='place', lookup_expr='icontains')
    beds = filters.NumberFilter(field_name='beds')
    baths = filters.NumberFilter(field_name='baths')
    availability = filters.CharFilter(field_name='availability', lookup_expr='icontains')
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    class Meta:
        model = Property
        fields = ['place', 'beds', 'baths', 'availability', 'price_min', 'price_max']
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def paginate_queryset(self, queryset, request, view=None):
        page = request.query_params.get('page')
        page_size = request.query_params.get('page_size')
        
        if page is not None or page_size is not None:
            return super().paginate_queryset(queryset, request, view)
        else:
            return None

    def get_paginated_response(self, data):
        if self.page is not None or self.page_size is not None:
            return super().get_paginated_response(data)
        else:
            return Response(data)
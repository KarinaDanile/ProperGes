from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Agent, Property, Visit, Client, PropertyImage, Reservation, Offer, Sale

admin.site.register(Agent, UserAdmin)
admin.site.register(Property)
admin.site.register(Visit)
admin.site.register(Client)
admin.site.register(PropertyImage)
admin.site.register(Reservation)
admin.site.register(Offer)
admin.site.register(Sale)
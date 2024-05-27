from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Agent, Property, Visit

admin.site.register(Agent, UserAdmin)
admin.site.register(Property)
admin.site.register(Visit)
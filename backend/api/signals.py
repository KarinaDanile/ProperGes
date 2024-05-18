from django.dispatch import receiver
from django.contrib.auth.models import Group
from django.db.models.signals import post_migrate

@receiver(post_migrate)
def create_admin_group(sender, **kwargs):
    if not Group.objects.filter(name='adminGroup').exists():
        Group.objects.create(name='adminGroup')





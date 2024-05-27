from django.dispatch import receiver
from django.contrib.auth.models import Group
from api.models import Agent, PropertyImage
from django.db.models.signals import post_migrate, post_delete

@receiver(post_migrate)
def create_initial_user_and_group(sender, **kwargs):
    group, created = Group.objects.get_or_create(name='adminGroup')

    if not Agent.objects.filter(username='admin').exists():
        agent = Agent.objects.create_superuser('admin', 'admin@example.com', 'admin')
        agent.groups.add(group)
        agent.is_admin = True
        agent.save()

@receiver(post_delete, sender=PropertyImage)
def delete_file_on_image_delete(sender, instance, **kwargs):
    instance.image.delete(False)
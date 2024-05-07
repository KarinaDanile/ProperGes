from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser

#@receiver(post_save, sender=CustomUser)
#def send_email_verification(sender, instance, created, **kwargs):
#    if created and not instance.email_verified:
#        verification_link = f'http://localhost:8000/api/verify-email/{instance.id}/'
#        subject = 'Verifica tu correo electrónico'
#        message = f'Hola {instance.username}, verifica tu correo electrónico en el siguiente enlace: {verification_link}'
#        from_email = settings.EMAIL_HOST_USER
#        recipient_list = [instance.email]
#        send_mail(subject, message, from_email, recipient_list)
        
#@receiver(post_save, sender=CustomUser)
#def send_welcome_email(sender, instance, created, **kwargs):
#    if created and instance.email_verified:
#        subject = 'Bienvenido a nuestra plataforma'
#        message = f'Hola {instance.username}, bienvenido a nuestra plataforma'
#        from_email = settings.EMAIL_HOST_USER
#        recipient_list = [instance.email]
#        send_mail(subject, message, from_email, recipient_list)
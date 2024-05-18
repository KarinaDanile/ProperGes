from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
import os

def get_upload_path(instance, filename):
    return os.path.join(
        'images', 'avatar', str(instance.property.id), filename)

# Custom user / Agent
class Agent(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)  
    is_admin = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to=get_upload_path, blank=True, null=True)
    
    def __str__(self):
        return self.username

class Client(models.Model):
    client_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    client_type_options = [
        ('comprador', 'Comprador'),
        ('vendedor', 'Vendedor'),
        ('ambos', 'Comprador y vendedor'), 
    ]
    client_type = models.CharField(max_length=100, choices=client_type_options, default='comprador')
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    

class Property(models.Model):
    property_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # place_name is the full address
    place_name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    city = models.CharField(max_length=100, blank=True, null=True)
    beds = models.IntegerField()
    baths = models.IntegerField()
    sqft = models.IntegerField()
    owner = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='properties')
    
    type_options = [
        ('', 'Selecciona tipo de propiedad'),
        ('apartamento', 'Apartamento'),
        ('casa', 'Casa'),
        ('chalet', 'Chalet'),
        ('duplex', 'Duplex'),
        ('estudio', 'Estudio'),
        ('local', 'Local'),
        ('oficina', 'Oficina'),
        ('piso', 'Piso'),
        ('plaza_garaje', 'Plaza de garaje'),
        ('solar', 'Solar'),
        ('trastero', 'Trastero'),
        ('villa', 'Villa'),
        ('otro', 'Otro')   
    ]
    property_type = models.CharField(max_length=100, choices=type_options, default='')
    is_available = models.BooleanField(default=True)
    list_date = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id
    

class PropertyImage(models.Model):
    product = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property/images', blank=True, null=True)

    
class Invitation(models.Model):
    invite_id = models.AutoField(primary_key=True)
    email = models.EmailField()
    token_sent = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='invitations')
    for_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email
    
class Comment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(Agent, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
    
class Visit(models.Model):
    visit_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='visits')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='visits')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='visits')
    date = models.DateTimeField()
    comments = models.CharField(max_length=200, blank=True, null=True)
    visit_state_options = [
        ('realizada', 'Visita realizada'),
        ('no_realizada', 'Visita no realizada'),
        ('pendiente', 'Visita pendiente'),
        ('cancelada', 'Visita cancelada')   
    ]
    visit_state = models.CharField(max_length=100, choices=visit_state_options, default='pendiente')

    def __str__(self):
        return self.property.address
    
class Offer(models.Model):
    offer_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='offers')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='offers')
    offered_price = models.DecimalField(max_digits=10, decimal_places=2)
    created = models.DateTimeField(auto_now_add=True)
    comments = models.CharField(max_length=200, blank=True, null=True)
    offer_state_options = [
        ('aceptada', 'Oferta aceptada'),
        ('rechazada', 'Oferta rechazada'),
        ('pendiente', 'Oferta pendiente'),
        ('cancelada', 'Oferta cancelada')   
    ]
    offer_state = models.CharField(max_length=100, choices=offer_state_options, default='pendiente')

    def __str__(self):
        return self.property.address
    
class Reservation(models.Model):
    reserve_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='reservations')
    reservation_date = models.DateTimeField()
    comments = models.CharField(max_length=200, blank=True, null=True)
    reservation_state_options = [
        ('reservada', 'Reserva realizada'),
        ('no_reservada', 'Reserva no realizada'),
        ('pendiente', 'Reserva pendiente'),
        ('cancelada', 'Reserva cancelada')   
    ]
    reservation_state = models.CharField(max_length=100, choices=reservation_state_options, default='pendiente')

    def __str__(self):
        return self.property.address
    
class Sale(models.Model):
    sale_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='sales')
    sale_date = models.DateTimeField()
    comments = models.CharField(max_length=200, blank=True, null=True)
    sale_state_options = [
        ('vendida', 'Venta realizada'),
        ('no_vendida', 'Venta no realizada'),
        ('pendiente', 'Venta pendiente'),
        ('cancelada', 'Venta cancelada')   
    ]
    sale_state = models.CharField(max_length=100, choices=sale_state_options, default='pendiente')

    def __str__(self):
        return self.property.address

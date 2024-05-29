from django.db import models, transaction
import uuid
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
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
        if self.email and self.phone:
            return f"{self.name} - {self.email} - {self.phone}"
        else:
            return f"{self.name} - {self.email or ''} {self.phone or ''}"
    

class Property(models.Model):
    property_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.IntegerField()
    # place_name is the full address
    place_name = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.CharField(max_length=100, blank=True, null=True)
    longitude = models.CharField(max_length=100, blank=True, null=True)
    # place is city or town
    place = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    beds = models.IntegerField()
    baths = models.IntegerField()
    sqft = models.IntegerField()
    state_options = [
        ('buen_estado', 'Buen estado'),
        ('a_reformar', 'A reformar'),
        ('reformado', 'Reformado'),
        ('nuevo', 'Nuevo')
    ]
    state = models.CharField(max_length=100, choices=state_options, default='buen_estado')
    owner = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='properties')
    description = models.TextField(blank=True, null=True)
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
        ('solar', 'Solar'),
        ('trastero', 'Trastero'),
        ('villa', 'Villa'),
        ('otro', 'Otro')   
    ]
    availability_options = [
        ('disponible', 'Disponible'),
        ('reservada', 'Reservada'),
        ('vendida', 'Vendida'),
    ]
    property_type = models.CharField(max_length=100, choices=type_options, default='')
    availability = models.CharField(max_length=100, choices=availability_options, default='disponible')
    year_built = models.IntegerField(blank=True, null=True)
    is_negotiable = models.BooleanField(default=True)
    list_date = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)
    reference = models.CharField(max_length=50, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.reference:
            with transaction.atomic():
                last_property = Property.objects.select_for_update().order_by('reference').last()
                if not last_property:
                    self.reference = 'REF-0001'
                else:
                    ref = last_property.reference
                    ref_number = int(ref.split('-')[-1])
                    self.reference = 'REF-%04d' % (ref_number + 1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} - {self.property_type} en {self.place} - {self.price}€"
    

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property/images', blank=True, null=True)

    def delete(self, *args, **kwargs):
        self.image.delete(save=False)
        super().delete(*args, **kwargs)
    
class Invitation(models.Model):
    invite_id = models.AutoField(primary_key=True)
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='invitations')
    is_used = models.BooleanField(default=False)
    #for_admin = models.BooleanField(default=False)
    
    def is_valid(self):
        valid_period = timezone.timedelta(days=1)
        return (self.created + valid_period) > timezone.now() and not self.is_used
    
    def __str__(self):
        return f"Invitación a {self.email} de {self.sender}"
    
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
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_visits')
    property_id = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_visits')
    agent_id = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='agent_visits')
    start = models.DateTimeField(null=True, blank=True)
    comments = models.CharField(max_length=200, blank=True, null=True)
    visit_state_options = [
        ('realizada', 'Visita realizada'),
        ('pendiente', 'Visita pendiente'),
        ('cancelada', 'Visita cancelada')   
    ]
    visit_state = models.CharField(max_length=100, choices=visit_state_options, default='pendiente')

    def __str__(self):
        return f"Visita en {self.property_id} con {self.client_id}"
    
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
        return f"Oferta de {self.offered_price} en ({self.property}) por ({self.client})"
    
class Reservation(models.Model):
    reserve_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reservations')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reservations')
    reservation_date = models.DateTimeField()
    price_acorded = models.DecimalField(max_digits=10, decimal_places=2)
    reservation_state_options = [
        ('reservada', 'Reserva realizada'),
        ('cancelada', 'Reserva cancelada')   
    ]
    reservation_state = models.CharField(max_length=100, choices=reservation_state_options, default='reservada')

    def __str__(self):
        return f"Reserva de ({self.property}) por ({self.client})"
    
class Sale(models.Model):
    sale_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='sales')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='sales')
    sale_date = models.DateTimeField()
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Compra de ({self.property}) por ({self.client}) en {self.sale_date} por {self.sale_price}"
    
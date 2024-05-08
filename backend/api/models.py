from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user / Agent
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)  
    #email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Property(models.Model):
    id = models.AutoField(primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    #beds = models.IntegerField()
    #baths = models.IntegerField()
    #sqft = models.IntegerField()
    #province = models.CharField(max_length=100)
    #state = models.CharField(max_length=100) # comunidades autónomas
    #owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='properties')
    #home_type = models.CharField(max_length=100)
    #photo_main = models.ImageField(upload_to='photos/%Y/%m/%d/')
    is_published = models.BooleanField(default=True)
    list_date = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id
    
    
class Invitation(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField()
    token_sent = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
class Client(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    created = models.DateTimeField(auto_now_add=True)
    buyer = models.BooleanField(default=False)
    seller = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
    
class Visit(models.Model):
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='visits')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='visits')
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='visits')
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
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='offers')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='offers')
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='offers')
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
    id = models.AutoField(primary_key=True)
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
    id = models.AutoField(primary_key=True)
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
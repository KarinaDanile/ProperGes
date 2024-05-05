from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    #email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    # related_name
    # REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


class Property(models.Model):
    id = models.AutoField(primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    #beds = models.IntegerField()
    #baths = models.IntegerField()
    #sqft = models.IntegerField()
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
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
    
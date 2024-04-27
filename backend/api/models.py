from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    # related_name
    # REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username



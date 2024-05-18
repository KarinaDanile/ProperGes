# Generated by Django 4.2.11 on 2024-05-18 10:27

import api.models
from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to=api.models.get_upload_path)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('client_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('client_type', models.CharField(choices=[('comprador', 'Comprador'), ('vendedor', 'Vendedor'), ('ambos', 'Comprador y vendedor')], default='comprador', max_length=100)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('offer_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('offered_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('comments', models.CharField(blank=True, max_length=200, null=True)),
                ('offer_state', models.CharField(choices=[('aceptada', 'Oferta aceptada'), ('rechazada', 'Oferta rechazada'), ('pendiente', 'Oferta pendiente'), ('cancelada', 'Oferta cancelada')], default='pendiente', max_length=100)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to='api.client')),
            ],
        ),
        migrations.CreateModel(
            name='Property',
            fields=[
                ('property_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('address', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('beds', models.IntegerField()),
                ('baths', models.IntegerField()),
                ('sqft', models.IntegerField()),
                ('province', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('property_type', models.CharField(choices=[('', 'Selecciona tipo de propiedad'), ('apartamento', 'Apartamento'), ('casa', 'Casa'), ('chalet', 'Chalet'), ('duplex', 'Duplex'), ('estudio', 'Estudio'), ('local', 'Local'), ('oficina', 'Oficina'), ('piso', 'Piso'), ('plaza_garaje', 'Plaza de garaje'), ('solar', 'Solar'), ('trastero', 'Trastero'), ('villa', 'Villa'), ('otro', 'Otro')], default='', max_length=100)),
                ('is_available', models.BooleanField(default=True)),
                ('list_date', models.DateTimeField(auto_now_add=True)),
                ('update', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='properties', to='api.client')),
            ],
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('reserve_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reservation_date', models.DateTimeField()),
                ('comments', models.CharField(blank=True, max_length=200, null=True)),
                ('reservation_state', models.CharField(choices=[('reservada', 'Reserva realizada'), ('no_reservada', 'Reserva no realizada'), ('pendiente', 'Reserva pendiente'), ('cancelada', 'Reserva cancelada')], default='pendiente', max_length=100)),
                ('offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='api.offer')),
            ],
        ),
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('visit_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('comments', models.CharField(blank=True, max_length=200, null=True)),
                ('visit_state', models.CharField(choices=[('realizada', 'Visita realizada'), ('no_realizada', 'Visita no realizada'), ('pendiente', 'Visita pendiente'), ('cancelada', 'Visita cancelada')], default='pendiente', max_length=100)),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to=settings.AUTH_USER_MODEL)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to='api.client')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to='api.property')),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('sale_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('sale_date', models.DateTimeField()),
                ('comments', models.CharField(blank=True, max_length=200, null=True)),
                ('sale_state', models.CharField(choices=[('vendida', 'Venta realizada'), ('no_vendida', 'Venta no realizada'), ('pendiente', 'Venta pendiente'), ('cancelada', 'Venta cancelada')], default='pendiente', max_length=100)),
                ('reservation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales', to='api.reservation')),
            ],
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='property/images')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.property')),
            ],
        ),
        migrations.AddField(
            model_name='offer',
            name='property',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to='api.property'),
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('invite_id', models.AutoField(primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('token_sent', models.CharField(max_length=100)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('for_admin', models.BooleanField(default=False)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.client')),
            ],
        ),
    ]

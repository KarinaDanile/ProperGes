# Generated by Django 4.2.11 on 2024-05-19 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_address_property_place_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='latitude',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='longitude',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='place_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='property_type',
            field=models.CharField(choices=[('', 'Selecciona tipo de propiedad'), ('apartamento', 'Apartamento'), ('casa', 'Casa'), ('chalet', 'Chalet'), ('duplex', 'Duplex'), ('estudio', 'Estudio'), ('local', 'Local'), ('oficina', 'Oficina'), ('piso', 'Piso'), ('solar', 'Solar'), ('trastero', 'Trastero'), ('villa', 'Villa'), ('otro', 'Otro')], default='', max_length=100),
        ),
    ]
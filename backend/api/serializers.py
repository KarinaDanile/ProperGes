from rest_framework import serializers
from .models import Agent, Property, PropertyImage, Client

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['username', 'password', 'email', 'phone', 'is_active', 'is_admin']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = Agent(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields =  '__all__'


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False), 
        write_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'
        # en el tutorial se listan todos los campos individualmente y se añade el de
        # images que es el related name de PropertyImage para listar las imagenes
        # y uploaded_images para subir imagenes
        # hay que ver si funciona con '__all__'

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        property = Property.objects.create(**validated_data)
        for image in uploaded_images:
            PropertyImage.objects.create(product=property, image=image)
        return property
        
class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['avatar']
    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance
    
    
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
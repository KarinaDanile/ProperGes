from rest_framework import serializers
from .models import (
    Agent, Property, PropertyImage, 
    Client, Visit, Offer
)

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id','username', 'password', 'email', 'phone', 'is_active', 'is_admin']
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
    id = serializers.IntegerField()
    
    class Meta:
        model = PropertyImage
        fields =  '__all__'


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True, required=False)
    iden_property = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = '__all__'
        
    def get_iden_property(self, obj):
        return str(obj)

    def create(self, validated_data):
        images = self.context.get('request').FILES.getlist('images')
        
        property = Property.objects.create(**validated_data)
        
        for image in images:
            PropertyImage.objects.create(property=property, image=image)
        return property
 
    def update(self, instance, validated_data):
        images_data = self.context.get('request').FILES.getlist('images', [])
        
        instance.__dict__.update(validated_data)
        instance.save()
        
        for image in images_data:
            PropertyImage.objects.create(property=instance, image=image)
        return instance
 

 
 
        
class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['avatar']
    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance
    
    
class ClientSerializer(serializers.ModelSerializer):
    iden_client = serializers.SerializerMethodField()
    class Meta:
        model = Client
        fields = '__all__'
    
    def get_iden_client(self, obj):
        return str(obj)
        
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Agent
        fields = ['old_password', 'new_password']
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Contraseña antigua incorrecta')
        return value
    #def validate_new_password(self, value):
    #    if len(value) < 8:
    #        raise serializers.ValidationError('La nueva contraseña debe tener al menos 8 caracteres')
    #    return value
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    
    
class VisitSerializer(serializers.ModelSerializer):
    property_iden = serializers.SerializerMethodField()
    client_iden = serializers.SerializerMethodField()
    property_address = serializers.SerializerMethodField()
    property_reference = serializers.SerializerMethodField()
    agent_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Visit
        fields = '__all__'
    
    def get_property_iden(self, obj):
        property = Property.objects.get(property_id=obj.property_id.pk)
        return str(property)
    
    def get_property_address(self, obj):
        property = Property.objects.get(property_id=obj.property_id.pk)
        return str(property.place_name)
    
    def get_property_reference(self, obj):
        property = Property.objects.get(property_id=obj.property_id.pk)
        return str(property.reference)

    def get_client_iden(self, obj):
        client = Client.objects.get(client_id=obj.client_id.pk)
        return str(client)
        
    def get_agent_name(self, obj):
        agent = Agent.objects.get(id=obj.agent_id.pk)
        return str(agent)
        
class OfferSerializer(serializers.ModelSerializer):
    property_iden = serializers.SerializerMethodField()
    client_iden = serializers.SerializerMethodField()
    property_address = serializers.SerializerMethodField()
     
    class Meta:
        model = Offer
        fields = '__all__'

    def get_property_iden(self, obj):
        property = Property.objects.get(property_id=obj.property_id)
        return str(property)
    
    def get_property_address(self, obj):
        property = Property.objects.get(property_id=obj.property_id)
        return str(property.place_name)
    
    def get_client_iden(self, obj):
        client = Client.objects.get(client_id=obj.client_id)
        return str(client)
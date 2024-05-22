from rest_framework import serializers
from .models import Agent, Property, PropertyImage, Client

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
    class Meta:
        model = PropertyImage
        fields =  '__all__'


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True, required=False)
    
    class Meta:
        model = Property
        fields = '__all__'

    def create(self, validated_data):
        images = self.context.get('request').FILES.getlist('images')
        
        property = Property.objects.create(**validated_data)
        
        for image in images:
            PropertyImage.objects.create(property=property, image=image)
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
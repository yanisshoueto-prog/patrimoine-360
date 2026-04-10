from rest_framework import serializers
from .models import Artisan, Museum, Artwork, ArtworkPhoto, Subscription

class ArtisanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artisan
        fields = '__all__'

class MuseumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Museum
        fields = '__all__'

class ArtworkPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkPhoto
        fields = ['id', 'image', 'legende', 'ordre']

class ArtworkSerializer(serializers.ModelSerializer):
    artisan_details = ArtisanSerializer(source='artisan', read_only=True)
    museum_details = MuseumSerializer(source='museum', read_only=True)
    photos = ArtworkPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = '__all__'
        extra_kwargs = {
            'artisan': {'required': False, 'allow_null': True},
            'museum': {'required': False, 'allow_null': True},
            'storytelling_audio': {'required': False, 'allow_null': True},
            'qr_code': {'required': False, 'allow_null': True},
            'prix': {'required': False, 'allow_null': True},
            'technique': {'required': False, 'allow_null': True},
            'matiere': {'required': False, 'allow_null': True},
            'dimensions': {'required': False, 'allow_null': True},
            'periode': {'required': False, 'allow_null': True},
            'region': {'required': False, 'allow_null': True},
            'signification': {'required': False, 'allow_null': True},
            'storytelling_texte': {'required': False},
        }

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

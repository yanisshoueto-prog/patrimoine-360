from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Artisan, Museum, Artwork, ArtworkPhoto, Subscription
from .serializers import ArtisanSerializer, MuseumSerializer, ArtworkSerializer, ArtworkPhotoSerializer, SubscriptionSerializer

class ArtisanViewSet(viewsets.ModelViewSet):
    queryset = Artisan.objects.all()
    serializer_class = ArtisanSerializer

class MuseumViewSet(viewsets.ModelViewSet):
    queryset = Museum.objects.all()
    serializer_class = MuseumSerializer

class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=True, methods=['post'], url_path='add-photo')
    def add_photo(self, request, pk=None):
        """Add an extra photo to an artwork (max 5 total)"""
        artwork = self.get_object()
        if artwork.photos.count() >= 5:
            return Response({'error': 'Maximum 5 photos par œuvre.'}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.FILES.get('image')
        legende = request.data.get('legende', '')
        if not image:
            return Response({'error': 'Image requise.'}, status=status.HTTP_400_BAD_REQUEST)
        
        photo = ArtworkPhoto.objects.create(
            artwork=artwork,
            image=image,
            legende=legende,
            ordre=artwork.photos.count()
        )
        return Response(ArtworkPhotoSerializer(photo).data, status=status.HTTP_201_CREATED)

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

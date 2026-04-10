from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtisanViewSet, MuseumViewSet, ArtworkViewSet, SubscriptionViewSet
from .auth_views import RegisterView, LoginView

router = DefaultRouter()
router.register(r'artisans', ArtisanViewSet)
router.register(r'museums', MuseumViewSet)
router.register(r'artworks', ArtworkViewSet)
router.register(r'subscriptions', SubscriptionViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]

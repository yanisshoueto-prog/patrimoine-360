from django.contrib import admin
from .models import Artisan, Museum, Artwork, Subscription

@admin.register(Artisan)
class ArtisanAdmin(admin.ModelAdmin):
    list_display = ('nom', 'ville', 'type_abonnement', 'date_abonnement')
    list_filter = ('type_abonnement', 'ville')
    search_fields = ('nom', 'ville')

@admin.register(Museum)
class MuseumAdmin(admin.ModelAdmin):
    list_display = ('nom', 'ville', 'abonnement_actif')
    list_filter = ('abonnement_actif', 'ville')
    search_fields = ('nom', 'ville')

@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('titre', 'artisan', 'museum', 'prix', 'date_creation')
    list_filter = ('date_creation',)
    search_fields = ('titre', 'artisan__nom', 'museum__nom')
    readonly_fields = ('qr_code',)

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('type', 'artisan', 'museum', 'date_debut', 'date_fin')
    list_filter = ('type', 'date_debut')

from django.db import models
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
import uuid

class Artisan(models.Model):
    SUBSCRIPTION_CHOICES = [
        ('Free', 'Free'),
        ('Premium', 'Premium'),
    ]
    nom = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='artisans/', blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True)
    specialite = models.CharField(max_length=200, blank=True, null=True)
    type_abonnement = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, default='Free')
    date_abonnement = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nom

class Museum(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    photo = models.ImageField(upload_to='museums/', blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True)
    abonnement_actif = models.BooleanField(default=False)

    def __str__(self):
        return self.nom

class Artwork(models.Model):
    TECHNIQUE_CHOICES = [
        ('bronze', 'Fonte au bronze'),
        ('bois', 'Sculpture sur bois'),
        ('textile', 'Tissage / Textile'),
        ('ceramique', 'Céramique / Poterie'),
        ('cauris', 'Art des Cauris'),
        ('peinture', 'Peinture sur tissu'),
        ('vannerie', 'Vannerie'),
        ('autre', 'Autre'),
    ]
    REGION_CHOICES = [
        ('cotonou', 'Cotonou'),
        ('porto-novo', 'Porto-Novo'),
        ('ouidah', 'Ouidah'),
        ('abomey', 'Abomey'),
        ('parakou', 'Parakou'),
        ('natitingou', 'Natitingou'),
        ('autre', 'Autre'),
    ]

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    titre = models.CharField(max_length=200)
    storytelling_texte = models.TextField(blank=True)
    storytelling_audio = models.FileField(upload_to='audios/', blank=True, null=True)
    image = models.ImageField(upload_to='artworks/')
    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)
    
    # Champs cartel enrichis
    technique = models.CharField(max_length=50, choices=TECHNIQUE_CHOICES, blank=True, null=True)
    matiere = models.CharField(max_length=200, blank=True, null=True, verbose_name="Matière(s)")
    dimensions = models.CharField(max_length=100, blank=True, null=True, verbose_name="Dimensions (cm)")
    periode = models.CharField(max_length=100, blank=True, null=True, verbose_name="Période / Année")
    region = models.CharField(max_length=50, choices=REGION_CHOICES, blank=True, null=True, verbose_name="Région d'origine")
    signification = models.TextField(blank=True, null=True, verbose_name="Signification culturelle")
    
    prix = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    artisan = models.ForeignKey(Artisan, on_delete=models.CASCADE, related_name='artworks', null=True, blank=True)
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, related_name='artworks', null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            qrcode_img = qrcode.make(f"https://mon-histoire.com/artwork/{self.uuid}")
            fname = f'qr-code-{self.uuid}.png'
            buffer = BytesIO()
            qrcode_img.save(buffer, 'PNG')
            self.qr_code.save(fname, File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class ArtworkPhoto(models.Model):
    """Photos supplémentaires d'une œuvre (jusqu'à 5)"""
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='artwork_photos/')
    legende = models.CharField(max_length=200, blank=True)
    ordre = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return f"Photo {self.ordre} — {self.artwork.titre}"


class Subscription(models.Model):
    artisan = models.ForeignKey(Artisan, on_delete=models.CASCADE, null=True, blank=True)
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=100)
    date_debut = models.DateTimeField(default=timezone.now)
    date_fin = models.DateTimeField(null=True, blank=True)
    stripe_session_id = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.type} - {self.artisan or self.museum}"

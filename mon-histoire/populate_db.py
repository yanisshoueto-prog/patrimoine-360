import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django
django.setup()

from api.models import Artisan, Artwork
from django.core.files.base import ContentFile
import urllib.request
from io import BytesIO

# Clean up existing data for fresh population
Artwork.objects.all().delete()
Artisan.objects.all().delete()

# Create Artisans
artisans_data = [
    {
        "username": "glele_fon",
        "nom": "Atelier Glèlè (Tradition Fon)",
        "bio": "Héritiers des anciens forgerons d'Abomey, nous préservons l'art de la fonte à la cire perdue et des trônes royaux du Danhomè.",
        "ville": "Abomey"
    },
    {
        "username": "gelede_master",
        "nom": "Olofin Gèlèdé",
        "bio": "Sculpteur initié de la confrérie Gèlèdé à Kétou. Je sculpte la mémoire des mères et l'harmonie de la communauté Yoruba.",
        "ville": "Kétou"
    },
    {
        "username": "egungun_spirit",
        "nom": "Société Egungun d'Ouidah",
        "bio": "Gardiens des esprits des ancêtres. Nos créations textiles et masques assurent le lien perpétuel entre le monde visible et invisible.",
        "ville": "Ouidah"
    }
]

artisans = {}
for data in artisans_data:
    artisan = Artisan.objects.create(nom=data["nom"], bio=data["bio"], ville=data["ville"])
    artisans[data["username"]] = artisan

# Create Artworks
artworks_data = [
    {
        "artisan": artisans["glele_fon"],
        "titre": "Masque de Bronze de la Reine Mère",
        "signification": "Une tête en bronze magnifiquement détaillée représentant la Reine Mère (Iyoba). Symbole de puissance et de protection de la lignée royale, cette œuvre utilise la technique de la cire perdue héritée de nos ancêtres.",
        "storytelling_texte": "Autrefois, ces têtes ornaient les autels royaux en l'honneur des mères des souverains. Elles étaient le réceptacle des prières pour la prospérité du royaume d'Abomey et du grand empire de Benin.",
        "image_url": "https://www.artic.edu/iiif/2/41b0cc6b-a4ed-5367-1450-595565f077a8/full/843,/0/default.jpg",
        "technique": "bronze",
        "region": "abomey"
    },
    {
        "artisan": artisans["glele_fon"],
        "titre": "Trône du Roi",
        "signification": "Reproduction fidèle du siège royal historique de la cour d'Abomey, taillé dans un grand bloc de bois et richement sculpté.",
        "storytelling_texte": "Les trônes (ou Kataklè) étaient sacrés. Ils racontaient l'histoire du roi régnant et servaient d'assise spirituelle. Ce trône évoque la puissance, la stabilité et le lien indéfectible avec la terre des ancêtres Fon.",
        "image_url": "https://www.artic.edu/iiif/2/fc361495-826f-3ef9-32d3-da3eac34c34a/full/843,/0/default.jpg",
        "technique": "bois",
        "region": "abomey"
    },
    {
        "artisan": artisans["gelede_master"],
        "titre": "Masque Gèlèdé de Kétou",
        "signification": "Masque facial surmonté d'une imposante sculpture symbolisant la fertilité, l'agriculture et le respect dû aux mères ('Iya Nla').",
        "storytelling_texte": "Dans la région de Kétou, la danse Gèlèdé est pratiquée pour apaiser les mères ancestrales. Le masque ne se porte pas sur le visage mais au sommet du crâne, et chaque motif sculpté porte un proverbe Yoruba.",
        "image_url": "https://www.artic.edu/iiif/2/777fe354-00d4-f74e-bca0-c60e52ba6bc2/full/843,/0/default.jpg",
        "technique": "bois",
        "region": "autre"
    },
    {
        "artisan": artisans["egungun_spirit"],
        "titre": "Costume Egungun Ancestral",
        "signification": "Habit rituel composé de multiples pans de tissus colorés accumulés, caché derrière un masque en perles et cauris.",
        "storytelling_texte": "Sortant lors des célébrations, le revenant Egungun est le garant de l'ordre social et spirituel. Derrière ce costume riche se cache l'esprit des morts qui revient bénir ou punir les vivants.",
        "image_url": "https://www.artic.edu/iiif/2/b2eb08a6-8ef8-2351-a968-5a4b1941b319/full/843,/0/default.jpg",
        "technique": "textile",
        "region": "ouidah"
    },
    {
        "artisan": artisans["glele_fon"],
        "titre": "Récade (Makpo) Royale",
        "signification": "Bâton de commandement, emblème du roi, se terminant souvent par une lame asymétrique ou une représentation animale.",
        "storytelling_texte": "La récade était la 'voix' du roi. Le messager qui la portait avait autorité absolue pour transmettre les ordres royaux à travers le royaume du Danhomè. Elle incarne un droit divin et un commandement inviolable.",
        "image_url": "https://www.artic.edu/iiif/2/5367bf4c-ad3a-53d1-9992-dddd419dea32/full/843,/0/default.jpg",
        "technique": "bois",
        "region": "abomey"
    },
    {
        "artisan": artisans["gelede_master"],
        "titre": "Plaque des Dignitaires",
        "signification": "Petite sculpture plate en laiton et bronze illustrant des dignitaires de la cour en tenue d'apparat.",
        "storytelling_texte": "Ces plaques ornaient initialement les piliers des palais royaux. Elles permettaient de codifier et d'archiver visuellement la structure hiérarchique du royaume, constituant une véritable bibliothèque en bronze.",
        "image_url": "https://www.artic.edu/iiif/2/f6c3b597-39af-568c-f9d2-788d18e17c6e/full/843,/0/default.jpg",
        "technique": "bronze",
        "region": "autre"
    }
]

from PIL import Image, ImageDraw

print(f"Adding {len(artworks_data)} artworks...")
for artwork in artworks_data:
    # Use PIL to safely construct a colored image to avoid network / DNS issues on the CI runner
    img = Image.new('RGB', (800, 800), color=(140, 82, 45))  # Brown / Teracotta color resembling African clay
    d = ImageDraw.Draw(img)
    # Provide a simple placeholder visual for the DB items
    buffer = BytesIO()
    img.save(buffer, 'JPEG')
    img_name = f"artwork_{artwork['technique']}.jpg"
    
    aw = Artwork.objects.create(
        artisan=artwork["artisan"],
        titre=artwork["titre"],
        signification=artwork["signification"],
        storytelling_texte=artwork["storytelling_texte"],
        technique=artwork["technique"],
        region=artwork["region"]
    )
    aw.image.save(img_name, ContentFile(buffer.getvalue()), save=True)
    print(f"Created artwork: {aw.titre}")

print("Fake database successfully hydrated with realistic Benin artifacts!")

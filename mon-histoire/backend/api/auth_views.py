from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Artisan

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        nom = request.data.get('nom')
        ville = request.data.get('ville', '')
        bio = request.data.get('bio', '')

        if not username or not password or not nom:
            return Response({'error': 'Veuillez remplir tous les champs obligatoires (username, password, nom)'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Cet identifiant existe déjà'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        artisan = Artisan.objects.create(nom=nom, ville=ville, bio=bio)
        token = Token.objects.create(user=user)
        
        return Response({'token': token.key, 'artisan_id': artisan.id}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

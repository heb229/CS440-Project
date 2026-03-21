from django.urls import path
from . import views

urlpatterns = [
    path('movie_critiques', views.home),
]
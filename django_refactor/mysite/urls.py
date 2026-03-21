"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from index import views as index_views
from movie_critiques import views as movie_crit_views
from movie import views as movie_views
from person import views as person_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_views.index, name="index"),
    path('movie_critiques', movie_crit_views.movie_crit, name="movie_critiques"),
    path('person', person_views.person, name="person"),
    path('movies', index_views.index, name="movies"),
    path('movie', movie_views.movie, name="movie"),
    # API Endpoints
    path('api/critiques/', movie_crit_views.critiques_api, name='critiques_api'),
    path('api/movies/', movie_views.movies_api, name='movies_api'),
    path('api/movies/<int:movie_id>/', movie_views.movie_detail_api, name='movie_detail_api'),
    path('api/person/<int:person_id>/', person_views.person_detail_api, name='person_detail_api'),
    path('api/items/', index_views.items_api, name='items_api'),
    path('api/stats/', index_views.stats_api, name='stats_api'),
]

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import Movie
import json

def movie(request):
    return render(request, "movie.html")

@require_http_methods(["GET"])
def movies_api(request):
    search = request.GET.get('search', '')
    genre = request.GET.get('genre', '')
    mode = request.GET.get('mode', 'or')
    sort = request.GET.get('sort', 'title')
    order = request.GET.get('order', 'asc')
    year = request.GET.get('year')
    decade = request.GET.get('decade')
    
    query = Movie.objects.all()
    
    # Search by title
    if search:
        query = query.filter(title__icontains=search)
    
    # Filter by genre
    if genre:
        genres = [g.strip() for g in genre.split(',')]
        if mode == 'or':
            q_objects = Q()
            for g in genres:
                q_objects |= Q(genre__icontains=g)
            query = query.filter(q_objects)
        else:
            for g in genres:
                query = query.filter(genre__icontains=g)
    
    # Year filter
    if year:
        query = query.filter(year=int(year))
    
    # Decade filter
    if decade:
        start = int(decade)
        query = query.filter(year__gte=start, year__lt=start + 10)
    
    # Sorting
    sort_field = sort if sort in ['title', 'year', 'rating'] else 'title'
    sort_prefix = '-' if order == 'desc' else ''
    query = query.order_by(f'{sort_prefix}{sort_field}')
    
    data = [
        {
            'id': m.id,
            'title': m.title,
            'year': m.year,
            'rating': m.rating,
            'genre': m.genre,
            'synopsis': m.synopsis,
            'director_id': m.director_id,
            'director_name': m.director.name if m.director else None,
        }
        for m in query
    ]
    return JsonResponse(data, safe=False)

@require_http_methods(["GET"])
def movie_detail_api(request, movie_id):
    try:
        movie = Movie.objects.prefetch_related('cast').get(id=movie_id)
        data = {
            'id': movie.id,
            'title': movie.title,
            'year': movie.year,
            'rating': movie.rating,
            'genre': movie.genre,
            'synopsis': movie.synopsis,
            'director_id': movie.director_id,
            'director_name': movie.director.name if movie.director else None,
            'cast': [{'id': p.id, 'name': p.name} for p in movie.cast.all()]
        }
        return JsonResponse(data)
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=404)
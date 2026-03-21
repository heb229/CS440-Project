from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Avg, Max, Min
from movie.models import Movie

def index(request):
    return render(request, "index.html")

@require_http_methods(["GET"])
def items_api(request):
    # Returns list of items - update this based on your data model
    # Placeholder: returns empty array
    return JsonResponse([], safe=False)

@require_http_methods(["GET"])
def stats_api(request):
    try:
        # Calculate movie statistics
        movie_count = Movie.objects.count()
        avg_rating = Movie.objects.aggregate(Avg('rating'))['rating__avg']
        highest_rating = Movie.objects.aggregate(Max('rating'))['rating__max']
        lowest_rating = Movie.objects.aggregate(Min('rating'))['rating__min']
        
        stats = {
            'total_movies': movie_count,
            'average_rating': round(avg_rating, 2) if avg_rating else 0,
            'highest_rating': highest_rating,
            'lowest_rating': lowest_rating,
        }
        return JsonResponse(stats)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
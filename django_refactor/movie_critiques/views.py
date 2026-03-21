from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Critique
import json

def movie_crit(request):
    return render(request, "movie_critiques.html")

@require_http_methods(["GET", "POST"])
def critiques_api(request):
    if request.method == "GET":
        movie_id = request.GET.get('movie_id')
        
        if movie_id:
            critiques = Critique.objects.filter(movie_id=movie_id).select_related('movie')
        else:
            critiques = Critique.objects.all().select_related('movie')
        
        critiques = critiques.order_by('-created_at')
        
        data = [
            {
                'id': c.id,
                'movie_id': c.movie_id,
                'movie_title': c.movie.title,
                'title': c.title,
                'author': c.author,
                'content': c.content,
                'created_at': c.created_at.isoformat(),
            }
            for c in critiques
        ]
        return JsonResponse(data, safe=False)
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            movie_id = data.get('movie_id')
            title = data.get('title')
            author = data.get('author')
            content = data.get('content')
            
            if not all([movie_id, title, author, content]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            
            critique = Critique.objects.create(
                movie_id=movie_id,
                title=title,
                author=author,
                content=content
            )
            
            return JsonResponse({
                'id': critique.id,
                'movie_id': critique.movie_id,
                'title': critique.title,
                'author': critique.author,
                'content': critique.content,
                'created_at': critique.created_at.isoformat(),
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
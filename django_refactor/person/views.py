from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from movie.models import Person, Movie

def person(request):
    return render(request, "person.html")

@require_http_methods(["GET"])
def person_detail_api(request, person_id):
    try:
        person_obj = Person.objects.get(id=person_id)
        
        # Get movies they acted in
        acted_movies = list(person_obj.acted_movies.values('id', 'title', 'year', 'rating', 'genre', 'synopsis'))
        
        # Get movies they directed
        directed_movies = list(person_obj.directed_movies.values('id', 'title', 'year', 'rating', 'genre', 'synopsis'))
        
        data = {
            'id': person_obj.id,
            'name': person_obj.name,
            'bio': person_obj.bio,
            'acted_movies': acted_movies,
            'directed_movies': directed_movies,
        }
        return JsonResponse(data)
    except Person.DoesNotExist:
        return JsonResponse({'error': 'Person not found'}, status=404)
from django.db import models
from movie.models import Movie

class Critique(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='critiques')
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200)
    year = models.IntegerField()
    rating = models.FloatField()
    genre = models.CharField(max_length=200)  # Could be comma-separated or use choices
    synopsis = models.TextField()
    director = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, related_name='directed_movies')
    cast = models.ManyToManyField(Person, related_name='acted_movies')

    def __str__(self):
        return self.title

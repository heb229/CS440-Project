import MovieModel from '../models/movieModel.js';
import CritiqueModel from '../models/critiqueModel.js';

class MovieController
{
    // Render the home page with the list of movies and any applied filters.
    static async home(req, res)
    {
        try
        {
            const movies = await MovieModel.getAll(req.query);

            res.render('home',
            {
                movies: movies,
                filters: req.query
            });
        }
        catch (error)
        {
            res.status(500).send(error.message);
        }
    }

    // Render the page showing detailed information about a single movie.
    static async details(req, res)
    {
        try
        {
            const movieId = req.params.id;

            const movie = await MovieModel.getById(movieId);

            // If the movie does not exist, return a 404 error.
            if (!movie)
            {
                return res.status(404).send('Movie not found');
            }

            const critiques = await CritiqueModel.getAll(movieId);

            res.render('movie',
            {
                movie: movie,
                critiques: critiques
            });
        }
        catch (error)
        {
            res.status(500).send(error.message);
        }
    }
}

export default MovieController;
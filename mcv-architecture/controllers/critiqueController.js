import CritiqueModel from '../models/critiqueModel.js';

class CritiqueController
{
    // Display the page that shows all critiques in the system.
    static async list(req, res)
    {
        try
        {
            const critiques = await CritiqueModel.getAll();

            res.render('critiques',
            {
                critiques: critiques
            });
        }
        catch (error)
        {
            res.status(500).send(error.message);
        }
    }

    // Handle the form submission for creating a new critique.
    static async create(req, res)
    {
        try
        {
            const movieId = req.body.movie_id;
            const title = req.body.title;
            const author = req.body.author;
            const content = req.body.content;

            // Basic validation to ensure all fields were filled in.
            if (!movieId || !title || !author || !content)
            {
                return res.status(400).send('All fields are required');
            }

            await CritiqueModel.create(
            {
                movie_id: movieId,
                title: title,
                author: author,
                content: content
            });

            // Redirect back to the movie page after saving the critique.
            res.redirect(`/movie/${movieId}`);
        }
        catch (error)
        {
            res.status(500).send(error.message);
        }
    }
}

export default CritiqueController;
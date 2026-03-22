import express from "express";
import { getMovie, getDirector, getCast, getCatalog} from "../../business-logic-layer/movieService.js";

const router = express.Router();

// handles GET requests for retrieving a specific movies details
router.get("/:id", async(req, res) => {
    try{
        const movie = await getMovie(req.params.id);
        const directorId = movie.director_id;
        const director = await getDirector(directorId);
        const cast = await getCast(req.params.id);
        res.status(200).json({title: movie.title, synopsis: movie.description, director: director, cast:cast});
    }
    catch (err){
        res.status(400).json({err: err.message})
    }
});

// handles GET requets for retrieving movie catalog based on conditions
router.get('/', async(req, res) => {
    try{
        const {search, genre, mode = "or", sort = "title",
            order = "asc", year, decade
        } = req.query;
        
        const catalog = {search, genre, mode, sort, order, year, decade};
        const response = await getCatalog(catalog);
        res.status(200).json(response);
    }
    catch (err){
        res.status(400).json({err: err.message});
    }
})
export default router;
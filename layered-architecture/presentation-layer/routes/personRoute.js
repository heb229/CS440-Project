import express from "express";
import { getPerson, getActedMovies, getDirectedMovies } from "../../business-logic-layer/personService.js";

const router = express.Router();

// handles GET request to retrieve a persons movie details
router.get('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        // get the person
        const person = await getPerson(id);
        if(!person){
            return res.status(500).json({err: err.message});
        }
        const actedMovies = await getActedMovies(id);
        const directedMovies = await getDirectedMovies(id);
        res.status(200).json({person:person, actedMovies: actedMovies, directedMovies: directedMovies});
    }
    catch (err){
        res.status(500).json({ error: personError.message});
    }
});

export default router;
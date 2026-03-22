import express from "express";
import { getCritiques, insertCritique } from "../../business-logic-layer/critiqueService.js";

const router = express.Router();

// handles GET requests for critiques
router.get('/', async(req, res) => {
    try{
        const critiques = await getCritiques(req.query.movie_id);
        res.status(200).json(critiques);
    }
    catch (err){
        res.status(400).json({err: err.message});
    }
});

// handles POST requests for new critiques
router.post('/', async(req, res) => {
    try{
        const newCritique = await insertCritique(req.body);
        res.status(200).json(newCritique);
    }
    catch (err){
        res.status(400).json({err: err.message});
    }
})

export default router;
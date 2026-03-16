import express from 'express';
import MovieController from '../controllers/movieController.js';

// Set the router
const router = express.Router();

// Get the routes for movie details
router.get('/', MovieController.home);
router.get('/movie/:id', MovieController.details);

export default router;
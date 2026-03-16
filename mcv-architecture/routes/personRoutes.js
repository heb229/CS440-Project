import express from 'express';
import PersonController from '../controllers/personController.js';

// Set the router
const router = express.Router();

// Get the person
router.get('/:id', PersonController.details);

export default router;
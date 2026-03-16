import express from 'express';
import CritiqueController from '../controllers/critiqueController.js';

// Set router
const router = express.Router();

// Get and post the critiquea
router.get('/', CritiqueController.list);
router.post('/', CritiqueController.create);

export default router;
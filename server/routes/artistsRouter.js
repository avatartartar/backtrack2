import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';

router.get('/top10Artists', controller.getTop10Artists);

// ES6 syntax
export default router;
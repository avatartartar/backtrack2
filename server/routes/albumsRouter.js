import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';

router.get('/top10Albums', controller.getTop10Albums);

// ES6 syntax
export default router;
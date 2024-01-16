import express from 'express';
const router = express.Router();
import artistsController from '../controllers/artistsController.js';

router.get('/top10Artists', artistsController.getTop10Artists, (req, res) => {
  return res.status(200).json(res.locals.top10Artists);
});

// ES6 syntax
export default router;
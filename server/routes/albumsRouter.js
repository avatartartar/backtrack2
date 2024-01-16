import express from 'express';
const router = express.Router();
import albumsController from '../controllers/albumsController.js';

router.get('/top10Albums', albumsController.getTop10Albums, (req, res) => {
  return res.status(200).json(res.locals.top10Albums);
});

// ES6 syntax
export default router;
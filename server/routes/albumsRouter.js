import express from 'express';
const router = express.Router();
import albumsController from '../controllers/albumsController.js';

router.get('/top10Albums', albumsController.getTop10Albums, (req, res) => {
  return res.status(200).json(res.locals.top10Albums);
});


router.get('/top10AlbumsForYear', albumsController.getTop10AlbumsForYear, (req, res) => {
  return res.status(200).json(res.locals.top10AlbumsForYear);
});

router.get('/top10AlbumsForYearByMonth', albumsController.getTop10AlbumsForYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.top10AlbumsForYearByMonth);
});

// ES6 syntax
export default router;
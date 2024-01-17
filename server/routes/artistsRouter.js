import express from 'express';
const router = express.Router();
import artistsController from '../controllers/artistsController.js';

router.get('/top10Artists', artistsController.getTop10Artists, (req, res) => {
  return res.status(200).json(res.locals.top10Artists);
});

router.get('/top10ArtistsForYear', artistsController.getTop10ArtistsForYear, (req, res) => {
  return res.status(200).json(res.locals.top10ArtistsForYear);
});

router.get('/top10ArtistsForYearByMonth', artistsController.getTop10ArtistsForYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.top10ArtistsForYearByMonth);
});

// ES6 syntax
export default router;
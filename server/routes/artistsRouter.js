import express from 'express';
const router = express.Router();
import artistsController from '../controllers/artistsController.js';

router.get('/topArtists', artistsController.getTopArtists, (req, res) => {
  return res.status(200).json(res.locals.topArtists);
});

router.get('/topArtistsByYear', artistsController.getTopArtistsByYear, (req, res) => {
  return res.status(200).json(res.locals.topArtistsByYear);
});

router.get('/topArtistsByYearByMonth', artistsController.getTopArtistsByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topArtistsByYearByMonth);
});

// ES6 syntax
export default router;

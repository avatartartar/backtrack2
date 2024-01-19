import express from 'express';
const router = express.Router();
import tracksController from '../controllers/tracksController.js';

router.get('/', tracksController.getTopTracks, (req, res) => {
  return res.status(200).json(res.locals.topTracks);
});

router.get('/ByYear', tracksController.getTopTracksByYear, (req, res) => {
  return res.status(200).json(res.locals.topTracksByYear);
});

router.get('/topTracksByYearByMonth', tracksController.getTopTracksByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topTracksByYearByMonth);
});

// ES6 syntax
export default router;

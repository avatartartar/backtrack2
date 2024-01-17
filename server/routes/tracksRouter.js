import express from 'express';
const router = express.Router();
import tracksController from '../controllers/tracksController.js';

router.get('/topTracks', tracksController.getTopTracks, (req, res) => {
  return res.status(200).json(res.locals.topTracks);
});
//Ross added this to set up a route for front end slider to get tracks by year.
router.get('/topTracksByYear', tracksController.getTopTracksByYear, /* tracksController.getTracksByTimePlayed, */ (req, res) => {
  return res.status(200).json(res.locals.topTracksByYear);
  // return res.status(200).json(res.locals.TracksByTimePlayed);
});

router.get('/topTracksByYearByMonth', tracksController.getTopTracksByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topTracksByYearByMonth);
});

// ES6 syntax
export default router;

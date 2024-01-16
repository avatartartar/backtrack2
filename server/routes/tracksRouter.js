import express from 'express';
const router = express.Router();
import tracksController from '../controllers/tracksController.js'; 

router.get('/top10Tracks', tracksController.getTop10Tracks, (req, res) => {
  return res.status(200).json(res.locals.top10Tracks);
});
//Ross added this to set up a route for front end slider to get tracks by year. 
router.get('/top10TracksByYear', tracksController.getTop10TracksForYear, tracksController.getTracksByTimePlayed, (req, res) => {
  return res.status(200).json(res.locals.tracksByTotalTimePlayed)
});

// ES6 syntax
export default router;
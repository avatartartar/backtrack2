import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js'; 

router.get('/top10Tracks', controller.getTop10Tracks);
//Ross added this to set up a route for front end slider to get tracks by year. 
router.get('/top10TracksByYear', controller.getTop10TracksByYear, controller.groupByTrack, (req, res) => res.status(200).json(res.locals.groupedByTrack));

// ES6 syntax
export default router;
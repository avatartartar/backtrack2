import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';

router.get('/db/top10Albums', controller.getTop10Albums);
router.get('/db/top10Artists', controller.getTop10Artists);
router.get('/db/top10Tracks', controller.getTop10Tracks);

//Ross added this to set up a route for front end slider to get tracks by year. This is still timing out at the database call in models
router.get('/db/top10TracksByYear', controller.getTop10TracksByYear, controller.groupByTrack, (req, res) => res.status(200).json(res.locals.groupedByTrack));


// get field names
router.get('/db/getFields', controller.getFields)

// Sample route for get 10 records
router.get('/db/get10', controller.get10Sessions);

// ES6 syntax
export default router;

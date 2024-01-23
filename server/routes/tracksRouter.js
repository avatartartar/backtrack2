/**
 * @file tracksRouter.js
 * @description This file is responsible for defining the routes related to track data. It uses the tracksController to handle requests for top tracks, top tracks by year, and top tracks by year and month.
 * @requires express: The Express framework to create route handlers.
 * @imports '../controllers/tracksController.js': The controller module that contains the logic for handling track-related requests.
 *
 * @methods
 * - get /: This route handles requests to get the top tracks and responds with a JSON object.
 * - get /ByYear: This route handles requests to get the top tracks by a specific year and responds with a JSON object.
 * - get /topTracksByYearByMonth: This route handles requests to get the top tracks by a specific year and month and responds with a JSON object.
 *
 * @consumers Sends requests to the /tracks endpoint here.
 */

import express from 'express';
const router = express.Router();
import tracksController from '../controllers/tracksController.js';

router.get('/', tracksController.getTopTracks, (req, res) => {
  console.log('in tracksRouter get /');
  return res.status(200).json(res.locals.topTracks);
});

//Ross added this to set up a route for front end slider to get tracks by year.
router.get('/ByYear', tracksController.getTopTracksByYear, (req, res) => {
  console.log('in tracksRouter get /ByYear');
  return res.status(200).json(res.locals.topTracksByYear);
});

router.get('/topTracksByYearByMonth', tracksController.getTopTracksByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topTracksByYearByMonth);
});

// ES6 syntax
export default router;

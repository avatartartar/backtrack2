/**
 * @file artistsRouter.js
 * @description This file is responsible for defining the routes for artist-related requests. It uses the artistsController to handle the incoming requests and send back the appropriate responses.
 * @requires express: The Express framework is used to create the router for handling HTTP requests.
 * @imports '../controllers/artistsController.js': This file contains the controller functions that the routes use to interact with the artist data.
 *
 * @methods
 * - get /: This route handles the GET request to fetch the top artists and sends the response to the client.
 * - get /ByYear: This route handles the GET request to fetch the top artists by a specific year and sends the response to the client.
 * - get /topArtistsByYearByMonth: This route handles the GET request to fetch the top artists by a specific year and month and sends the response to the client.
 *
 * @consumers server.js: Sends requests to the /artists endpoint here.
 */

import express from 'express';
const router = express.Router();
import artistsController from '../controllers/artistsController.js';

router.get('/', artistsController.getTopArtists, (req, res) => {
  return res.status(200).json(res.locals.topArtists);
});

router.get('/ByYear', artistsController.getTopArtistsByYear, (req, res) => {
  // console.log('in artistsRouter get /ByYear');
  return res.status(200).json(res.locals.topArtistsByYear);
});

router.get('/topArtistsByYearByMonth', artistsController.getTopArtistsByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topArtistsByYearByMonth);
});



// ES6 syntax
export default router;

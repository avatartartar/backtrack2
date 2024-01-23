/**
 * @file albumsRouter.js
 * @description This file is responsible for handling the routing logic related to albums. It interacts with the controllers to fetch data and sends the response to the client.
 * @imports '../controllers/albumsController.js': It requires the controllers to interact with the logic and fetch data related to albums.
 *
 * @methods
 * - getTopAlbums: This method fetches the top albums from the database and sends the response to the client.
 * - getTopAlbumsByYear: This method fetches the top albums for a specific year from the database and sends the response to the client.
 * - getTopAlbumsByYearByMonth: This method fetches the top albums for a specific year and month from the database and sends the response to the client.
 *
 *  * @consumers server.js: Sends requests to the /albums endpoint here.

 */

import express from 'express';
const router = express.Router();
import albumsController from '../controllers/albumsController.js';

router.get('/', albumsController.getTopAlbums, (req, res) => {
  return res.status(200).json(res.locals.topAlbums);
});


router.get('/ByYear', albumsController.getTopAlbumsByYear, albumsController.getAlbumsCoverArt, (req, res) => {
  return res.status(200).json(res.locals.topAlbumsByYear);
});


router.get('/topAlbumsByYearByMonth', albumsController.getTopAlbumsByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topAlbumsByYearByMonth);
});

// ES6 syntax
export default router;

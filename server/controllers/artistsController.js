/**
 * @file artistsController.js
 * @description: Handling the logic related to artists. It interacts with the artists models to fetch data and sends the response to the client via the router.
 * @imports '../models/model.js': It requires the models to interact with the database and fetch data related to artists.
 * @object artistsController - Contains all the functions for handling artist-related requests.
 * @methods
 * - getTopArtists: This method fetches the top artists from the database and sends the response to the client.
 * - getTopArtistsByYear: This method fetches the top artists for a specific year from the database and sends the response to the client.
 * - getTopArtistsByYearByMonth: This method fetches the top artists for a specific year and month from the database and sends the response to the client.
 * @consumers server/routes/artistsRouter.js : Sends requests to the /artists endpoint here
 */

import { models } from '../models/model.js';

const artistsController = {};

artistsController.getTopArtists = async (req, res, next) => {
  try {
    const topArtists = await models.getTopArtists();
    res.locals.topArtists = topArtists;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTopArtistsByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const topArtistsByYear = await models.getTopArtistsByYear(year);
    res.locals.topArtistsByYear = topArtistsByYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTopArtistsByYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const topArtistsByYearByMonth = await models.getTopArtistsByYearByMonth(year);
    res.locals.topArtistsByYearByMonth = topArtistsByYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default artistsController;

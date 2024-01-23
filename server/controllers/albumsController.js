/**
 * @file albumsController.js
 * @description: Handling the logic related to albums. It interacts with the albums models to fetch data and sends the response to the client via the router.
 * @imports '../models/model.js': It requires the models to interact with the database and fetch data related to albums.
 * @object albumsController - Contains all the functions for handling albums-related requests.
 * @methods
 * - getTopAlbums: This method fetches the top albums from the database and sends the response to the client.
 * - getTopAlbumsByYear: This method fetches the top albums for a specific year from the database and sends the response to the client.
 * - getAlbumsCoverArt: This method fetches the cover art for each album and adds it as a property on each album object.
 * - getTopAlbumsByYearByMonth: This method fetches the top albums for a specific year and month from the database and sends the response to the client.
 * @consumers server/routes/albumsRouter.js: Sends requests to the /albums endpoint here.
 */

import { models } from '../models/model.js';

const albumsController = {};

albumsController.getTopAlbums = async (req, res, next) => {

  try {
    const topAlbums = await models.getTopAlbums();
    res.locals.topAlbums = topAlbums;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

albumsController.getTopAlbumsByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    //we don't have a 'top_albums_by_year' only view, so calling 'top_albums_by_year_month'. when we add a query for 'top_albums_by_year', change
    //this query to use that
    const topAlbumsByYear = await models.getTopAlbumsByYearByMonth(year);
    //we don't need 12 copies of the album data per year, so reduce
    let reducedTopAlbumsByYear = topAlbumsByYear.reduce((acc, { year, rank, album_name, yearly_playtime_minutes, yearly_playtime_ms, yearly_playtime_hours, album_id }) => {
      const json = JSON.stringify({ year, rank, album_name, yearly_playtime_minutes, yearly_playtime_ms, yearly_playtime_hours, album_id});
      if (!acc.includes(json)) return [...acc, json];
      return acc;
    }, []);
    reducedTopAlbumsByYear = reducedTopAlbumsByYear.map(album => JSON.parse(album));
    res.locals.topAlbumsByYear = reducedTopAlbumsByYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//add image_url as a property on each album object
albumsController.getAlbumsCoverArt = async (req, res, next) => {
  const { topAlbumsByYear } = res.locals;
  const albumNameArray = topAlbumsByYear.map(({ album_name }) => album_name);
  try {
    let albumNameAndImages = await models.getAlbumImageUrl(albumNameArray);
    albumNameAndImages = albumNameAndImages.reduce((acc, curr) => {
      if (!acc.includes(curr)) return [...acc, curr];
      return acc;
    }, []);
    res.locals.topAlbumsByYear = topAlbumsByYear.map(albumObj => {
      const albumImageUrl = albumNameAndImages.filter(albumNameAndImageObj => albumNameAndImageObj.album_name === albumObj.album_name);
      return {...albumObj, image_url: albumImageUrl[0].image_url};
    });
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

albumsController.getTopAlbumsByYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const topAlbumsByYearByMonth = await models.getTopAlbumsByYearByMonth(year);
    res.locals.topAlbumsByYearByMonth = topAlbumsByYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default albumsController;

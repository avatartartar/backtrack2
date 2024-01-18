import { queries } from '../models/model.js';

const albumsController = {};

albumsController.getTopAlbums = async (req, res, next) => {

  try {
    const topAlbums = await queries.getTopAlbums();
    res.locals.topAlbums = topAlbums;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

albumsController.getTopAlbumsByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const topAlbumsByYear = await queries.getTopAlbumsByYear(year);
    res.locals.topAlbumsByYear = topAlbumsByYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

albumsController.getTopAlbumsByYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const topAlbumsByYearByMonth = await queries.getTopAlbumsByYearByMonth(year);
    res.locals.topAlbumsByYearByMonth = topAlbumsByYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default albumsController;

import { queries } from '../models/model.js';

const albumsController = {};

albumsController.getTop10Albums = async (req, res, next) => {
  
  try {
    const top10Albums = await queries.getTop10Albums();
    res.locals.top10Albums = top10Albums;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

albumsController.getTop10AlbumsForYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10AlbumsForYear = await queries.getTop10AlbumsForYear(year);
    res.locals.top10AlbumsForYear = top10AlbumsForYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

albumsController.getTop10AlbumsForYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10AlbumsForYearByMonth = await queries.getTop10AlbumsForYearByMonth(year);
    res.locals.top10AlbumsForYearByMonth = top10AlbumsForYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default albumsController;
import { queries } from '../models/model.js';

const artistsController = {};

artistsController.getTop10Artists = async (req, res, next) => {
  try {
    const top10Artists = await queries.getTop10Artists();
    res.locals.top10Artists = top10Artists;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTop10ArtistsForYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10ArtistsForYear = await queries.getTop10ArtistsForYear(year);
    res.locals.top10ArtistsForYear = top10ArtistsForYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTop10ArtistsForYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10ArtistsForYearByMonth = await queries.getTop10ArtistsForYearByMonth(year);
    res.locals.top10ArtistsForYearByMonth = top10ArtistsForYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default artistsController;
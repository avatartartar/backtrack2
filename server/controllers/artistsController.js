import { queries } from '../models/model.js';

const artistsController = {};

artistsController.getTopArtists = async (req, res, next) => {
  try {
    const top10Artists = await queries.getTopArtists();
    res.locals.top10Artists = top10Artists;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTopArtistsByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10ArtistsByYear = await queries.getTopArtistsByYear(year);
    res.locals.top10ArtistsByYear = top10ArtistsByYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

artistsController.getTopArtistsByYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10ArtistsByYearByMonth = await queries.getTopArtistsByYearByMonth(year);
    res.locals.top10ArtistsByYearByMonth = top10ArtistsByYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default artistsController;

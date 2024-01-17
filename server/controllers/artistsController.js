import { queries } from '../models/model.js';

const artistsController = {};

artistsController.getTopArtists = async (req, res, next) => {
  try {
    const topArtists = await queries.getTopArtists();
    res.locals.topArtists = topArtists;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default artistsController;

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

export default albumsController;

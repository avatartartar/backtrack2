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

export default albumsController;
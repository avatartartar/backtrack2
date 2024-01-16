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


export default artistsController;
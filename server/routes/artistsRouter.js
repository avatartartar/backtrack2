import express from 'express';
const router = express.Router();
import artistsController from '../controllers/artistsController.js';

router.get('/topArtists', artistsController.getTopArtists, (req, res) => {
  return res.status(200).json(res.locals.topArtists);
});

// ES6 syntax
export default router;

import express from 'express';
const router = express.Router();
import albumsController from '../controllers/albumsController.js';

router.get('/topAlbums', albumsController.getTopAlbums, (req, res) => {
  return res.status(200).json(res.locals.topAlbums);
});

// ES6 syntax
export default router;

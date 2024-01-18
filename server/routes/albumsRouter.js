import express from 'express';
const router = express.Router();
import albumsController from '../controllers/albumsController.js';

router.get('/topAlbums', albumsController.getTopAlbums, (req, res) => {
  return res.status(200).json(res.locals.topAlbums);
});


router.get('/topAlbumsByYear', albumsController.getTopAlbumsByYear, (req, res) => {
  return res.status(200).json(res.locals.topAlbumsByYear);
});

router.get('/topAlbumsByYearByMonth', albumsController.getTopAlbumsByYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.topAlbumsByYearByMonth);
});


router.get('/top10AlbumsForYear', albumsController.getTop10AlbumsForYear, (req, res) => {
  return res.status(200).json(res.locals.top10AlbumsForYear);
});

router.get('/top10AlbumsForYearByMonth', albumsController.getTop10AlbumsForYearByMonth, (req, res) => {
  return res.status(200).json(res.locals.top10AlbumsForYearByMonth);
});

// ES6 syntax
export default router;

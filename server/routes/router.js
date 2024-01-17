import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';
import tracksRouter from './tracksRouter.js';
import artistsRouter from './artistsRouter.js';
import albumsRouter from './albumsRouter.js';

// router.get('/db/topAlbums', controller.getTopAlbums);
// router.get('/db/topArtists', controller.getTopArtists);
// router.get('/db/topTracks', controller.getTopTracks);

// //Ross added this to set up a route for front end slider to get tracks by year. This is still timing out at the database call in models
// router.get('/db/topTracksByYear', controller.getTopTracksByYear, controller.groupByTrack, (req, res) => res.status(200).json(res.locals.groupedByTrack));

router.use('/tracks', tracksRouter);
router.use('/artists', artistsRouter);
router.use('/albums', albumsRouter);
// get field names
router.get('/db/getFields', controller.getFields)

// Sample route for get  records
router.get('/db/get', controller.getSessions);

// ES6 syntax
export default router;

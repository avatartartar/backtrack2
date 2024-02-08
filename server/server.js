/**
 * @file server.js
 * @description This file is responsible for setting up the server, loading environment variables, enabling CORS, and mounting routers for handling routes related to tracks, artists, and albums.
 * @requires 'express': Express.js framework for setting up the server.
 * @requires 'dotenv': To load environment variables from .env.server file.
 * @requires 'cors': Middleware to enable CORS.
 *
 * @imports './routes/tracksRouter.js': Router to handle routes related to tracks.
 * @imports './routes/artistsRouter.js': Router to handle routes related to artists.
 * @imports './routes/albumsRouter.js': Router to handle routes related to albums.
 *
 * @methods
 * - express.json(): Middleware to parse incoming JSON request bodies.
 * - express.urlencoded({ extended: true }): Middleware to parse incoming URL-encoded request bodies.
 * - cors(corsOptions): Middleware to enable CORS for all origins.
 * - app.use('/tracks', tracksRouter): Mounts the tracks router.
 * - app.use('/artists', artistsRouter): Mounts the artists router.
 * - app.use('/albums', albumsRouter): Mounts the albums router.
 * - app.listen(PORT, callback): Starts the server on the specified PORT.
 */

// Importing express for the server and path for working with file pahts in Node.js.
import express from 'express';
// import path from 'path';
import dotenv from 'dotenv';
// Importing cors middleware.
import cors from 'cors';
// Import router and routes.
import { getSpotifyToken } from './spotifyTokenRefresh.js';

// Load environment variables from .env.server.
dotenv.config({ path: '.env.server' });

// Set local variable PORT to env varianle with server port.
const PORT = process.env.PORT;

// Assign express to variable app.
const app = express();

// Using epxress.json and epxress .urlencoded middleware to parse incoming JSON and URL-encoded requesr bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors is enabled for all origins allowing any origin to access the server's resources.
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/spotifyToken', async (req, res) => {
    try {
      const token = await getSpotifyToken();
      res.json(token);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving Spotify token');
    }
  });

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});

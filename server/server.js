// Importing express for the server and path for working with file pahts in Node.js.
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
// Importing cors middleware.
import cors from 'cors';
// Import router and routes.
import router from './routes/router.js';
import tracksRouter from './routes/tracksRouter.js';
import artistsRouter from './routes/artistsRouter.js';
import albumsRouter from './routes/albumsRouter.js';


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

// Mounting the router middleware to handle routes starting from the root.
app.use('/tracks', tracksRouter);
app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});

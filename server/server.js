// Importing express for the server and path for working with file pahts in Node.js.
const express = require('express');
const path = require('path');
// Importing cors middleware.
const cors = require('cors');
// Import router and routes.
const router = require('./routes/router');
const dotenv = require('dotenv');

// Load environment variables from .env.server.
dotenv.config({ path: '.env.server' });

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
app.use('/', router);

// Assign local variable PORT to server side environment variables.
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});
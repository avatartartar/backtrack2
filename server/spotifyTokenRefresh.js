/**
 * @file spotifyTokenRefresh.js
 * @description This file is responsible for handling Spotify API token refresh.
 * It ensures that a valid token is always available for API requests by refreshing the token when it is expired or not set.
 * 2024-01-23: this is not currently getting used as we've added a lot of the spotify api data directly to the database.
 *
 * @requires 'dotenv': To load environment variables from the .env.server file.
 * @requires 'node-fetch': To make HTTP requests to the Spotify token endpoint.
 *
 * @methods
 * - refreshSpotifyToken: This private method is responsible for refreshing the Spotify token by making a POST request to the Spotify accounts service.
 * - getSpotifyToken: This public method retrieves the current token, refreshing it if necessary, and returns a valid token for use in API requests.
 */

import dotenv from 'dotenv';

// Load environment variables from .env.server.

// note: doesn’t apply to our current setup, but good to know:
// a file only utilize dotenv (which we use to get the .env file) if it is or is being being executed by a node process.
dotenv.config({ path: '.env.server' });

// must set the below variables to the values we get from our spotify app's dashboard
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// we setup the variables for the token and the expiration time, which we will be reassigning
let token = null;
let tokenExpiration = null ;

// Keith/spotifyTokenIntegration: 2024-01-13
// refreshToken: this gets called when the token is expired or null.
// this is not the preferred method of refreshing the token according to Spotify docs.
// there is a refresh token request, but I couldn’t find the 'refresh token' needed
// to make it work. This works ¯\_(ツ)_/¯

const refreshSpotifyToken = async () => {
  console.log('refreshSpotifyToken called');
  // has to be in base64
  const credentials = new Buffer.from(client_id + ':' + client_secret).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
  });

  const data = await response.json();

  // Keith/spotifyTokenIntegration: 2024-01-13
  // returning the object from spotify to 'getSpotifyToken'
  // it has the following properties: access_token, token_type, expires_in
  return data;
};

const getSpotifyToken = async () =>{
  const now = Date.now();
  // if the token is not null and the expiration time is greater than now
  if (!token && tokenExpiration < now) {
    // The token is not valid, refresh it.
    const newToken = await refreshSpotifyToken();

    // setting the token var to the new token
    token = newToken.access_token;

    // Set the expiration time a little bit earlier than the actual expiration time,
    // to account for possible delays or clock differences.

    tokenExpiration = now + newToken.expires_in * 1000 - 30000;

    // tokenExpiration in minutes for easy viewing
    const tokenExpirationMinutes = Math.floor((tokenExpiration - now) / 60000);
    console.log('spotifyTokenRefresh.js: tokenExpirationMinutes', tokenExpirationMinutes);

  }
  // The token is still valid
  // Return it from the cache
  return token;
}

export { getSpotifyToken };

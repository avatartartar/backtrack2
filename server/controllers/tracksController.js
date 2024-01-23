/**
 * @file tracksController.js
 * @description: Handling the logic related to tracks. It interacts with the tracks models to fetch data and sends the response to the client via the router.
 * @imports '../models/model.js': It requires the models to interact with the database and fetch data related to tracks.
 * @object tracksController - Contains all the functions for handling tracks-related requests.
 * @methods
 * - getTopTracks: Returns the top 10 tracks ordered by playtime.
 * - getTopTracksByYear: Returns the top tracks of a specific year.
 * - getTopTracksByYearByMonth - Returns the top tracks of a specific year by month.
 * @consumers server/routes/tracksRouter.js: Sends requests to the /tracks endpoint here.
 */

import { models } from '../models/model.js';

const tracksController = {};

// const handleRequest = async (modelFunction, req, res) => {
//   try {
//     const data = await modelFunction();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

tracksController.getTopTracks = async (req, res, next) => {
  try {
    const data = await models.getTopTracks();
    res.locals.topTracks = data;
    // console.log('topTracks in tracksController', topTracks);
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

tracksController.getTopTracksByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const data = await models.getTopTracksByYear(year);
    res.locals.topTracksByYear = data;
    // console.log('topTracksByYear.length in tracksController', data.length);
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

tracksController.getTopTracksByYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const data = await models.getTopTracksByYearByMonth(year);
    res.locals.topTracksByYearByMonth = data;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//input: track data for specific year
//output: data grouped by track with total time played for each track in that year
// tracksController.getTracksByTimePlayed = (req, res, next) => {
//   const { topTracksByYear } = res.locals;
//   const tracker = {};
//   //properties here should match the field names returned from model query
//   const tracksByTotalTimePlayed = topTracksByYear.reduce((acc, { track_name, album_name, artist_name, ms_played, sesh_year }) => {
//     const key = JSON.stringify(artist_name + album_name + track_name);
//     const indexInAcc = tracker[key];
//     //check if acc has the artist album and track combo
//     //if no, add the artist album and track combo and set ms_played and return acc
//     if (!tracker[key] && tracker[key] !== 0) {
//       const index = acc.push({track_name, album_name, artist_name, ms_played}) - 1;
//       tracker[key] = index;
//       return acc;
//     }
//     //if yes, then add ms_played to existing ms_played and return acc
//     acc[indexInAcc].ms_played += ms_played;
//     return acc;
//   }, []);
//   res.locals.tracksByTotalTimePlayed = tracksByTotalTimePlayed;
//   return next();
// }

export default tracksController;

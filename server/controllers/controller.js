import { queries } from '../models/model.js';

// Controller object created to encapsulate functions related to handling requests to the DB or potentially api
const controller = {};

// Helper function that takes in a helper function
const handleRequest = async (modelFunction, req, res) => {
  try {
    const data = await modelFunction();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// //Ross added this to set up a route for front end slider to get tracks by year. right now the query times out each time. not using handleRequest
// //yet, as we are not responding to request yet, we are taking data to pass it on to them filter in another controller. didn't want to refactor the
// //whole codebase, so I created a custom controller just to get this working first.
// controller.getTopTracksByYear = async (req, res, next) => {
//   try {
//     const data = await queries.getTopTracksByYear();
//     console.log('data in getTopTracksByYear:', data)
//     res.locals.tracks = data;
//     return next();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// controller.groupByTrack = (req, res, next) => {
//   const { tracks } = res.locals;
//   const tracker = {};
//   const groupedData = tracks.reduce((acc, { track_name, album_name, artist_name, ms_played, sesh_year }) => {
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
//   res.locals.groupedByTrack = groupedData;
//   return next();
// }

//
controller.getFields = (req, res) => handleRequest(queries.getFields, req, res);
controller.getSessions = (req, res) => handleRequest(queries.getSessions, req, res);


export default controller;

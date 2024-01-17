import { queries } from '../models/model.js';

const tracksController = {};

tracksController.getTopTracks = async (req, res, next) => {
  try {
    const data = await queries.getTopTracks();
    res.locals.topTracks = data;
    // console.log('topTracks in tracksController', topTracks);
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Ross added this to set up a route for front end slider to get tracks by year. right now the query times out each time. not using handleRequest
//yet, as we are not responding to request yet, we are taking data to pass it on to them filter in another controller. didn't want to refactor the
//whole codebase, so I created a custom controller just to get this working first.
tracksController.getTopTracksByYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const data = await queries.getTopTracksByYear(year);
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
    const data = await queries.getTopTracksByYearByMonth(year);
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

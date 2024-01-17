import { queries } from '../models/model.js';

const tracksController = {};

tracksController.getTop10Tracks = async (req, res, next) => {
  try {
    const top10Tracks = await queries.getTop10Tracks();
    res.locals.top10Tracks = top10Tracks;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

tracksController.getTop10TracksForYear = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10TracksForYear = await queries.getTop10TracksForYear(year);
    res.locals.top10TracksForYear = top10TracksForYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

tracksController.getTop10TracksForYearByMonth = async (req, res, next) => {
  const { year } = req.query;
  try {
    const top10TracksForYearByMonth = await queries.getTop10TracksForYearByMonth(year);
    res.locals.top10TracksForYearByMonth = top10TracksForYearByMonth;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Old middlware for when querying tracks by year. Now making query to view with by year and month data.

// tracksController.getTop10TracksForYear = async (req, res, next) => {
//   const { year } = req.query;
//   console.log('year:', year)
//   try {
//     const tracksForYear = await queries.getTop10TracksForYear(year);
//     res.locals.tracksForYear = tracksForYear;
//     return next();

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// input: track data for specific year
// output: data grouped by track with total time played for each track in that year
// tracksController.getTracksByTimePlayed = (req, res, next) => {
//   const { tracksForYear } = res.locals;
//   const tracker = {};
//   //properties here should match the field names returned from model query
//   const tracksByTotalTimePlayed = tracksForYear.reduce((acc, { track_name, album_name, artist_name, ms_played, sesh_year }) => {
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
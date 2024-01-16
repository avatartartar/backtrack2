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

//Ross added this to set up a route for front end slider to get tracks by year. right now the query times out each time. not using handleRequest
//yet, as we are not responding to request yet, we are taking data to pass it on to them filter in another controller. didn't want to refactor the
//whole codebase, so I created a custom controller just to get this working first.
tracksController.getTop10TracksForYear = async (req, res, next) => {
  const { year } = req.query;
  console.log('year:', year)
  try {
    const tracksForYear = await queries.getTop10TracksForYear(year);
    res.locals.tracksForYear = tracksForYear;
    return next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//input: track data for specific year
//output: data grouped by track with total time played for each track in that year
tracksController.getTracksByTimePlayed = (req, res, next) => {
  const { tracksForYear } = res.locals;
  const tracker = {};
  //properties here should match the field names returned from model query
  const tracksByTotalTimePlayed = tracksForYear.reduce((acc, { track_name, album_name, artist_name, ms_played, sesh_year }) => {
    const key = JSON.stringify(artist_name + album_name + track_name);
    const indexInAcc = tracker[key];
    //check if acc has the artist album and track combo
    //if no, add the artist album and track combo and set ms_played and return acc
    if (!tracker[key] && tracker[key] !== 0) {
      const index = acc.push({track_name, album_name, artist_name, ms_played}) - 1;
      tracker[key] = index;
      return acc;
    }
    //if yes, then add ms_played to existing ms_played and return acc
    acc[indexInAcc].ms_played += ms_played;
    return acc;
  }, []);
  res.locals.tracksByTotalTimePlayed = tracksByTotalTimePlayed;
  return next();
}

export default tracksController;
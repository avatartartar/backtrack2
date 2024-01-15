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

controller.getTop10Artists = (req, res) => handleRequest(queries.getTop10Artists, req, res);
controller.getTop10Albums = (req, res) => handleRequest(queries.getTop10Albums, req, res);
controller.getTop10Tracks = (req, res) => handleRequest(queries.getTop10Tracks, req, res);


//Ross added this to set up a route for front end slider to get tracks by year. right now the query times out each time. not using handleRequest
//yet, as we are not responding to request yet, we are taking data to pass it on to them filter in another controller. didn't want to refactor the
//whole codebase, so I created a custom controller just to get this working first.
controller.getTop10TracksByYear = async (req, res, next) => {
  try {
    const data = await queries.getTop10TracksByYear();
    console.log('data in getTop10TracksByYear:', data)
    res.locals.tracks = data;
    return next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Ross added this to set up a route for front end slider to get tracks by year. This controller will filter the results by year. Still need
//to get a valid response to the front end, then we can build this controller out.
controller.filterByYear = (req, res) => {
  const { year } = req.query; //query string from front end request
  const { tracks } = res.locals;
  return res.status(200).json(tracks);
}

//
controller.getFields = (req, res) => handleRequest(queries.getFields, req, res);
controller.get10Sessions = (req, res) => handleRequest(queries.get10Sessions, req, res);


export default controller;

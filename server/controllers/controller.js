import model, { basicQueries } from '../models/model.js';

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



controller.getTop10Artists = (req, res) => handleRequest(basicQueries.getTop10Artists, req, res);
controller.getTop10Albums = (req, res) => handleRequest(basicQueries.getTop10Albums, req, res);
controller.getTop10Tracks = (req, res) => handleRequest(basicQueries.getTop10Tracks, req, res);



controller.getFields = (req, res) => handleRequest(basicQueries.getFields, req, res);

controller.get10Sessions = (req, res) => handleRequest(basicQueries.get10Sessions, req, res);


export default controller;

import model from '../models/model.js';

const controller = {};

const handleRequest = async (modelFunction, req, res) => {
  try {
    const data = await modelFunction();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.getTop10Artists = (req, res) => handleRequest(model.getTop10Artists, req, res);
controller.getTop10Albums = (req, res) => handleRequest(model.getTop10Albums, req, res);
controller.getTop10Tracks = (req, res) => handleRequest(model.getTop10Tracks, req, res);



controller.getFields = (req, res) => handleRequest(model.getFields, req, res);

controller.get10Sessions = (req, res) => handleRequest(model.get10Sessions, req, res);


export default controller;

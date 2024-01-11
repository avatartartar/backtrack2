import model from '../models/model.js';

const controller = {};

controller.get10Sessions = async (req, res) => {
  try {
      const data = await model.get10Sessions();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

controller.getColumns = async (req, res) => {
  try {
      const data = await model.getColumns();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

export default controller;

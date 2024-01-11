const express = require('express');
const router = express.Router();
const { controller } = require('../controllers/controller.js');

// Sample route for get 10 records
router.get('/api/get10', async (req, res) => {
    try {
        const response = await controller.get10(req, res, next);
        return res.status(200).json(response);
    } catch (error) {
        next(error)
    }
  } 
)

// Global error handler
app.use((err, req, res) => {
  console.error(err);
  return res.status(500).json({ error: err.toString()});
});

// Export router.
module.exports = router;
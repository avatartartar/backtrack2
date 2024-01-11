// commonJs syntax
// const express = require('express');
// const { controller } = require('../controllers/controller.js');

// es6 syntax
import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';

router.get('/db/top10Albums', controller.getTop10Albums);
router.get('/db/top10Artists', controller.getTop10Artists);
router.get('/db/top10Tracks', controller.getTop10Tracks);

// get field names
router.get('/db/getFields', controller.getFields)

// Sample route for get 10 records
router.get('/db/get10', controller.get10Sessions);

// CommonJs syntax
// module.exports = router;

// ES6 syntax
export default router;

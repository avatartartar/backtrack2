// commonJs syntax
// const express = require('express');
// const { controller } = require('../controllers/controller.js');

// es6 syntax
import express from 'express';
const router = express.Router();
import controller from '../controllers/controller.js';

// Sample route for get 10 records
router.get('/db/get10', controller.get10Sessions);
router.get('/db/getColumns', controller.getColumns)

// CommonJs syntax
// module.exports = router;

// ES6 syntax
export default router;

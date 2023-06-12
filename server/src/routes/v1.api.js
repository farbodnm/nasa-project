const express = require('express');

const planetsRouter = require('./planets/planets.router');
const { launchesRouter } = require('./launches/launches.router');

const api = express.Router();

api.use('/api/planets', planetsRouter);
api.use('/api/launches', launchesRouter);

module.exports = api;

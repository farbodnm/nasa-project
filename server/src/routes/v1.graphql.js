const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { gqlSchema } = require('../models/launch.model');

const gql = express.Router();

gql.use(
  '/gql',
  graphqlHTTP({
    schema: gqlSchema,
    graphiql: true,
  })
);

module.exports = gql;

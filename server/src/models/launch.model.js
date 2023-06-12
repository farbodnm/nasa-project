const axios = require('axios');
const { SchemaComposer } = require('graphql-compose');

const { launches } = require('./launch.mongo');
const planets = require('./planets.mongo');
const { launchQuery, launchMutation } = require('./launch.graphql');

// const launches = new Map();

const DEFAULT_FLIGHTNUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsWithLaunchId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .limit(limit)
    .skip(skip);
}

async function getLatestFlightNumber() {
  pipeline = [
    {
      $sort: {
        flightNumber: -1,
      },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        flightNumber: 1,
      },
    },
  ];

  const latestLaunch = await launches.aggregate(pipeline);

  if (latestLaunch.length === 0) {
    return DEFAULT_FLIGHTNUMBER;
  }

  return latestLaunch[0].flightNumber;
}

async function saveLaunch(launch) {
  try {
    await launches.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (err) {
    console.error(`Saving launch failed with error: ${err}`);
  }
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet was found.');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: 'true',
    customers: ['Zero to Master', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: customers,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data was already loaded!');
  } else {
    await populateLaunches();
  }
}

// GraphQL
const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...launchQuery,
});

schemaComposer.Mutation.addFields({
  ...launchMutation,
});

const gqlSchema = schemaComposer.buildSchema();

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsWithLaunchId,
  abortLaunchById,
  loadLaunchesData,
  gqlSchema,
};

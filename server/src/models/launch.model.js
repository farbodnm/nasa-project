const launches = require('./launch.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

const DEFAULT_FLIGHTNUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler exploration',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};
saveLaunch(launch);

// launches.set(launch.flightNumber, launch);

async function existsWithLaunchId(launchId) {
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHTNUMBER;
  }

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet was found.');
  }

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
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: 'true',
    customers: ['Zero to Master', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       upcoming: true,
//       success: true,
//       customer: ['Zero to Mastery', 'NASA'],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

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

  console.log();
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsWithLaunchId,
  abortLaunchById,
};

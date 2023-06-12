const { launchesTC } = require('./launch.mongo');

const launchQuery = {
  launchByIds: launchesTC.getResolver('findByIds'),
  launchById: launchesTC.getResolver('findById'),
  launchOne: launchesTC.getResolver('findOne'),
  launchMany: launchesTC.getResolver('findMany'),
  launchCount: launchesTC.getResolver('count'),
  launchConnection: launchesTC.getResolver('connection'),
  launchPagination: launchesTC.getResolver('pagination'),
};

const launchMutation = {
  launchCreateOne: launchesTC.getResolver('createOne'),
  launchCreateMany: launchesTC.getResolver('createMany'),
  launchUpdateById: launchesTC.getResolver('updateById'),
  launchUpdateOne: launchesTC.getResolver('updateOne'),
  launchUpdateMany: launchesTC.getResolver('updateMany'),
  launchRemoveById: launchesTC.getResolver('removeById'),
  launchRemoveOne: launchesTC.getResolver('removeOne'),
  launchRemoveMany: launchesTC.getResolver('removeMany'),
};

module.exports = { launchQuery, launchMutation };

const DEFAULTPAGENUMBER = 1;
const DEFAULTPAGELIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULTPAGENUMBER;
  const limit = Math.abs(query.limit) || DEFAULTPAGELIMIT;
  skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = getPagination;

const { ARCHIPELS_API_URL, ACCESS_TOKEN } = require('./constants');

if (ACCESS_TOKEN === undefined) {
  throw new Error('ACCESS_TOKEN is not defined');
}

const axios = require('axios').create({
  baseURL: ARCHIPELS_API_URL,
  headers: {
    authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

module.exports = { axios };

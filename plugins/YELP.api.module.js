RP = require('request-promise');

const { YELP_API_KEY, CONCURRENT_REQUESTS } = process.env;

/**
 * Fetch a location from the YELP API V3
 * @param {object} param0 A location object
 * @param {string} param0.location A common name for the location
 * @param {number} param0.latitude The latitude to search near
 * @param {number} param0.longitude The longitude to search near
 * @param {number} param0.radius The radius to search in( default: 800 )
 * @param {number} param0.page The number of pages to offset( default: 0 )
 * @param {boolean} param0.fetchAll Exaust all possible locations( default: false ) WARNING: may return LARGE data sets, could see increase in response times or failure rates
 * @returns {Promise<{location: string, results: [object]}>} A promise containing the location name as well as the location results
 */
function getLocation({ location, latitude, longitude, radius = 800, page = 0, fetchAll = false }) {
  // get first page of results and total

  // request options example to be passed to request-promise
  // extract generation of options into method to map over body and reference location
  const limit = 20;
  const headers = {
    'cache-control': 'no-cache',
    'authorization': `Bearer ${YELP_API_KEY}`,
    'content-type': 'application/json'
  };

  const qs = {
    latitude,
    longitude,
    radius,
    offset: page * limit,
    limit
  };

  const url = 'https://api.yelp.com/v3/businesses/search';

  const options = {
    method: 'GET',
    url,
    qs,
    headers,
    json: true
  };

  return RP(options)
    .then(async (results) => {
      if (!fetchAll)
        return results.businesses;
      let P;
      // PROBLEM: opens all connections simultaniously and exceeds queries per second limit
      // FIX: open queries sequentially, requires changing method to async
      /* Concurrent version that breaks API limits pretty quickly */
      if (CONCURRENT_REQUESTS) {
        P = Promise.all([
          results,
          ...(Array.from({ length: Math.round(results.total / limit) - 1 },
            (_, pageOffset) => {
              return RP({
                method: 'GET',
                url,
                qs: Object.assign({}, qs, { offset: (pageOffset + 1) * limit }),
                headers,
                json: true
              }).then(result => result)
            })
          )
        ])
      } else {
        /* Sequential version that does not break API limits */
        const businesses = [results];
        for (let pageOffset = 0, l = (Math.round(results.total / limit) - 1); pageOffset < l; pageOffset++) {
          let temp = await RP({
            method: 'GET',
            url,
            qs: Object.assign({}, qs, { offset: (pageOffset + 1) * limit }),
            headers,
            json: true
          }).then(result => result)
          businesses.push(temp);
        }
        P = Promise.all(businesses)
      }
      /**/

      return P
        .then(resultArrs => {
          let businesses = [];
          // nested loops over results for faster processing of possibly large results sets and dereferencing
          // no complexity save, but a distinct time save
          for (let index1 in resultArrs) {
            for (let index2 in resultArrs[index1].businesses) {
              businesses.push(resultArrs[index1].businesses[index2]);
            }
          }
          return businesses;
        })
    })
    .then(businesses => ({ location, businesses }))
}

module.exports = {
  getLocation
}
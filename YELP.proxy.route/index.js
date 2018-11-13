const { isNOTLocationObject } = require('../library');
const HttpStatus = require('http-status-codes');

const { CONCURRENT_REQUESTS, NODE_ENV } = process.env;

module.exports = {
  YELP_REVERSE_PROXY_ENDPOINT: '/',
  YELP_REVERSE_PROXY_HANDLERS: [
    bodyInspector,
    handler,
    errorHandler
  ]
}

/**
 * Middleware to check if the body has all correct arguments, otherwise send a 400 status
 * @param {obj} body The request body parsed as JSON from the `express.request` instance
 * @param {obj} res An instance of `express.response`
 * @param {function} next An instance of `express.next`
 * @returns {undefined} Either short circuits the response life cycle or calls `next`
 */
function bodyInspector({ body }, res, next) {
  if (
    !Array.isArray(body)
    || body.find(isNOTLocationObject)
  )
    return res.status(400).send({ code: 400, error: 'The body must be an Array of Locations as defined by Spec VXXX' })
  next();
}

/**
 * Takes body contents and send parameters to YELP API using plugin at '../plugins/YELP.api.module' method getLocation
 * @param {object} req The `express` request instance
 * @param {object} res The `express` response instance
 * @param {function} next The `express` next handler
 */
async function handler(req, res, next) {
  {
    // has a proper body
    const { body } = req; // pull out body parameters, is Array, is valid body parameters
    let results;

    try {
      // PROBLEM: opens all connections simultaniously and exceeds queries per second limit if enough locations are given even with fix in API file
      // FIX: open queries sequentially
      /* Faster concurrent version that has a problem with request limits */
      if (CONCURRENT_REQUESTS) {
        results = await Promise.all(
          body.map(({ location, latitude, longitude }) => req.app.locals.plugins.YELP_API.getLocation({ location, latitude, longitude, fetchAll: true }))
        )
      } else {
        /* Sequential version that won't overload the request limits but takes MUCH longer */
        results = [];
        for (let index in body) {
          let { location, latitude, longitude } = body[index];
          let temp = await req.app.locals.plugins.YELP_API.getLocation({ location, latitude, longitude, fetchAll: true });
          results.push(temp);
        }
      }
    } catch (error) {
      if (!error.statusCode)
        error.statusCode = 500;
      return next(error)
    }

    return res.json(results);
  }
}

/**
 * A simple JSON error handler in production mode that will attempt to return a JSON error instead of a plaintext error
 * @param {object} error A nodeJS error
 * @param {number} error.statusCode A number representing an HTTP Status( default: 500 )
 * @param {object} req The `express` request instance, used here for footprint typing for `express` purposes
 * @param {object} res The `express` response instance
 * @param {function} next The `express` next function. Used as a fallback to default error handler for `express` if not in production
 */
function errorHandler (error, req, res, next) {
  if (NODE_ENV != 'production')
    return next(error);
  const code = error.statusCode || 500;
  let jason;
  try {
    jason = { code, error: HttpStatus.getStatusText(error.statusCode) };
  } catch (error) {
    jason = { code, error : `${code}` }
  }
  res.status(error.statusCode).json(jason);
  console.error(error)
}
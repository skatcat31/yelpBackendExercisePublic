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
 * 
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
    return res.status(400).send({ error: 'The body must be an Array of Locations as defined by Spec VXXX' })
  next();
}


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
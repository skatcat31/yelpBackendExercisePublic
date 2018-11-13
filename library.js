module.exports = {
  isLocationObject,
  isNOTLocationObject  
}

/**
 * Checks to see if the object supplied has required keys
 * @param {object} obj Object to sent to `isLocationObject`
 * @param {string} obj.location The location identification string
 * @param {number} obj.latitude The latitude coordinate
 * @param {number} obj.longitude The longiitude coordinate
 * @returns {boolean} A check to see that all keys are present
 */
function isLocationObject ({ location, latitude, longitude }) {
  return location !== undefined && latitude !== undefined && longitude !== undefined; // should check if valid as well
}

/**
 * Checks to see if the supplied object does NOT have required keys
 * @param {object} obj Object to sent to `isLocationObject`
 * @param {string} obj.location The location identification string
 * @param {number} obj.latitude The latitude coordinate
 * @param {number} obj.longitude The longiitude coordinate
 * @returns {boolean} The negated value from `isLocationObject()`
 */
function isNOTLocationObject (obj) {
  return !isLocationObject(obj);
}

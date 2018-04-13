# yelpBackendExercisePublic

Welcome to the backend coding exercise for the SPJ Solutions Software Development team!  Backend work on our Citopus product involves a great deal of communication with third party API.  As a result, we've structured this exercise to examine your ability write asynchronous code and to work with third party API.  

***

## THE EXERCISE:

For this exercise, you're given a simple Node Express server.  We'd like you to build out an endpoint that pulls business information from the Yelp API. 

A link to documentation about the Yelp API 'businesses search' endpoint can be found here:  https://www.yelp.com/developers/documentation/v3/business_search

The endpoint that you create will accept the following request body:

```
[
  {
    location: 'New York',
    latitude: 40.785091,
    longitude: -73.968285,
  }, {
    location: 'Boston',
    latitude: 42.361145,
    longitude: -71.057083,
  }, {
    location: 'Washington DC',
    latitude: 38.889931,
    longitude: -77.009003,
  }, {
    location: 'Chicago',
    latitude: 41.881832,
    longitude: -87.623177,
  }, {
    location: 'San Francisco',
    latitude: 37.773972,
    longitude: -122.431297,
  }
]
```
It must communicate with Yelp API's 'businesses search' endpoint, and return the following information:

```
[
  {
    location: 'New York',
    businesses: [Array of objects, with each object representing a specific business]
  }, {
    location: 'Boston',
    businesses: [Array of objects, with each object representing a specific business]
  }, {
    location: 'Washington DC',
    businesses: [Array of objects, with each object representing a specific business]
  }, {
    location: 'Chicago',
    businesses: [Array of objects, with each object representing a specific business]
  }, {
    location: 'San Francisco',
    businesses: [Array of objects, with each object representing a specific business]
  }
]
```
When communicating with the Yelp API, use the following search parameters:

1.  The latitude and longitude provided in the request body to search by location (the city names in the request body will not be used when communicating with the Yelp API).  
2.  'Radius' should equal 800
3.  Pay special attention to the 'limit' and 'offset' parameters, to ensure that all available information for each location is being retrieved from the endpoint.  

***

Also be aware that to communicate with the Yelp API, you will need a product key.  Here's a link to documentation for how to obtain one:  https://www.yelp.com/developers/documentation/v3/authentication

***

A simple Express server has been provided as part of this repo, along with a .env file and a package.json file.  Use the package.json file to familiarize yourself with npm libraries that will be helpful in completing this exercise.  That said, if you have libraries that you'd prefer to use, feel free to install and use them instead.  

Good luck!

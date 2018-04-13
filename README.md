# yelpBackendExercisePublic

Welcome to the backend coding exercise for the SPJ Solutions software development team!  

WHY:

Backend work on our Citopus product involves a great deal of HTTP requests to endpoints on our server and also requires a great deal of data pulling from third party API.  

THE EXERCISE:

For this exercise, you're given a simple Node Express server.  We'd like you to build out an endpoint that pulls business information from the Yelp API.  

The endpoint will accept the following request body:

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
It must communicate with Yelp API's '/business/search' endpoint, and return the following information:

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


...and must return a response body with the following structure



Get the product key:

https://www.yelp.com/developers/documentation/v3/authentication

We're going make use of Yelps' business search endpoint:

https://www.yelp.com/developers/documentation/v3/business_search



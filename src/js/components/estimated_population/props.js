export const props_radius = {
  population: 120448,
  center: {
    type: "Point",
    coordinates: [-122.68194444, 45.52]
  },
  radius: 3.1,
  units: "mi" // both miles and kilometers should be supported
};

export const props_zips = {
  population: 120448,
  zip_codes: [
    {
      zip: "97201",
      properties: {
        center: [-122.692, 45.49862]
      },
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [-122.713058, 45.476042],
            [-122.720757, 45.520582],
            [-122.700411, 45.523881],
            [-122.680616, 45.515083],
            [-122.672918, 45.513983],
            [-122.667419, 45.504635],
            [-122.669619, 45.476042],
            [-122.713058, 45.476042]
          ]
        ]
      }
    },
    {
      zip: "97232",
      properties: {
        center: [-122.6439272, 45.5289286]
      },
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [-122.619031, 45.522781],
            [-122.66577, 45.522781],
            [-122.666869, 45.534878],
            [-122.62013, 45.534878],
            [-122.619031, 45.522781]
          ]
        ]
      }
    },
    {
      zip: "97215",
      properties: {
        center: [-122.6006274, 45.5151213]
      },
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [-122.57889, 45.522781],
            [-122.57889, 45.504635],
            [-122.617931, 45.505185],
            [-122.619031, 45.505185],
            [-122.617381, 45.523331],
            [-122.57889, 45.522781]
          ]
        ]
      }
    }
  ]
};

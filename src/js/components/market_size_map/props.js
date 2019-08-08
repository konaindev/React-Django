export default {
  circleOnly,
  zipcodesOnly,
  circleWithZipcodes,
  polygonWithHole
};

export const circleOnly = {
  center: {
    type: "Point",
    coordinates: [-122.68194444, 45.52]
  },
  radius: 3.1,
  units: "mi" // both miles and kilometers should be supported
};

export const zipcodesOnly = {
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
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-122.57889, 45.522781],
              [-122.57889, 45.507635],
              [-122.617931, 45.508185],
              [-122.619031, 45.508185],
              [-122.617381, 45.523331],
              [-122.57889, 45.522781]
            ]
          ],
          [
            [
              [-122.586296, 45.507157],
              [-122.586296, 45.507052],
              [-122.586335, 45.506999],
              [-122.586332, 45.506309],
              [-122.588879, 45.506303],
              [-122.588894, 45.506999],
              [-122.588897, 45.507158],
              [-122.586296, 45.507157]
            ]
          ]
        ]
      }
    }
  ]
};

export const circleWithZipcodes = {
  center: {
    type: "Point",
    coordinates: [-122.65, 45.525]
  },
  radius: 3.1,
  units: "mi", // both miles and kilometers should be supported
  ...zipcodesOnly
};

export const polygonWithHole = {
  zip_codes: [
    {
      zip: "Bermuda Triangle",
      properties: {
        center: [-72.4735, 25.3935]
      },
      outline: {
        type: "Polygon",
        coordinates: [
          [[-80.19, 25.774], [-66.118, 18.466], [-64.757, 32.321]],
          [[-70.579, 28.745], [-67.514, 29.57], [-66.668, 27.339]]
        ]
      }
    }
  ]
};

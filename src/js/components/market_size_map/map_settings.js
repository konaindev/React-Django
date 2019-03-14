export const GOOGLE_MAP_API_KEY = "AIzaSyBu4HU8t3rRXnfdkNjSV1_PIhzzrFFlVTs";

export const DEFAULT_ZOOM = 1;

export const mapCirclePointColor = "#53F7DD"; // $map-circle-point-color
export const stylesForNightMode = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#20272E" }] // $map-land-color
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#20272E" }] // $map-land-color
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#798796" }] // $map-location-text-color
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ color: "#181D23" }] // $map-road-color
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#181D23" }] // $map-water-color
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }]
  }
];

export const stylesForRegionFill = {
  strokeColor: "#0069FF", // $map-region-bg-color
  strokeOpacity: 1,
  strokeWeight: 1.54,
  fillColor: "#0069FF", // $map-region-bg-color
  fillOpacity: 0.1
};

export const createDefaultMapOptions = maps => ({
  styles: stylesForNightMode,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false
});

export const GOOGLE_MAP_API_KEY = "AIzaSyBu4HU8t3rRXnfdkNjSV1_PIhzzrFFlVTs";

export const DEFAULT_ZOOM = 1;

export const stylesForNightMode = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#1a202e" }] // $bluegray-dark
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a202e" }] // $bluegray-dark
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#747F95" }] // $heading-font-color
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ color: "#292F3D" }] // road color
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#161c29" }] // $bluegray-dark-alt
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }]
  }
];

export const stylesForRegionFill = {
  strokeColor: "#5147FF",
  strokeOpacity: 1,
  strokeWeight: 1.54,
  fillColor: "#6760e6", // rgba(103,96,230,0.1);
  fillOpacity: 0.35
};

export const createDefaultMapOptions = maps => ({
  styles: stylesForNightMode,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false
});

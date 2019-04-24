import scssVars from "../../../css/variables.scss";

export const GOOGLE_MAP_API_KEY = "AIzaSyBu4HU8t3rRXnfdkNjSV1_PIhzzrFFlVTs";

export const DEFAULT_ZOOM = 9;

export const mapCirclePointColor = scssVars.mapCirclePointColor;

export const stylesForNightMode = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: scssVars.mapLandColor }]
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: scssVars.mapLandColor }]
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: scssVars.mapLocationTextColor }]
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ color: scssVars.mapRoadColor }]
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: scssVars.mapWaterColor }]
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }]
  }
];

export const stylesForRegionFill = {
  strokeColor: scssVars.mapRegionBgColor,
  strokeOpacity: 1,
  strokeWeight: 1.54,
  fillColor: scssVars.mapRegionBgColor,
  fillOpacity: scssVars.mapRegionBgOpacity
};

export const createDefaultMapOptions = maps => ({
  styles: stylesForNightMode,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false
});

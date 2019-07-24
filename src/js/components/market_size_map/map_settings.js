import scssVars from "../../../css/variables.scss";

export const GOOGLE_MAP_API_KEY = "AIzaSyBu4HU8t3rRXnfdkNjSV1_PIhzzrFFlVTs";
export const DEFAULT_ZOOM = 9;

export const mapNightTheme = [
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
    stylers: [{ color: scssVars.mapLabelTextColor }]
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

export const greenAreaTheme = {
  strokeColor: scssVars.mapGreenAreaStrokeColor,
  strokeOpacity: 1,
  strokeWeight: scssVars.mapGreenAreaStrokeWeight,
  fillColor: scssVars.mapGreenAreaFillColor,
  fillOpacity: scssVars.mapGreenAreaFillOpacity,
  labelColor: scssVars.mapGreenAreaLabelColor
};

export const grayAreaTheme = {
  strokeColor: scssVars.mapGrayAreaStrokeColor,
  strokeOpacity: 1,
  strokeWeight: scssVars.mapGrayAreaStrokeWeight,
  fillColor: scssVars.mapGrayAreaFillColor,
  fillOpacity: scssVars.mapGrayAreaFillOpacity,
  labelColor: scssVars.mapGrayAreaLabelColor
};

export const blueAreaTheme = {
  strokeColor: scssVars.mapBlueAreaStrokeColor,
  strokeOpacity: 1,
  strokeWeight: scssVars.mapBlueAreaStrokeWeight,
  fillColor: scssVars.mapBlueAreaFillColor,
  fillOpacity: scssVars.mapBlueAreaFillOpacity,
  labelColor: scssVars.mapBlueAreaLabelColor
};

export const createDefaultMapOptions = maps => ({
  styles: mapNightTheme,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false
});

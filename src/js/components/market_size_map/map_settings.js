import scssVars from "../../../css/variables.scss";

export const GOOGLE_MAP_API_KEY =
  process.env.GOOGLE_MAP_API_KEY || "FAKE_GMAP_KEY";
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

export const createDefaultMapOptions = maps => ({
  styles: mapNightTheme,
  draggable: false,
  zoomControl: true,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false
});

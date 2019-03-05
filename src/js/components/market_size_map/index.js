import React from "react";

import MapWithCircle from "./map_with_circle";
import MapWithPolygon from "./map_with_polygon";

export function MarketSizeMap(props) {
  if (props.zip_codes === undefined) {
    return <MapWithCircle {...props} />;
  } else {
    return <MapWithPolygon {...props} />;
  }
}

export default MarketSizeMap;

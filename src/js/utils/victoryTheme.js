import { assign } from "lodash";

export const convertRemToPixels = rem => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

const colors = [
  "#252525",
  "#525252",
  "#737373",
  "#969696",
  "#bdbdbd",
  "#d9d9d9",
  "#f0f0f0"
];

const lightGrey = "#cccccc";
const grey = "#969696";
const darkGrey = "#3d4852";

// Typography
const sansSerif = "sans-serif";
const letterSpacing = "normal";
const fontSize = convertRemToPixels(0.6);

// Layout
const baseProps = {
  width: 450,
  height: 300,
  padding: convertRemToPixels(4),
  colorScale: colors
};

// Labels
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding: 10,
  fill: lightGrey,
  stroke: "transparent"
};

const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

// Strokes
const strokeLinecap = "round";
const strokeLinejoin = "round";

// A full theme
export const remarkablyChartTheme = {
  area: assign({
    style: {
      data: {
        stroke: "#74EC98",
        fill: "#74EC98",
        strokeWidth: "5px"
      },
      axis: {
        fill: "transparent",
        stroke: "transparent"
      },
      axisLabel: {
        padding: 0,
        fill: "transparent",
        stroke: "transparent",
        color: "transparent",
        fontSize: 0
      }
    },
    baseProps
  }),
  axis: assign(
    {
      style: {
        axis: {
          fill: "transparent",
          stroke: darkGrey,
          strokeWidth: 1,
          strokeLinecap,
          strokeLinejoin
        },
        axisLabel: assign({}, centeredLabelStyles, {
          padding: 25
        }),
        grid: {
          fill: "none",
          stroke: "none",
          pointerEvents: "painted"
        },
        ticks: {
          fill: "transparent",
          size: 1,
          stroke: "transparent"
        },
        tickLabels: baseLabelStyles
      }
    },
    baseProps
  ),
  bar: assign(
    {
      style: {
        data: {
          fill: lightGrey,
          padding: 8,
          strokeWidth: 0
        },
        labels: baseLabelStyles
      }
    },
    baseProps
  ),
  boxplot: assign(
    {
      style: {
        max: { padding: 8, stroke: lightGrey, strokeWidth: 1 },
        maxLabels: baseLabelStyles,
        median: { padding: 8, stroke: lightGrey, strokeWidth: 1 },
        medianLabels: baseLabelStyles,
        min: { padding: 8, stroke: lightGrey, strokeWidth: 1 },
        minLabels: baseLabelStyles,
        q1: { padding: 8, fill: grey },
        q1Labels: baseLabelStyles,
        q3: { padding: 8, fill: grey },
        q3Labels: baseLabelStyles
      },
      boxWidth: 20
    },
    baseProps
  ),
  candlestick: assign(
    {
      style: {
        data: {
          stroke: lightGrey,
          strokeWidth: 1
        },
        labels: centeredLabelStyles
      },
      candleColors: {
        positive: "#ffffff",
        negative: lightGrey
      }
    },
    baseProps
  ),
  chart: baseProps,
  errorbar: assign(
    {
      borderWidth: 8,
      style: {
        data: {
          fill: "transparent",
          stroke: lightGrey,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  group: assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  legend: {
    colorScale: colors,
    gutter: 10,
    orientation: "vertical",
    titleOrientation: "top",
    style: {
      data: {
        type: "circle"
      },
      labels: baseLabelStyles,
      title: assign({}, baseLabelStyles, { padding: 5 })
    }
  },
  line: assign(
    {
      style: {
        data: {
          fill: "transparent",
          stroke: lightGrey,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  pie: {
    style: {
      data: {
        padding: 10,
        stroke: "transparent",
        strokeWidth: 1
      },
      labels: assign({}, baseLabelStyles, { padding: 20 })
    },
    colorScale: colors,
    width: 400,
    height: 400,
    padding: 50
  },
  scatter: assign(
    {
      style: {
        data: {
          fill: lightGrey,
          stroke: "transparent",
          strokeWidth: 0
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  stack: assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  tooltip: {
    style: assign({}, centeredLabelStyles, {
      padding: 5,
      pointerEvents: "none"
    }),
    flyoutStyle: {
      stroke: lightGrey,
      strokeWidth: 1,
      fill: "#f0f0f0",
      pointerEvents: "none"
    },
    cornerRadius: 5,
    pointerLength: 10
  },
  voronoi: assign(
    {
      style: {
        data: {
          fill: "transparent",
          stroke: "transparent",
          strokeWidth: 0
        },
        labels: assign({}, centeredLabelStyles, {
          padding: 5,
          pointerEvents: "none"
        }),
        flyout: {
          stroke: lightGrey,
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none"
        }
      }
    },
    baseProps
  )
};

module.exports = function(api) {
  api.cache(true);

  const plugins = [
    "lodash",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-transform-runtime"
  ];

  const presets = [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "corejs": "2"
      }
    ],
    "@babel/preset-react"
  ];

  return {
    plugins,
    presets
  };
}

export const _get = (value, path, defaultValue) => {
  return String(path)
    .split(".")
    .reduce((acc, v) => {
      try {
        acc = acc[v];
      } catch (e) {
        return defaultValue;
      }
      return acc;
    }, value);
};

export const calcDiffInWeeks = (date1, date2) => {
  const diffInMilliSec = new Date(date2) - new Date(date1);
  return Math.ceil(diffInMilliSec / (1000 * 60 * 60 * 24 * 7));
};

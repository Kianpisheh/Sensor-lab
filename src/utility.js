function calcfeatureRange(data, sensorFeatureList) {
  let featureRange = {};
  Object.keys(data).forEach(sensor => {
    featureRange[sensor] = {};
    sensorFeatureList[sensor].forEach(feature => {
      let range = [];
      if (feature.split("_")[0] === "raw") {
        if (sensor === "audio") {
          range = [-0.5, 0.5];
        } else {
          range = [-0.6, 0.6]; // range fro raw sensor data
        }
      } else {
        range.push(Math.min.apply(null, data[sensor][feature]));
        range.push(Math.max.apply(null, data[sensor][feature]));
      }
      featureRange[sensor][feature] = range;
    });
  });
  return featureRange;
}

function objectToArray(featureRangeObj) {
  let featureRange = [];
  let numericKeys = [];
  Object.keys(featureRangeObj).forEach(strIndex =>
    numericKeys.push(Number(strIndex))
  );
  numericKeys
    .sort(function(a, b) {
      return a - b;
    })
    .forEach(index => {
      featureRange.push(featureRangeObj[index]);
    });
  return featureRange;
}

export { objectToArray, calcfeatureRange };

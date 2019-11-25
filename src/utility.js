function calcfeatureRange(data, sensorFeatureList) {
  let featureRange = {};
  console.log(sensorFeatureList);
  Object.keys(data).forEach(sensor => {
    featureRange[sensor] = {};
    sensorFeatureList[sensor].forEach(feature => {
      let range = [];
      if (feature.split("_")[0] === "raw") {
        if (sensor === "audio") {
          range = [-0.5, 0.5];
        } else {
          let sub_data = _getSample(data[sensor][feature]); // a sub-sample of the whole array
          range.push(Math.min.apply(null, sub_data));
          range.push(Math.max.apply(null, sub_data));
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

function _getSample(inputArray) {
  let subSampleArray = [];
  const sampleNum = 2000;
  const sampleSize = 20;
  const inputArraySize = inputArray.length;
  for (let i = 0; i < sampleNum; i++) {
    let idx = Math.floor(Math.random() * inputArraySize - sampleSize);
    let sample = inputArray.slice(idx, idx + sampleSize);
    subSampleArray.push(...sample);
  }
  return subSampleArray;
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

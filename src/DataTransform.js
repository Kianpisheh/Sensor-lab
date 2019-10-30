function transformData(dataArray) {
  // dataArray: [{mean: 0.9, std:0.03, ....}, {mean: 0.39, std:0.33, ....}]
  let newData = {};
  let i = 0;
  dataArray.forEach(features => {
    // {mean: 0.9, std:0.03, ....}
    Object.entries(features).forEach(entry => {
      const featureName = entry[0];
      const featureValue = entry[1];
      if (i === 0) {
        newData[featureName] = [featureValue];
      } else {
        newData[featureName].push(featureValue);
      }
    });
    i += 1;
  });
  return newData;
}

function removeTimeOffset(data) {
  let timestamps = [];
  for (var sensor in data) {
    // exclude audio; TODO: make all sensor data like eachother
    if (sensor !== "audio" && sensor !== "fft") {
      timestamps.push(data[sensor]["timestamp"][0]);
    }
  }
  let minTimestamp = Math.min(...timestamps);
  const newData = data;
  for (var sensor2 in data) {
    // exclude audio; TODO: make all sensor data like eachother
    if (sensor2 !== "audio" && sensor2 !== "fft") {
      newData[sensor2]["timestamp"] = data[sensor2]["timestamp"].map(
        timestamp => {
          return timestamp - minTimestamp;
        }
      );
    }
  }
  return newData;
}

export { removeTimeOffset, transformData };

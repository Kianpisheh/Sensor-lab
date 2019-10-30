import DrawingResource from "./DrawingResource";
import { objectToArray, calcfeatureRange } from "./utility.js";

class DrawingManager {
  constructor(numSamples) {
    this.sensorFeatureList = {};
    this.featureRange = {};
    this.numSamples = numSamples;
    this.drawingResources = [];
    this.nextBufferIdx = 0;
    this.numFeatures = {};
  }

  initialize(data) {
    // data is in the form of {acc: {mean: [34, 34, 23]}}

    // create the sensor-feature list
    this.sensorFeatureList = this._createSensorFeatureList(data);
    this.featureRange = calcfeatureRange(data, this.sensorFeatureList);
    this.addDrawingResource(-1);
  }

  addDrawingResource(topId) {
    const sensorName = Object.keys(this.sensorFeatureList)[0];
    const featureName = this.sensorFeatureList[sensorName][0];
    let type = "line_chart";
    if (
      featureName === "mfcc" ||
      featureName === "chroma" ||
      featureName === "fft"
    ) {
      type = "heatmap";
    }
    const drawingResource = new DrawingResource(
      sensorName,
      featureName,
      this.numSamples,
      this._getFeatureRange(sensorName, featureName, "normal")[0],
      this.nextBufferIdx,
      type,
      this._getFeatureRange(sensorName, featureName, "normal")[1]
    );
    if (this.drawingResources.length === 0) {
      this.drawingResources.push(drawingResource);
      this.nextBufferIdx += 1;
      return;
    }
    for (let i = 0; i < this.drawingResources.length; i++) {
      if (this.drawingResources[i].id === topId) {
        this.drawingResources.splice(i + 1, 0, drawingResource);
        this.nextBufferIdx += 1;
        break;
      }
    }
  }

  removeDrawingResource(id) {
    for (let i = 0; i < this.drawingResources.length; i++) {
      if (this.drawingResources[i].id === id) {
        this.drawingResources.splice(id, 1);
        break;
      }
    }
  }

  _createSensorFeatureList(data) {
    let sfList = {};
    Object.keys(data).forEach(sensor => {
      if (sensor === "audio") {
        sfList[sensor] = this._createAudioFeatureList(
          Object.keys(data[sensor])
        );
      } else if (sensor === "fft") {
        return;
      } else {
        sfList[sensor] = Object.keys(data[sensor]);
        // exclude timestamp and time from feature list
        let index = sfList[sensor].indexOf("timestamp");
        if (index !== -1) sfList[sensor].splice(index, 1);
        index = sfList[sensor].indexOf("time");
        if (index !== -1) sfList[sensor].splice(index, 1);
      }
    });

    return sfList;
  }

  _createAudioFeatureList(audioFeatureList) {
    let featureList = ["mfcc", "chroma", "fft"];
    audioFeatureList.forEach(feature => {
      if (
        feature.split("_")[0] !== "mfcc" &&
        feature.split("_")[0] !== "chroma"
      ) {
        featureList.push(feature);
      }
    });
    return featureList;
  }

  getDrawingRequests() {
    let drawingRequests = [];
    this.drawingResources.forEach(drawingResource => {
      drawingRequests.push(drawingResource.getDrawingInfo());
    });
    return drawingRequests;
  }

  _getFeatureRange(qSensor, qFeature, type) {
    let featureNum = 0;
    if (qFeature !== "mfcc" && qFeature !== "chroma" && qFeature !== "fft") {
      featureNum = 1;
      return [this.featureRange[qSensor][qFeature], featureNum];
    }

    if (qFeature === "fft") {
      qSensor = "fft";
    }
    featureNum = 0;
    let featureRangeObj = {};
    Object.entries(this.featureRange[qSensor]).forEach(entry => {
      let [feature_i, index] = entry[0].split("_");
      if (feature_i === qFeature && !isNaN(index)) {
        featureNum += 1;
        featureRangeObj[index] = this.featureRange[qSensor][
          feature_i + "_" + index
        ];
      }
    });
    let ranges = objectToArray(featureRangeObj);
    if (type === "normal") {
      return [ranges, featureNum];
    }
    let minVal = ranges[0][0];
    let maxVal = ranges[0][1];
    ranges.forEach(range => {
      if (range[0] < minVal) {
        minVal = range[0];
      }
      if (range[1] > maxVal) {
        maxVal = range[1];
      }
    });
    return [[minVal, maxVal], featureNum];
  }

  updateDrawingInfo(value, id, sensorChanged) {
    this.drawingResources.forEach(drawingResource => {
      if (drawingResource.id === id) {
        drawingResource.update(
          value,
          sensorChanged,
          this.sensorFeatureList,
          this
        );
      }
    });
    return this.getDrawingRequests();
  }

  updateBuffers(newSamples) {
    Object.entries(newSamples).forEach(entry => {
      const [id, sample] = entry;
      for (let i = 0; i < this.drawingResources.length; i++) {
        if (Number(id) === this.drawingResources[i].id) {
          this.drawingResources[i].pushSample(sample);
        }
      }
    });
  }

  reset() {
    this.drawingResources.forEach(drawingResource => {
      drawingResource.resetBuffer();
    });
  }
}

export default DrawingManager;

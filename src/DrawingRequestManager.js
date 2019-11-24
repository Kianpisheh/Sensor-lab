class DrawingRequestManager {
  constructor() {
    this.sensorFeatureList = null;

    //method binding
    this._createAudioFeatureList = this._createAudioFeatureList.bind(this);
    this._createSensorFeatureList = this._createSensorFeatureList.bind(this);
    this.updateDrawingRequest = this.updateDrawingRequest.bind(this);
    this.updateIndeces = this.updateIndeces.bind(this);
    this.createNewDrawingRequest = this.createNewDrawingRequest.bind(this);
    this.createInitialDrawingRequest = this.createInitialDrawingRequest.bind(
      this
    );
    this.removeDrawingRequest = this.removeDrawingRequest.bind(this);
  }
  createInitialDrawingRequest(loadedData) {
    const sensorFeatureList = this._createSensorFeatureList(loadedData);
    this.sensorFeatureList = sensorFeatureList;
    const sensor = Object.keys(sensorFeatureList)[0];
    const feature = sensorFeatureList[sensor][0];
    let type = "line_chart";
    if (feature === "mfcc" || feature === "chroma" || feature === "fft") {
      type = "heatmap";
    }
    DrawingRequestManager.nextRequestIndex = 1;
    return { id: 0, sensor: sensor, feature: feature, currIdx: 0, type: type };
  }

  updateDrawingRequest(currentRequestsList, value, id, sensorChanged) {
    let updatedRequestsList = [];
    currentRequestsList.forEach(drawingRequest => {
      if (drawingRequest.id === id) {
        if (sensorChanged) {
          drawingRequest.sensor = value;
          drawingRequest.feature = this.sensorFeatureList[value][0];
          drawingRequest.currIdx = 0;
        } else {
          drawingRequest.feature = value;
          drawingRequest.currIdx = 0;
        }
        drawingRequest.type = "line_chart";
        if (
          drawingRequest.feature === "mfcc" ||
          drawingRequest.feature === "chroma" ||
          drawingRequest.feature === "fft"
        ) {
          drawingRequest.type = "heatmap";
        }
      }
      updatedRequestsList.push(drawingRequest);
    });
    return updatedRequestsList;
  }

  updateIndeces(drawingRequestsList, newIndeces) {
    drawingRequestsList.forEach(drawingRequest => {
      if (newIndeces.hasOwnProperty(drawingRequest.id)) {
        drawingRequest.currIdx = newIndeces[drawingRequest.id];
      }
    });
    return drawingRequestsList;
  }

  createNewDrawingRequest(currentRequestsList, topId) {
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
    const drawingRequest = {
      id: DrawingRequestManager.nextRequestIndex,
      sensor: sensorName,
      feature: featureName,
      currIdx: 0,
      type: type
    };

    if (currentRequestsList.length === 0) {
      currentRequestsList.push(drawingRequest);
    } else {
      for (let i = 0; i < currentRequestsList.length; i++) {
        if (currentRequestsList[i].id === topId) {
          currentRequestsList.splice(i + 1, 0, drawingRequest);
        }
      }
    }
    DrawingRequestManager.nextRequestIndex += 1;
    return currentRequestsList;
  }

  removeDrawingRequest(currentRequestsList, id) {
    // do not remove the last one
    if (currentRequestsList.length === 1) {
      return currentRequestsList;
    }
    for (let i = 0; i < currentRequestsList.length; i++) {
      if (currentRequestsList[i].id === id) {
        currentRequestsList.splice(i, 1);
        return currentRequestsList;
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

  resetIndex(drawingRequestsList) {
    let updatedRequestList = [];
    drawingRequestsList.forEach(drawingRequest => {
      drawingRequest.currIdx = 0;
      updatedRequestList.push(drawingRequest);
    });
    return updatedRequestList;
  }
}

export default DrawingRequestManager;

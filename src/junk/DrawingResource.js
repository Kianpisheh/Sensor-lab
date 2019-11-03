class DrawingResource {
  constructor(
    sensorName,
    featureName,
    numSamples,
    featureRange,
    id,
    type,
    numFeatures
  ) {
    this.id = id;
    this.sensor = sensorName;
    this.feature = featureName;
    this.numSamples = numSamples;
    this.featureRange = featureRange;
    this.numFeatures = numFeatures;
    this.buffer = this.createBuffer(numSamples, type, numFeatures);
    this.currIdx = 0;
    this.type = type;
  }

  createBuffer(numSamples, type, numFeatures) {
    let buffer = null;
    if (type === "line_chart") {
      buffer = new Array(numSamples).fill({ value: null, timestamp: null });
    } else if (type === "heatmap") {
      buffer = new Array(numSamples).fill({
        value: new Array(numFeatures).fill(null),
        timestamp: null
      });
    }
    return buffer;
  }

  update(value, sensorChanged, featureList, drawingManager) {
    if (sensorChanged) {
      this.sensor = value;
      let feature = featureList[value][0];
      this.feature = feature;
      if (feature === "mfcc" || feature === "chroma" || "fft") {
        this.type = "heatmap";
      } else {
        this.type = "line_chart";
      }
    } else {
      this.feature = value;
      if (value === "mfcc" || value === "chroma" || value === "fft") {
        this.type = "heatmap";
      } else {
        this.type = "line_chart";
      }
    }
    [this.featureRange, this.numFeatures] = drawingManager._getFeatureRange(
      this.sensor,
      this.feature,
      "normal"
    );

    this.resetBuffer();
  }

  pushSample(sample) {
    this.buffer.push(sample);
    this.buffer.shift();
    if (!Array.isArray(sample)) {
      if (sample.value != null) {
        this.currIdx += 1;
      }
    } else {
      if (sample[sample.length - 1].value != null) {
        this.currIdx += 1;
      }
    }
  }

  resetBuffer() {
    this.buffer = this.createBuffer(
      this.numSamples,
      this.type,
      this.numFeatures
    );
    this.currIdx = 0;
  }

  getDrawingInfo() {
    return {
      sensor: this.sensor,
      feature: this.feature,
      id: this.id,
      index: this.currIdx,
      type: this.type
    };
  }
}

export default DrawingResource;

import Papa from "papaparse";
import { objectToArray } from "./utility.js";
import { transformData, removeTimeOffset } from "./DataTransform.js";

class DataManager {
  constructor(onDataLoaded) {
    this.data = {}; // {acc: {mean: [0.3, 0.1], ...}, ...}
    this.audioURL = null;
    this.load = this.load.bind(this);
    this.onDataLoaded = onDataLoaded;
    this.audioSampleRate = 22050;
    this.loaded = [];
    this.parser = null;
  }

  load(targetFiles) {
    for (let i = 0; i < targetFiles.length; i++) {
      if (targetFiles[i].name.endsWith(".wav")) {
        this._load_raw_audio(targetFiles[i], targetFiles.length);
        this.audioURL = URL.createObjectURL(targetFiles[i]);
        continue;
      } else {
        this._laod_csv(targetFiles[i], targetFiles.length);
      }
    }
  }

  getSample(drawingRequests, timestamp, tolerence) {
    let samples = {};
    let newIndeces = {};
    drawingRequests.forEach(drawingRequest => {
      let { sensor, feature, currIdx } = drawingRequest;

      let featureValue = null;
      let newIndex = currIdx;
      if (sensor === "audio") {
        featureValue = this._getAudioFeature(
          feature,
          timestamp,
          currIdx,
          tolerence
        );
      } else {
        // other sensors
        [featureValue, newIndex] = this._getSensorFeature(
          sensor,
          feature,
          timestamp,
          currIdx,
          tolerence
        );
      }
      samples[drawingRequest.id] = {
        value: featureValue,
        timestamp: timestamp
      };
      newIndeces[drawingRequest.id] = newIndex;
    });
    return [samples, newIndeces];
  }

  _getAudioFeature(qFeature, timestamp, index, tolerence) {
    // everything except FFT and Raw
    if (qFeature !== "raw" && qFeature !== "fft") {
      if (qFeature === "mfcc" || qFeature === "chroma") {
        let [nextIndex, nextTimestamp] = this._findNextIndex(
          this.data["audio"],
          timestamp,
          index
        );
        if (nextTimestamp - timestamp > tolerence * 1000) {
          return [null, index];
        }
        let valuesObj = {};
        Object.keys(this.data["audio"]).forEach(feature_ => {
          let [feature, f_index] = feature_.split("_");
          if (feature === qFeature && !isNaN(f_index)) {
            valuesObj[f_index] = this.data["audio"][feature_][nextIndex];
          }
        });
        return [objectToArray(valuesObj), nextIndex];
      } else {
        return this._getSensorFeature(
          "audio",
          qFeature,
          timestamp,
          index,
          tolerence
        );
      }
    } else if (qFeature === "fft") {
      let [nextIndex, nextTimestamp] = this._findNextIndex(
        this.data["fft"],
        timestamp,
        index
      );
      if (nextTimestamp - timestamp > tolerence * 1000) {
        return [null, index];
      }
      let valuesObj = {};
      Object.keys(this.data["fft"]).forEach(feature_ => {
        let [feature, f_index] = feature_.split("_");
        if (feature === "fft" && !isNaN(f_index)) {
          valuesObj[f_index] = this.data["fft"][feature_][nextIndex];
        }
      });
      return [objectToArray(valuesObj), nextIndex];
    }
  }

  _getSensorFeature(qSensor, qFeature, timestamp, index, tolerence) {
    // find the (potential) next sample
    let [nextIndex, nextTimestamp] = this._findNextIndex(
      this.data[qSensor],
      timestamp,
      index
    );

    if (nextTimestamp - timestamp > tolerence * 1000) {
      return [null, index];
    }
    return [this.data[qSensor][qFeature][nextIndex], nextIndex];
  }

  _getAudioIndex(timestamp, samplingRate) {
    return Math.round((timestamp / 1000) * samplingRate);
  }

  // Helper methods
  _load_raw_audio(file, totNum) {
    var arrayBuffer = file.arrayBuffer();
    let context = new AudioContext({ sampleRate: this.audioSampleRate });
    arrayBuffer.then(buffer => {
      var audioBuffer = context.decodeAudioData(buffer);
      audioBuffer.then(audioBuffer => {
        this.loaded.push(1);
        if (this.data["audio"] === undefined) {
          this.data["audio"] = {};
        }
        this.data["audio"]["raw"] = audioBuffer.getChannelData(0);
        if (this.loaded.length === totNum) {
          this.data = removeTimeOffset(this.data);
          this.onDataLoaded();
        }
      });
    });
    return this.data;
  }

  _laod_csv(file, totNum) {
    const config = {
      complete: results => {
        const sensorName = file.name.split(".")[0];
        this.data[sensorName] = transformData(results.data);
        this.loaded.push(1);
        if (this.loaded.length === totNum) {
          this.data = removeTimeOffset(this.data);
          this.onDataLoaded();
        }
      },
      header: true,
      dynamicTyping: true
    };

    Papa.parse(file, config);
  }

  _addTimestamp(audioArrayBuffer) {
    const rate = 1 / audioArrayBuffer.sampleRate;
    let data = audioArrayBuffer.getChannelData(0);
    let output = [];
    let time = 0;
    data.forEach(d => {
      output.push({ value: d, timestamp: time });
      time += rate;
    });
    return output;
  }

  _getValue(qSensor, qFeature, nextIndex) {
    if (qSensor !== "audio") {
      return this.data[qSensor][qFeature][nextIndex];
    }
    let valuesObj = {};
    Object.keys(this.data[qSensor]).forEach(feature_ => {
      let [feature, index] = feature_.split("_");
      if (feature === qFeature && !isNaN(index)) {
        valuesObj[index] = this.data["audio"][feature_][nextIndex];
      }
    });
    return objectToArray(valuesObj);
  }

  _findNextIndex(sensorData, time, currIdx) {
    while (currIdx < sensorData["timestamp"].length - 1) {
      const nextIndex = currIdx + 1;
      const nextTimestamp = sensorData["timestamp"][nextIndex];
      const currTimestamp = sensorData["timestamp"][currIdx];
      if (Math.abs(nextTimestamp - time) <= Math.abs(currTimestamp - time)) {
        currIdx = nextIndex;
      } else {
        return [currIdx, currTimestamp];
      }
    }
  }
}

export default DataManager;

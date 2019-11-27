import React, { Component } from "react";
import VisPanelContext from "./VisPanelContext";
import DrawBatchDataWorker from "../DrawBatchDataWorker.js";
import WebWorker from "../WebWorker";
import GetImageWorker from "../GetImageWorker";

const width = 500;
const height = 150;
//TODO

class OverviewLineChart extends Component {
  // access the canvas
  static contextType = VisPanelContext;

  constructor(props, context) {
    super(props);
    this.sensor = null;
    this.feature = null;
    this.completeView = null;
    this.timeWindow = context.overviewTimeWindow; // seconds
    this.currTime = context.currTime;

    // method bindings
    this.drawOverview = this.drawOverview.bind(this);
    this._getImage = this._getImage.bind(this);
  }

  render() {
    const { sensor, feature } = this.props.drawingRequest;
    // check if it is needed to redraw the overview signal
    if (
      sensor !== this.sensor ||
      feature !== this.feature ||
      this.context.overviewTimeWindow !== this.timeWindow ||
      this.currTime !== this.context.overviewCurrTime
    ) {
      this.timeWindow = this.context.overviewTimeWindow;
      this.currTime = this.context.overviewCurrTime;
      this.drawOverview(sensor, feature);
      this.sensor = sensor;
      this.feature = feature;
    }
    return (
      <div style={{ position: "relative" }}>
        <canvas
          style={{
            position: "absolute",
            left: 0,
            zIndex: 0
          }}
          id={"layer1"}
          ref={"axesAndGrids"}
          width={width}
          height={height}
        />
        <canvas
          style={{
            left: 0,
            zIndex: 1,
            overflow: "scroll"
          }}
          id={"layer2"}
          ref={"canvas"}
          width={width}
          height={height}
        />
      </div>
    );
  }

  componentDidMount() {
    // retrieve the data
    const drawingRequest = this.props.drawingRequest;
    const { sensor, feature } = drawingRequest;
    this.drawOverview(sensor, feature);
    this.sensor = sensor;
    this.feature = feature;

    //setup the on-screen canvas
    this.canvas = this.refs.canvas;
    this.canvasContext = this.canvas.getContext("2d");
  }

  drawOverview(sensor, feature, time) {
    if (sensor === null && feature === null) {
      console.log("null sensor or feature");
      return;
    }
    let timestamps = this.context.dataBatch[sensor]["timestamp"];

    // calculate off-screen canvas width
    let dataDuration = 100 * 1000;
    if (sensor === "audio" && feature === "raw") {
      dataDuration = Math.floor(
        (this.context.dataBatch["audio"]["raw"].length / this.context.audioSR) *
          1000
      );
    } else {
      // FIXME: the last timestamp sometimes is negative
      dataDuration = timestamps[timestamps.length - 5] - timestamps[0];
    }
    let offScreenCanvasWidth = Math.floor(
      Math.floor((dataDuration / (this.timeWindow * 1000)) * width)
    );

    let step = 1;
    if (sensor === "audio" && feature === "raw") {
      step = 20;
    }

    // create the worker thread
    let drawBatchDataWorker = new WebWorker(DrawBatchDataWorker);
    drawBatchDataWorker.onmessage = e => {
      this.canvasContext.clearRect(0, 0, width, height);

      this.completeView = e.data;
      let xCoord_0 = Math.floor(
        ((this.context.overviewCurrTime * 60000) / dataDuration) *
          offScreenCanvasWidth
      );
      let xCoord_1 = Math.floor(
        ((this.context.overviewCurrTime * 60000 + this.timeWindow * 1000) /
          dataDuration) *
          offScreenCanvasWidth
      );
      console.log("width", offScreenCanvasWidth);
      // get image (the portion we need)
      let getImageWorker = new WebWorker(GetImageWorker);
      getImageWorker.onmessage = e => {
        this.canvasContext.putImageData(e.data, 0, 0);
      };
      getImageWorker.postMessage({
        imageData: this.completeView,
        x0: xCoord_0,
        x1: xCoord_1,
        y0: 0,
        width: width,
        height: height
      });
    };

    // send data to the worker thread for drawing
    drawBatchDataWorker.postMessage({
      timestamps: timestamps,
      sensor,
      feature,
      data: this.context.dataBatch[sensor][feature],
      width: offScreenCanvasWidth,
      height: height,
      timeWindow: this.timeWindow,
      dataRange: this.props.dataRange,
      audioSR: this.context.audioSR,
      step
    });
  }

  _getImage(imageData, x0, y0, width, height) {
    let sw = imageData.width;
    let result = this.canvasContext.createImageData(width, height);
    let data = result.data;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        data[y * (width * 4) + x * 4] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4];
        data[y * (width * 4) + x * 4 + 1] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 1];
        data[y * (width * 4) + x * 4 + 2] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 2];
        data[y * (width * 4) + x * 4 + 3] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 3];
      }
    }
    return result;
  }
}

export default OverviewLineChart;

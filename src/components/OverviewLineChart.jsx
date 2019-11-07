import React, { Component } from "react";
import AppContext from "../AppContext";
import DrawBatchDataWorker from "../DrawBatchDataWorker.js";
import WebWorker from "../WebWorker";
import GetImageWorker from "../GetImageWorker";

const width = 500;
const height = 150;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };
//TODO

class OverviewLineChart extends Component {
  // access the canvas
  static contextType = AppContext;

  constructor(props, context) {
    super(props);
    this.dataBath = null;
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
            top: this.props.hp * (this.props.idx + 1) + this.props.idx * height,
            zIndex: 0
          }}
          id={"layer1"}
          ref={"axesAndGrids"}
          width={width}
          height={height}
        />
        <canvas
          style={{
            position: "absolute",
            left: 0,
            top: this.props.hp * (this.props.idx + 1) + this.props.idx * height,
            zIndex: 1,
            overflow: "scroll"
          }}
          id={"layer2"}
          ref={"canvas"}
          width="500"
          height="150"
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

    //setup the on screen canvas
    this.canvas = this.refs.canvas;
    this.canvasContext = this.canvas.getContext("2d");
  }

  drawOverview(sensor, feature, time) {
    if (sensor === null && feature === null) {
      console.log("null sensor or feature");
      return;
    }
    this.dataBatch = this.context.dataBatch[sensor][feature];
    let timestamps = this.context.dataBatch[sensor]["timestamp"];

    // calculate off-screen canvas width
    const offScreenCanvasWidth = Math.floor(
      ((timestamps[timestamps.length - 1] - timestamps[0]) /
        (this.timeWindow * 1000)) *
        width
    );

    // create the worker thread
    let drawBatchDataWorker = new WebWorker(DrawBatchDataWorker);
    drawBatchDataWorker.onmessage = e => {
      this.canvasContext.clearRect(0, 0, width, height);

      this.completeView = e.data;
      let xCoord = Math.floor(
        ((this.context.overviewCurrTime * 60000) /
          timestamps[timestamps.length - 1]) *
          offScreenCanvasWidth
      );
      // get image (the portion we need)
      let getImageWorker = new WebWorker(GetImageWorker);
      getImageWorker.onmessage = e => {
        this.canvasContext.putImageData(e.data, 0, 0);
      };
      getImageWorker.postMessage({
        imageData: this.completeView,
        x0: xCoord,
        y0: 0,
        width: width,
        height: height
      });
    };

    // send data to the worker thread for drawing
    drawBatchDataWorker.postMessage({
      timestamps: timestamps,
      data: this.dataBatch,
      width: offScreenCanvasWidth,
      height: height,
      timeWindow: this.timeWindow
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

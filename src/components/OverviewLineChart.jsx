import React, { Component } from "react";
import AppContext from "../AppContext";
import DrawBatchDataWorker from "../DrawBatchDataWorker.js";
import WebWorker from "../WebWorker";

const width = 500;
const height = 150;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class OverviewLineChart extends Component {
  // access the canvas
  static contextType = AppContext;

  constructor(props, context) {
    super(props);
    this.dataBath = null;
    this.sensor = null;
    this.feature = null;
    this.timeWindow = context.overviewTimeWindow; // seconds

    // method bindings
    this.drawOverview = this.drawOverview.bind(this);
  }

  render() {
    const { sensor, feature } = this.props.drawingRequest;
    // check if it is needed to redraw the overview signal
    if (
      sensor !== this.sensor ||
      feature !== this.feature ||
      this.context.overviewTimeWindow !== this.timeWindow
    ) {
      this.timeWindow = this.context.overviewTimeWindow;
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
            zIndex: 1
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

    //setup the on screen canvas
    this.canvas = this.refs.canvas;
    this.canvasContext = this.canvas.getContext("2d");
  }

  drawOverview(sensor, feature) {
    if (sensor === null && feature === null) {
      console.log("null sensor or feature");
      return;
    }
    console.log(this.timeWindow);
    this.dataBatch = this.context.dataBatch[sensor][feature];
    let timestamps = this.context.dataBatch[sensor]["timestamp"];
    // create the worker thread
    let drawBatchDataWorker = new WebWorker(DrawBatchDataWorker);
    drawBatchDataWorker.onmessage = e => {
      this.canvasContext.clearRect(0, 0, width, height);
      this.canvasContext.putImageData(e.data, 0, 0);
    };

    // calculate off-screen canvas width
    const offScreenCanvasWidth = Math.floor(
      ((timestamps[timestamps.length - 1] - timestamps[0]) /
        (this.timeWindow * 1000)) *
        width
    );

    // send data to the worker thread for drawing
    drawBatchDataWorker.postMessage({
      timestamps: timestamps,
      data: this.dataBatch,
      width: offScreenCanvasWidth,
      height: height,
      timeWindow: this.timeWindow
    });
  }
}

export default OverviewLineChart;

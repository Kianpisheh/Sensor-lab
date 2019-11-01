import React, { Component } from "react";
import AppContext from "../AppContext";
import * as d3 from "d3";
import DrawBatchDataWorker from "../DrawBatchDataWorker.js";
import WebWorker from "../WebWorker";

const width = 900 * 30;
const height = 150;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class OverviewLineChart extends Component {
  // access the canvas
  static contextType = AppContext;

  constructor(props, context) {
    super(props);
    this.dataBath = null;

    // setup scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, context.timeWindow * 1000 * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain([-5, 5])
      .range([height - margin.bottom, margin.top]);
  }

  render() {
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
    if (sensor === null && feature === null) {
      console.log("null sensor or feature");
      return;
    }
    this.dataBatch = this.context.dataBatch[sensor][feature];
    let timestamp = this.context.dataBatch[sensor]["timestamp"];

    //setup the on screen canvas
    this.canvas = this.refs.canvas;
    this.canvasContext = this.canvas.getContext("2d");

    // create the worker thread
    let drawBatchDataWorker = new WebWorker(DrawBatchDataWorker);
    drawBatchDataWorker.onmessage = e => {
      console.log(e.data);
      this.canvasContext.putImageData(e.data, 0, 0);
    };

    // send data to the worker thread for drawing
    drawBatchDataWorker.postMessage({
      timestamps: timestamp,
      data: this.dataBatch,
      width: width,
      height: height,
      timeWindow: this.context.timeWindow * 1000
    });
  }
}

export default OverviewLineChart;

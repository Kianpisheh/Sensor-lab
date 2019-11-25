import React, { Component } from "react";
import * as d3 from "d3";
import AppContext from "../AppContext";

const width = 500;
const height = 250;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

function timeFormat(time) {
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = "0" + seconds.toString();
  } else {
    seconds = seconds.toString();
  }
  let minutes = Math.floor(time / 60);
  if (minutes < 10) {
    minutes = "0" + minutes.toString();
  } else {
    minutes = minutes.toString();
  }
  return minutes + ":" + seconds;
}

class LineChartCanvas extends Component {
  static contextType = AppContext;

  constructor(props, context) {
    super(props);
    this.canvas = null;
    this.canvasContext = null;
    this.prevPoint = null;
    this.sample_num = 1;
    this.data = null;
    this.dataRange = this.getRange(this.props.dataRange);
    this.valueTickSize = this.getValueTickSize(this.props.dataRange);

    // setup scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, context.timeWindow * 1000])
      .range([margin.left, width - margin.right]);

    // tick size
    this.timeTickSize = context.timeWindow / 10;

    console.log(this.valueTickSize);

    // method binding :(
    this.getCoordinates = this.getCoordinates.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawTimeAxis = this.drawTimeAxis.bind(this);
    this.drawValueAxis = this.drawValueAxis.bind(this);
    this.drawGrids = this.drawGrids.bind(this);
    this.drawTick = this.drawTick.bind(this);
    this.yScale2 = this.yScale2.bind(this);
    this.yScaleInv = this.yScaleInv.bind(this);
    this.getRange = this.getRange.bind(this);
    this.getValueTickSize = this.getValueTickSize.bind(this);
  }

  getValueTickSize(dataRange) {
    let tickSize = 5;
    if (dataRange[0] !== dataRange[1]) {
      tickSize = Math.floor((height - margin.top - margin.bottom) / 10);
    }
    return tickSize;
  }

  getRange(dataRange) {
    let range = [];
    if (dataRange[0] === dataRange[1]) {
      range = [dataRange[0] - 1, dataRange[0] + 1];
    } else {
      range = dataRange;
    }
    return range;
  }

  yScale2(y) {
    return (
      height -
      margin.bottom -
      ((y - this.dataRange[0]) / (this.dataRange[1] - this.dataRange[0])) *
        (height - margin.top - margin.bottom)
    );
  }

  yScaleInv(p) {
    return (
      this.dataRange[0] +
      (this.dataRange[1] - this.dataRange[0]) *
        ((height - margin.bottom - p) / (height - margin.top - margin.bottom))
    );
  }

  render() {
    if (this.props.dataToDraw !== null && this.props.dataToDraw !== undefined) {
      this.data = this.props.dataToDraw[this.props.reqId];
    }
    if (this.data !== null && this.data !== undefined) {
      // acquire and scale the data point
      const point = this.getCoordinates(this.data);

      if (this.axesContext && this.canvasContext) {
        this.drawTimeAxis(point[0]);
        this.drawValueAxis();
        this.drawGrids();
        this.drawLine(point);
      }
      this.prevPoint = point;
    }

    return (
      <div id="linechart_canvases">
        <canvas
          id="layer1"
          ref={"axesAndGridCanvas"}
          width={width}
          height={height}
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            zIndex: 0
          }}
        ></canvas>
        <canvas
          id="layer2"
          ref={"canvas"}
          width={width}
          height={height}
          style={{
            backgroundColor: "transparent",
            zIndex: 1
          }}
        ></canvas>
      </div>
    );
  }

  // darwing methods
  drawLine(point) {
    // find the shift step
    let a =
      Math.round(this.xScale(this.sample_num * this.context.rate * 1000)) -
      Math.round(this.xScale((this.sample_num - 1) * this.context.rate * 1000));

    // get the remaining data
    let oldData = this.canvasContext.getImageData(
      margin.left + a,
      margin.top,
      width - margin.right - margin.left - a,
      height - margin.top - margin.bottom
    );

    this.sample_num += 1;

    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // shift and re-draw the old data
    this.canvasContext.putImageData(oldData, margin.left, margin.top);

    // draw the new data
    if (this.prevPoint === null) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(width - margin.right, height - margin.bottom);
      this.canvasContext.stroke();
      this.canvasContext.closePath();
    } else {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(
        width - margin.right - a,
        Math.round(this.yScale2(this.prevPoint[1]))
      );
      this.canvasContext.lineTo(
        width - margin.right,
        Math.round(this.yScale2(point[1]))
      );
      this.canvasContext.stroke();
      this.canvasContext.closePath();
    }
  }

  drawValueAxis() {
    // draw the horizontaal line
    this.axesContext.beginPath();
    this.axesContext.strokeStyle = "#000000";
    this.axesContext.lineWidth = 2;
    this.axesContext.moveTo(Math.round(this.xScale(0)), margin.top);
    this.axesContext.lineTo(Math.round(this.xScale(0)), height - margin.bottom);
    this.axesContext.stroke();
    this.axesContext.closePath();
  }

  drawGrids() {
    // virtical grids
    let x = this.xScale(this.timeTickSize);
    this.axesContext.beginPath();
    this.axesContext.strokeStyle = "#E1E1E1";
    this.axesContext.lineWidth = 1;
    let f = false;
    while (x < width - margin.right) {
      if (f) {
        this.axesContext.moveTo(x, height - margin.bottom);
        this.axesContext.lineTo(x, margin.bottom);
      }
      f = true;
      x += this.xScale(this.timeTickSize);
    }

    // horizontal grids
    let y = this.valueTickSize;
    while (y < height - margin.top) {
      this.axesContext.moveTo(margin.left, y);
      this.axesContext.lineTo(width - margin.right, y);
      y += this.valueTickSize;
    }

    this.axesContext.stroke();
    this.axesContext.closePath();

    y = this.valueTickSize;
    this.axesContext.beginPath();
    this.axesContext.strokeStyle = "#000000";
    this.axesContext.lineWidth = 2;
    while (y < height - margin.top) {
      y += this.valueTickSize;
      this.drawTick(y, "horizontal");
      this.axesContext.fillText(
        this.yScaleInv(y).toFixed(2),
        margin.left - 35,
        y
      );
    }
    this.axesContext.stroke();
    this.axesContext.closePath();
  }

  drawTimeAxis(time) {
    // draw the horizontaal line
    this.axesContext.clearRect(0, 0, width, height);
    this.axesContext.beginPath();
    this.axesContext.moveTo(this.xScale(0), height - margin.bottom);
    this.axesContext.lineTo(
      this.xScale(this.context.timeWindow * 1000),
      height - margin.bottom
    );

    if (this.context.timeWindow - this.lastTick > this.timeTickSize) {
      this.lastTick += this.timeTickSize;
      this.lastTime = time / 1000;
    }
    let x = this.xScale(this.lastTick * 1000);
    let t = Math.round(this.lastTime);
    while (x > margin.left) {
      this.drawTick(x, "vertical");
      this.axesContext.fillText(
        timeFormat(t),
        x - 6,
        height - margin.bottom + 10
      );
      x -= this.xScale(this.timeTickSize * 1000) - margin.left;
      t -= Math.round(this.timeTickSize);
    }
    this.axesContext.stroke();
    this.axesContext.closePath();
    this.lastTick -= this.context.rate;
  }

  drawTick(p, direction) {
    if (direction === "vertical") {
      this.axesContext.moveTo(p, height - margin.bottom);
      this.axesContext.lineTo(p, height - margin.bottom - 5);
    } else if (direction === "horizontal") {
      this.axesContext.moveTo(margin.left, p);
      this.axesContext.lineTo(margin.left + 5, p);
    }
  }

  getCoordinates(data) {
    const { value, timestamp } = data;
    return [timestamp, value];
  }

  componentDidUpdate() {
    if (this.dataRange !== this.props.dataRange) {
      this.dataRange = this.getRange(this.props.dataRange);
      this.valueTickSize = this.getValueTickSize(this.props.dataRange);
      console.log(this.valueTickSize);
    }
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.lineWidth = 2;
    this.axesCanvas = this.refs.axesAndGridCanvas;
    this.axesContext = this.axesCanvas.getContext("2d");
    this.axesContext.lineWidth = 2;

    //
    this.lastTick = this.context.timeWindow;
    this.lastTime = 0;
  }
}

export default LineChartCanvas;

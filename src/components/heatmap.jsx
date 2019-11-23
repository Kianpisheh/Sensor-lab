import React, { Component } from "react";
import * as d3 from "d3";
import AppContext from "../AppContext";

const width = 500;
const height = 300;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class Heatmap extends Component {
  static contextType = AppContext;

  constructor(props, context) {
    super(props);

    // settings
    this.logScale = true;

    this.timeWindow = context.timeWindow;
    this.rate = context.rate;
    this.canvas = null;
    this.ctx = null;
    this.drawHeatmap = this.drawHeatmap.bind(this);
    this.updateDrawingTools = this.updateDrawingTools.bind(this);

    this.numSamples = this.props.dataToDraw.length;

    this.numFeatures = this.props.dataToDraw.value[0].length;
    this.data = new Array(this.numSamples).fill(
      new Array(this.numFeatures).fill(null)
    );
    // setup scales
    this.setScales();
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.numSamples = this.props.dataToDraw.length;

    this.numFeatures = this.props.dataToDraw[0].value.length;
    this.data = new Array(this.numSamples).fill(
      new Array(this.numFeatures).fill(null)
    );
    // setup scales
    this.setScales();
  }

  render() {
    this.updateDrawingTools();
    let data = this.props.dataToDraw;
    if (data[data.length - 1].value !== undefined) {
      this.data.push(data[data.length - 1].value);
      this.data.shift();
      if (this.ctx !== null) {
        this.drawHeatmap(this.data[this.data.length - 1]);
      }
    }
    return <canvas ref="canvas" width={width} height={height} />;
  }

  updateDrawingTools() {
    this.numSamples = this.props.dataToDraw.length;

    this.numFeatures = this.props.dataToDraw.value[0].length;
    this.data = new Array(this.numSamples).fill(
      new Array(this.numFeatures).fill(null)
    );
    this.setScales();
  }

  setScales() {
    // setup scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.timeWindow * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.props.numFeatures - 1])
      .range([height - margin.bottom, margin.top]);

    this.colorScale = d3.scaleSequential(d3.interpolateViridis);

    //const domain = this.props.ylim;
    // TODO: domain from the input data
    const domain = [-20, 20];

    if (this.logScale) {
      this.colorScale.domain([
        Math.log10(Math.abs(domain[0])),
        Math.log10(Math.abs(domain[1]))
      ]);
    } else {
      this.colorScale.domain(domain);
    }
  }

  drawHeatmap(data) {
    // erase the first column
    if (data === null || data === undefined) {
      return;
    }
    this.ctx.clearRect(
      margin.left,
      margin.top,
      this.xScale(this.rate * 1000) - margin.left,
      this.canvas.height - margin.bottom - margin.top
    );

    // get the remaining data
    let oldData = this.ctx.getImageData(
      Math.round(this.xScale(this.rate * 1000)),
      margin.top,
      Math.round(
        this.canvas.width - margin.right - this.xScale(this.rate * 1000)
      ),
      this.canvas.height - margin.bottom - margin.top
    );

    // shift and re-draw the old data
    this.ctx.putImageData(oldData, margin.left, margin.top);

    // draw the last column
    data.forEach((d, i) => {
      this.colorScale.domain([
        Math.log10(this.props.ylim[i][0]),
        Math.log10(this.props.ylim[i][1])
      ]);
      this.ctx.fillStyle = this.colorScale(Math.log10(Math.abs(d)));
      let rectHeight = Math.round(this.yScale(1) - this.yScale(2));
      if (rectHeight === 0) {
        rectHeight = 1;
      }
      this.ctx.fillRect(
        Math.round(this.xScale((this.timeWindow - this.rate) * 1000)),
        Math.round(this.yScale(i)),
        Math.round(this.xScale(this.rate * 1000) - margin.left),
        rectHeight
      );
    });
  }
}

export default Heatmap;

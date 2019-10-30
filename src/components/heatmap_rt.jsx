import React, { Component } from "react";
import * as d3 from "d3";

const width = 500;
const height = 200;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class HeatMapRT extends Component {
  constructor(props) {
    super(props);
    this.numSamples = this.props.dataToDraw.length;
    this.numFeatures = this.props.dataToDraw[0].value.length;

    this.buffer = new Array(this.numSamples).fill(
      new Array(this.numFeatures).fill(null)
    );
    this.currIdx = 0;

    // setup x, y and the color scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.props.xlim * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.numFeatures - 1])
      .range([height - margin.bottom, margin.top]);
    this.colorScale = d3
      .scaleSequential(d3.interpolatePlasma)
      .domain([-12, 12]);
  }

  rectVector() {
    const sampleIndex = this.props.sampleIndex % this.numSamples;
    if (
      this.props.dataToDraw[this.props.dataToDraw.length - 1].value === null
    ) {
      return null;
    }
    let rects = this.props.dataToDraw[
      this.props.dataToDraw.length - 1
    ].value.map((featureValue, f_i) => (
      <rect
        key={f_i.toString() + sampleIndex.toString()}
        x={this.xScale((this.numSamples - 1) * 1000 * this.props.rate)}
        y={this.yScale(this.numFeatures - f_i)}
        width={this.xScale(1000 * this.props.rate)}
        height={this.yScale(1)}
        fill={this.colorScale(featureValue)}
      ></rect>
    ));
    console.log(rects[0].props);
    return rects;
  }

  render() {
    const rects = this.rectVector();
    if (rects !== null) {
      console.log();
    }
    this.buffer.push(rects);
    this.buffer.shift();
    return (
      <svg
        width={width}
        height={height}
        style={{ strokeWidth: "1px", backgroundColor: "DFF5F7" }}
      >
        {this.buffer}
      </svg>
    );
  }
}

function RectVector(props) {
  let { data, width, height, sampleIndex } = props;
  sampleIndex %= props.numSamples;
  if (data[data.length - 1].value === null) {
    return null;
  }
  let rects = data[data.length - 1].value.map((featureValue, f_i) => {
    return (
      <rect
        key={f_i.toString() + sampleIndex.toString()}
        x={props.xScale(sampleIndex * 1000 * width)}
        y={props.yScale(props.numFeatures - f_i)}
        width={props.xScale(1000 * width)}
        height={props.yScale(height)}
        fill={props.colorScale(featureValue)}
      ></rect>
    );
  });
  return rects;
}

export default HeatMapRT;

import React, { Component } from "react";
import * as d3 from "d3";

const width = 500;
const height = 200;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

// pre-conditions
// this.props.dataToDraw is an array of arrays

class Heatmap extends Component {
  state = {
    dataDomain: [0, 1]
  };
  constructor(props) {
    super(props);
    // scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.props.xlim * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.props.numFeatures - 1])
      .range([height - margin.bottom, margin.top]);
    this.colorScale = d3
      .scaleSequential(d3.interpolatePlasma)
      .domain([-12, 12]);
  }

  render() {
    // scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.props.xlim * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.props.numFeatures - 1])
      .range([height - margin.bottom, margin.top]);
    this.colorScale = d3
      .scaleSequential(d3.interpolatePlasma)
      .domain([-12, 12]);
    return (
      <svg
        width={width}
        height={height}
        style={{ strokeWidth: "1px", backgroundColor: "DFF5F7" }}
      >
        <RectMatrix
          key={this.props.id}
          data={this.props.dataToDraw}
          rate={this.props.rate}
          xScale={this.xScale}
          yScale={this.yScale}
          colorScale={this.colorScale}
          numFeatures={this.props.numFeatures}
        ></RectMatrix>
      </svg>
    );
  }
}

function RectMatrix(props) {
  let { data, rate } = props;
  let rectMat = data.map((sample_t, index) => {
    if (sample_t.value === null) {
      return null;
    }
    return sample_t.value.map((featureValue, f_i) => {
      return (
        <rect
          key={f_i.toString() + index.toString()}
          x={props.xScale(index * 1000 * rate)}
          y={props.yScale(props.numFeatures - f_i)}
          width={props.xScale(1000 * rate)}
          height={props.yScale(1)}
          fill={props.colorScale(featureValue)}
        ></rect>
      );
    });
  });
  return rectMat;
}

export default Heatmap;

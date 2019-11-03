import React, { Component } from "react";
import * as d3 from "d3";
import AppContext from "../AppContext";

const width = 500;
const height = 200;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class LineChart extends Component {
  static contextType = AppContext;

  state = {
    dataDomain: [0, 1]
  };

  constructor(props, context) {
    super(props);
    this.timeWindow = context.timeWindow;
    this.rate = context.rate;
    this.setupPlot(this.state.dataDomain);
  }

  render() {
    var xAxisTranslate = height - margin.bottom;
    var yAxisTranslate = margin.left;

    return (
      <svg
        width={width}
        height={height}
        style={{ strokeWidth: "1px", backgroundColor: "DFF5F7" }}
      >
        <rect width={width} height={height} fill="#DFF5F7"></rect>
        <g>
          {/* girds*/}
          <g
            ref="yGridLines"
            transform={"translate(" + yAxisTranslate + ", 0)"}
            fill="none"
            color="#C2C2C2"
          />
          {/* axes*/}
          {/* <g ref="xAxis" transform={"translate(0," + xAxisTranslate + ")"} /> */}
          <g ref="yAxis" transform={"translate(" + yAxisTranslate + ", 0)"} />
        </g>
        <path
          d={this.lineGenerator(this.props.dataToDraw)}
          fill="none"
          stroke="#0042FE"
          strokeWidth="2"
        />
      </svg>
    );
  }

  componentDidUpdate() {
    if (this.props.ylim !== this.state.dataDomain) {
      this.setupPlot(this.props.ylim);
      this.setState({ dataDomain: this.props.ylim });
    }
    d3.select(this.refs.yGridLines).call(this.yGridLines);
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  componentDidMount() {
    d3.select(this.refs.yGridLines).call(this.yGridLines);
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  setupPlot(dataDomain) {
    // scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.timeWindow * 1000])
      .range([margin.left, width - margin.right]);
    this.yScale = d3
      .scaleLinear()
      .domain(dataDomain)
      .range([height - margin.bottom, margin.top]);

    // axes and gridlines
    this.xAxis = d3.axisBottom().scale(this.xScale);
    this.yAxis = d3.axisLeft().scale(this.yScale);
    this.yGridLines = d3
      .axisLeft()
      .scale(this.yScale)
      .tickSize(-(width - margin.left - margin.right))
      .tickFormat("");

    // line generator
    this.lineGenerator = d3
      .line()
      .x((d, i) => this.xScale(i * 1000 * this.rate))
      .y(d => this.yScale(d.value))
      .curve(d3.curveLinear);
  }
}

export default LineChart;

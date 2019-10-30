import React, { Component } from "react";
import * as d3 from "d3";

const width = 500;
const height = 300;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class Test extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.timeWindow = 4 * 1000;
    this.ctx = null;
    this.data = new Array(200);
    this.numSamples = this.data.length;
    let ymin = 0;
    let ymax = 512;
    this.yDataRange = ymax - ymin;
    this.colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([0, 100]);

    //method bindings
    this.scaleX = this.scaleX.bind(this);
    this.scaleY = this.scaleY.bind(this);
    this.drawBarChart = this.drawBarChart.bind(this);
    this.update = this.update.bind(this);
    this.generate = this.generate.bind(this);
  }
  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    setInterval(this.update, 30);
    this.forceUpdate();
  }

  update() {
    this.data.push(this.generate());
    this.data.shift();
    this.forceUpdate();
  }

  scaleY(y) {
    return Math.round(height * (y / this.yDataRange));
  }

  scaleX(x) {
    return Math.round(width * (x / this.numSamples));
  }

  generate() {
    return Array.from({ length: 512 }, () => Math.floor(Math.random() * 100));
  }

  drawBarChart() {
    // erase the first column
    this.ctx.clearRect(0, 0, this.scaleX(1), this.canvas.height);
    // get the remaining data
    let oldData = this.ctx.getImageData(
      this.scaleX(1),
      0,
      width - this.scaleX(1),
      height
    );
    // shift and re-draw the last data
    this.ctx.putImageData(oldData, 0, 0);

    // draw the last column
    if (this.data[this.data.length - 1] !== undefined) {
      this.data[this.data.length - 1].forEach((d, i) => {
        this.ctx.fillStyle = this.colorScale(d);
        this.ctx.fillRect(
          this.scaleX(this.numSamples - 1),
          height - this.scaleY(i),
          this.scaleX(1),
          this.scaleY(1)
        );
      });
    }

    // this.data.forEach((colData, i) => {
    //   colData.forEach((value, j) => {
    //     this.ctx.fillStyle = this.colorScale(value);
    //     this.ctx.fillRect(
    //       this.scaleX(i),
    //       height - this.scaleY(j),
    //       this.scaleX(1),
    //       this.scaleY(1)
    //     );
    //   });
    // });
  }

  render() {
    if (this.ctx !== null) {
      this.drawBarChart();
    }
    return (
      <canvas key="main_canvas" ref="canvas" width={width} height={height} />
    );
  }
}

export default Test;

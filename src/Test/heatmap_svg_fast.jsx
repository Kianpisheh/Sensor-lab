import React, { Component } from "react";
import * as d3 from "d3";
import { transform } from "@babel/core";

const width = 900;
const height = 400;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class Test extends Component {
  state = {
    time: 0
  };
  constructor(props) {
    super(props);
    this.data = [220, 50, 4, 100, 17, 89, 34, 354, 67, 34];
    this.data2 = [22, 90, 40, 200, 170];
    this.time = 0;
    this.rects = null;
    this.rects2 = null;
    this.buffer = new Array(40);
    this.update = this.update.bind(this);
    this.updateBufferPosition = this.updateBufferPosition.bind(this);

    setInterval(this.update, 10);
  }

  update() {
    this.time += 20;
    this.setState({ time: this.time });
  }

  updateBufferPosition(buffer) {
    return buffer.map((el, i) => (
      <g key={el.key} transform={"translate(" + (i * 6).toString() + ",0)"}>
        {el.props.children}
      </g>
    ));
  }

  generate() {
    return Array.from({ length: 500 }, () => Math.floor(Math.random() * 500));
  }

  makeRectArray(dataArray) {
    return dataArray.map((d, i) => (
      <rect
        key={this.time.toString() + "_" + i.toString()}
        x={0}
        y={d}
        width={4}
        height={2}
      ></rect>
    ));
  }

  render() {
    let newRects = Array.from({ length: 500 }, () =>
      Math.floor(Math.random() * 500)
    ).map((d, i) => (
      <rect
        key={this.time.toString() + "_" + i.toString()}
        x={0}
        y={d}
        width={4}
        height={2}
      ></rect>
    ));
    this.buffer.push(<g key={this.time}>{newRects}</g>);
    this.buffer.shift();
    // this.buffer = this.updateBufferPosition(this.buffer);
    this.buffer = this.buffer.map((el, i) => (
      <g key={el.key} transform={"translate(" + (i * 6).toString() + ",0)"}>
        {el.props.children}
      </g>
    ));
    return (
      <svg width={width} height={height}>
        {this.buffer}
      </svg>
    );
  }
}

export default Test;

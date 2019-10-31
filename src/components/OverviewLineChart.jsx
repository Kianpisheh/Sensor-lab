import React, { Component } from "react";

const width = 900;
const height = 150;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

class OverviewLineChart extends Component {
  // access the canvas

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
          ref={"canvasRef"}
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
          ref={"canvasRef"}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

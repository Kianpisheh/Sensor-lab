import React from "react";
import Chart from "../components/chart";

function VisualizationCanvas(props) {
  if (props.data === null) {
    return null;
  }
  return props.drawingRequests.map((drawingRequest, i) => (
    <Chart
      key={drawingRequest.id}
      idx={i}
      drawingRequest={drawingRequest}
      data={props.data[drawingRequest.id]}
    ></Chart>
  ));
}

export default VisualizationCanvas;

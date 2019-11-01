import React, { useContext } from "react";
import Chart from "../components/chart";
import AppConstext from "../AppContext";

var height = 250;
function VisualizationCanvas(props) {
  const context = useContext(AppConstext);

  if (props.data === null) {
    return null;
  }

  return context.drawingRequestsList.map((drawingRequest, i) => (
    <Chart
      key={drawingRequest.id}
      idx={i}
      drawingRequest={drawingRequest}
      data={props.data[drawingRequest.id]}
    ></Chart>
  ));
}

export default VisualizationCanvas;

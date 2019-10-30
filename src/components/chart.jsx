import React from "react";
import LineChart from "../components/lineChart";
import Heatmap from "../components/heatmap";
import AppContext from "../AppContext";
import { LineChartOverview } from "../components/lineChartOverview";
import LineChartCanvas from "./lineChartCanvas";

function Chart(props) {
  let { drawingRequest, data } = props;
  let chart = null;
  if (drawingRequest.type === "line_chart") {
    chart = (
      <AppContext.Consumer>
        {() => (
          <div>
            <LineChartCanvas key={props.id} data={data} idx={props.idx} />
          </div>
        )}
      </AppContext.Consumer>
    );
  } else if (drawingRequest.type === "heatmap") {
    chart = (
      <AppContext.Consumer>
        {props => (
          <Heatmap
            key={props.id}
            dataToDraw={drawingRequest.buffer}
            ylim={drawingRequest.featureRange}
            numFeatures={drawingRequest.buffer[0].value.length}
          />
        )}
      </AppContext.Consumer>
    );
  }

  return chart;
}

export default Chart;

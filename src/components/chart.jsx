import React from "react";
import Heatmap from "../components/heatmap";
import AppContext from "../AppContext";
import OverviewLineChart from "../components/OverviewLineChart";
import LineChartCanvas from "./lineChartCanvas";

var height = 250;
var overviewHeight = 150;

function Chart(props) {
  let { drawingRequest, data } = props;
  let chart = null;
  if (drawingRequest.type === "line_chart") {
    chart = (
      <AppContext.Consumer>
        {() => (
          <div id="linechart_pairs">
            <LineChartCanvas
              key={props.id}
              data={data}
              idx={props.idx}
              oh={overviewHeight}
            />
            <OverviewLineChart
              key={props.id}
              idx={props.idx}
              drawingRequest={props.drawingRequest}
              hp={height}
            ></OverviewLineChart>
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

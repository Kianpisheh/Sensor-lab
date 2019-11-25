import React from "react";
import LineChartCanvas from "./lineChartCanvas";
import Heatmap from "./heatmap";
import VisPanelContext from "./VisPanelContext";
import OverviewLineChart from "./OverviewLineChart";

var overviewHeight = 150;
var height = 250;

export const ChartCanvas = props => {
  const { type, id, sensor, feature } = props.drawingRequest;
  const { dataToDraw, dataRange } = React.useContext(VisPanelContext);

  // get current timestamp
  let currentTime = 0;
  if (dataToDraw !== null) {
    currentTime = dataToDraw.timestamp;
  }

  // create charts
  let chart = null;
  if (type === "line_chart") {
    chart = (
      <VisPanelContext.Consumer>
        {() => (
          <React.Fragment>
            <LineChartCanvas
              dataToDraw={dataToDraw}
              dataRange={dataRange[sensor][feature]}
              key={id}
              reqId={id}
              oh={overviewHeight}
            ></LineChartCanvas>
            <OverviewLineChart
              key={props.id}
              idx={props.idx}
              currentTime={currentTime}
              dataRange={dataRange[sensor][feature]}
              drawingRequest={props.drawingRequest}
              hp={height}
            ></OverviewLineChart>
          </React.Fragment>
        )}
      </VisPanelContext.Consumer>
    );
  } else if (type === "heatmap") {
    chart = (
      <Heatmap
        key={id}
        dataToDraw={dataToDraw}
        // ylim={drawingRequest.featureRange}
      ></Heatmap>
    );
  }
  return <div className="chart_canvas_container">{chart}</div>;
};

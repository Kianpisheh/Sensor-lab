import React from "react";
import LineChartCanvas from "./lineChartCanvas";
import Heatmap from "./heatmap";
import VisPanelContext from "./VisPanelContext";

var overviewHeight = 150;

export const ChartCanvas = props => {
  const { type, id, sensor, feature } = props.drawingRequest;
  const { dataToDraw, dataRange } = React.useContext(VisPanelContext);
  // determine the chart type
  let chart = null;
  if (type === "line_chart") {
    chart = (
      <VisPanelContext.Consumer>
        {() => (
          <LineChartCanvas
            dataToDraw={dataToDraw}
            dataRange={dataRange[sensor][feature]}
            key={id}
            reqId={id}
            oh={overviewHeight}
          ></LineChartCanvas>
        )}
      </VisPanelContext.Consumer>
    );
  } else if (type === "heatmap") {
    chart = <Heatmap></Heatmap>;
  }
  return <div className="chart_canvas_container">{chart}</div>;
};

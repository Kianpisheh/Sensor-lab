import React from "react";
import { ChartCanvas } from "./ChartCanvas";
import { ChartPropTab } from "./ChartPropTab";
import { OverviewChartPropTab } from "./OverviewChartPropTab";

function ChartPanel(props) {
  return (
    <div className="chartpanel_container">
      <ChartPropTab
        drawingRequest={props.drawingRequest}
        sensorsFeatureList={props.sensorsFeatureList}
        onFeatureSelectorChanged={props.onFeatureSelectorChanged}
        onActCheckboxClicked={props.onActivityVisClicked}
      ></ChartPropTab>
      <ChartCanvas
        className="chart_canvas"
        drawingRequest={props.drawingRequest}
      ></ChartCanvas>
      <OverviewChartPropTab
        drawingRequest={props.drawingRequest}
        onOverviewSettingsChange={props.onOverviewSettingsChange}
      ></OverviewChartPropTab>
    </div>
  );
}

export default ChartPanel;

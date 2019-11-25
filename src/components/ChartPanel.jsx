import React from "react";
import Select from "react-select";
import { ChartCanvas } from "./ChartCanvas";
import NumericInput from "react-numeric-input";
import NativeSelect from "@material-ui/core/NativeSelect";

function ChartPanel(props) {
  const { sensor, feature, id } = props.drawingRequest;

  // get sensor list
  let sensorList = Object.keys(props.sensorsFeatureList);

  // get feature list
  let featureList = props.sensorsFeatureList[sensor];

  return (
    <div className="chartpanel_container">
      <div className="chart_prop_tab">
        <NativeSelect
          key={id + "sensor"}
          className="select"
          value={props.sensor}
          onChange={event => {
            props.onFeatureSelectorChanged(event.target.value, id, true);
          }}
        >
          {sensorList.map(sensor => (
            <option key={sensor + id} value={sensor}>
              {sensor}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          key={id + "feature"}
          className="select"
          value={props.feature}
          onChange={event => {
            props.onFeatureSelectorChanged(event.target.value, id, false);
          }}
        >
          {featureList.map(feature => (
            <option key={feature + id} value={feature}>
              {feature}
            </option>
          ))}
        </NativeSelect>
      </div>
      <ChartCanvas
        className="chart_canvas"
        drawingRequest={props.drawingRequest}
      ></ChartCanvas>
    </div>
  );
}

export default ChartPanel;

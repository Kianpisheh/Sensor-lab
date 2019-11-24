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
        {/* <Select
          className="select"
          defaultValue={sensorList[0]}
          value={{ value: sensor, label: sensor }}
          name="color"
          options={sensorList}
          onChange={event => {
            props.onFeatureSelectorChanged(event.value, id, true);
          }}
        />
        <Select
          className="select"
          defaultValue={featureList[0]}
          value={{ value: feature, label: feature }}
          name="color"
          options={featureList}
          onChange={event => {
            props.onFeatureSelectorChanged(event.value, id, false);
          }}
        /> */}
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
        <NumericInput className="numper_input" min={0} max={100} value={50} />
      </div>
      <ChartCanvas
        className="chart_canvas"
        drawingRequest={props.drawingRequest}
      ></ChartCanvas>
    </div>
  );
}

export default ChartPanel;

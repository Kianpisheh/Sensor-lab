import React from "react";
import NativeSelect from "@material-ui/core/NativeSelect";

export const ChartPropTab = props => {
  const { sensor, id } = props.drawingRequest;

  // get sensor and feature lists
  let sensorList = Object.keys(props.sensorsFeatureList);
  let featureList = props.sensorsFeatureList[sensor];

  return (
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
  );
};

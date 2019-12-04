import React, { useContext } from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import VisPanelContext from "./VisPanelContext";

export const ChartPropTab = props => {
  const { sensor, id } = props.drawingRequest;

  const context = useContext(VisPanelContext);

  // get sensor and feature lists
  let sensorList = Object.keys(props.sensorsFeatureList);
  let featureList = props.sensorsFeatureList[sensor];

  return (
    <div className="chart_prop_tab">
      <NativeSelect
        key={id + "sensor"}
        className="chart_prop_item"
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
        className="chart_prop_item"
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
      <FormControlLabel
        className="chart_prop_item"
        control={
          <Checkbox
            checked={context.watchMovement}
            onChange={event => {
              props.onActCheckboxClicked(event.target.checked, id);
            }}
          />
        }
        label="Watch"
      />
    </div>
  );
};

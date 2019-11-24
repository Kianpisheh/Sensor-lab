import React from "react";
import Select from "react-select";
import { ChartCanvas } from "./ChartCanvas";

function ChartPanel(props) {
  const { sensor, feature, id } = props.drawingRequest;

  // get sensor list
  let sensorList = Object.keys(props.sensorsFeatureList);
  sensorList = sensorList.map(element => {
    var sensor = { value: element, label: element };
    return sensor;
  });

  // get feature list
  let featureList = props.sensorsFeatureList[sensor];
  featureList = featureList.map(el => {
    let feature = { value: el, label: el };
    return feature;
  });

  return (
    <div className="chartpanel_container">
      <div className="chart_prop_tab">
        <Select
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
        />
      </div>
      <ChartCanvas
        className="chart_canvas"
        drawingRequest={props.drawingRequest}
      ></ChartCanvas>
    </div>
  );
}

export default ChartPanel;

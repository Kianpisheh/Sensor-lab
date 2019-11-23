import React from "react";
import Select from "react-select";

function ChartPanel(props) {
  // get sensor list
  let sensorList = Object.keys(props.sensorsFeatureList);
  sensorList = sensorList.map(element => {
    var sensor = { value: element, label: element };
    return sensor;
  });

  // get feature list
  let featureList = props.sensorsFeatureList[props.sensor];
  featureList = featureList.map(el => {
    let feature = { value: el, label: el };
    return feature;
  });

  return (
    <div className="chartpanel_container">
      <Select
        className="sensor-select"
        classNamePrefix="select"
        defaultValue={sensorList[0]}
        value={{ value: props.sensor, label: props.sensor }}
        name="color"
        options={sensorList}
        onChange={event => {
          props.onFeatureSelectorChanged(event.value, props.id, true);
        }}
      />
      <Select
        className="feature-select"
        classNamePrefix="feature"
        defaultValue={featureList[0]}
        value={{ value: props.feature, label: props.feature }}
        name="color"
        options={featureList}
        onChange={event => {
          props.onFeatureSelectorChanged(event.value, props.id, false);
        }}
      />
    </div>
  );
}

export default ChartPanel;

import React from "react";
import AppContext from "../AppContext";

function FeatureSelection(props) {
  return (
    <AppContext.Consumer key={"f1"}>
      {function(context) {
        return (
          <div>
            {renderTitle(context.drawingRequestsList)}
            {context.drawingRequestsList.map(req => (
              <div id={"sensor_selector_div"} key={"selectors_div" + req.id}>
                <SensorSelector
                  key={req.id + "sensor"}
                  id={req.id}
                  sensor={req.sensor}
                  onSelectorChanged={props.onFeatureSelectorChanged}
                  sensorFeatureList={props.sensorFeatureList}
                ></SensorSelector>
                <FeatureSelector
                  key={req.id + "feature"}
                  id={req.id}
                  sensor={req.sensor}
                  sensorFeatureList={props.sensorFeatureList}
                  onSelectorChanged={props.onFeatureSelectorChanged}
                ></FeatureSelector>
                <button
                  id={req.id}
                  key={"remove_" + req.id}
                  onClick={() => props.onRemoveButtonClicked(req.id)}
                >
                  {"-"}
                </button>
                <button
                  id={"add_" + req.id}
                  key={"add_" + req.id}
                  onClick={() => props.onAddButtonClicked(req.id)}
                >
                  {"+"}
                </button>
              </div>
            ))}
          </div>
        );
      }}
    </AppContext.Consumer>
  );
}

function renderTitle(drawingRequests) {
  let title = "";
  if (drawingRequests.length > 0) {
    title = <h4 style={{ textAlign: "center" }}>Select features</h4>;
  }
  return title;
}

function SensorSelector(props) {
  return (
    <select
      className="sensor_selectors"
      key={props.sesnor + props.id}
      value={props.sensor}
      onChange={event => {
        props.onSelectorChanged(event.target.value, props.id, true);
      }}
    >
      {Object.keys(props.sensorFeatureList).map(sensor => (
        <option key={sensor + props.id} id={props.id}>
          {sensor}
        </option>
      ))}
    </select>
  );
}

function FeatureSelector(props) {
  return (
    <select
      className="feature_selectors"
      key={props.feature + props.id}
      name="features_select"
      value={props.feature}
      onChange={event => {
        props.onSelectorChanged(event.target.value, props.id, false);
      }}
    >
      {props.sensorFeatureList[props.sensor].map(feature => (
        <option key={feature + props.id} id={props.id}>
          {feature}
        </option>
      ))}
    </select>
  );
}

export default FeatureSelection;

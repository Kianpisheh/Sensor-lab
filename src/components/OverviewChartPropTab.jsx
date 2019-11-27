import React, { useState, useContext } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import VisPanelContext from "./VisPanelContext";

export const OverviewChartPropTab = props => {
  // get the data duration
  const { sensor, feature, audioSR } = props.drawingRequest;
  const { dataBatch } = useContext(VisPanelContext);
  let duration = 1; // minutes
  if (sensor === "audio" && feature.split("_")[0] === "raw") {
    const data = dataBatch[sensor][feature];
    duration = Math.ceil(Math.floor(data.length / audioSR) / 60);
  } else {
    const timestamps = dataBatch[sensor]["timestamp"];
    duration =
      (timestamps[timestamps.length - 2] - timestamps[0]) / (60 * 1000);
  }

  const [minVal, setMinVal] = useState(0); // minutes
  const [maxVal, setMaxVal] = useState(duration); // minutes

  return (
    <div className="overview-tab-container">
      <InputRange
        style={{ color: "black" }}
        draggableTrack
        formatLabel={value => `${value.toFixed(2)}`}
        step={duration / 100}
        maxValue={duration}
        minValue={0}
        value={{ min: minVal, max: maxVal }}
        onChange={value => {
          setMaxVal(value.max);
          setMinVal(value.min);
        }}
        onChangeComplete={value => {
          console.log("change completed");
          setMinVal(value.min);
          props.onOverviewSettingsChange([value.min, value.max - value.min]);
          setMaxVal(value.max);
        }}
      />
    </div>
  );
};

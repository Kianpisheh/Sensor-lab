import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

export const OverviewChartPropTab = props => {
  const [minVal, setMinVal] = useState(1); // minutes
  const [maxVal, setMaxVal] = useState(8); // minutes
  return (
    <div className="overview-tab-container">
      <InputRange
        style={{ color: "black" }}
        draggableTrack
        maxValue={80}
        minValue={1}
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

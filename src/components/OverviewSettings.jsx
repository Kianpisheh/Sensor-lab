import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import AppConstext from "../AppContext";

export default function OverviewSettings(props) {
  if (!props.isDataLoaded) {
    return null;
  }
  return (
    <div id="overview_sliders_div">
      <TimeWindowSlider
        id="overview_time_window_slider"
        onOverviewSettingsChange={props.onOverviewSettingsChange}
      ></TimeWindowSlider>
      <TimeSlider
        id="overview_time_slider"
        onOverviewSettingsChange={props.onOverviewSettingsChange}
      ></TimeSlider>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: 150
  },
  margin: {
    height: theme.spacing(5)
  }
}));

function TimeWindowSlider(props) {
  const classes = useStyles();

  const context = useContext(AppConstext);

  return (
    <div className={classes.root}>
      <Typography gutterBottom style={{ fontSize: "14px" }}>
        Overview duration
      </Typography>
      <Slider
        defaultValue={Math.floor(context.overviewTimeWindow / 60)}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={90}
        onChangeCommitted={(event, value) =>
          props.onOverviewSettingsChange("overview_time_window", value)
        }
      />
    </div>
  );
}

function TimeSlider(props) {
  const classes = useStyles();

  const context = useContext(AppConstext);

  return (
    <div className={classes.root}>
      <Typography gutterBottom style={{ fontSize: "14px" }}>
        Time
      </Typography>
      <Slider
        defaultValue={Math.floor(context.overviewTimeWindow / 60)}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={90}
        onChange={(event, value) =>
          props.onOverviewSettingsChange("overview_time", value)
        }
      />
    </div>
  );
}

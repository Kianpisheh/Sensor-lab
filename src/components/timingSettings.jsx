import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import AppConstext from "../AppContext";

export default function TimingSettings(props) {
  if (!props.isDataLoaded) {
    return null;
  }
  return (
    <DiscreteSlider
      id="overview_time_window_slider"
      onNewValue={props.onTimeSettingsChange}
    ></DiscreteSlider>
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

function DiscreteSlider(props) {
  const classes = useStyles();

  const context = useContext(AppConstext);

  return (
    <div className={classes.root}>
      <Typography
        id="discrete-slider"
        gutterBottom
        style={{ fontSize: "14px" }}
      >
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
          props.onNewValue("overview_time_window", value)
        }
      />
    </div>
  );
}

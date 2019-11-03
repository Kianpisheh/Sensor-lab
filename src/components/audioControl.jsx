import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

export default function(props) {
  let buttonIcon = null;
  if (props.isAudioPlaying) {
    // setp the play button
    buttonIcon = (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  } else {
    buttonIcon = (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
  let playButton = (
    <button
      onClick={() => props.eventHandler("play_button_clicked")}
      style={{
        backgroundColor: "transparent",
        outline: "none",
        border: "none"
      }}
    >
      {buttonIcon}
    </button>
  );

  // setup the slider
  let value = 0;
  let max = 0;
  if (props.audio !== null && props.audio !== undefined) {
    value = Math.floor(props.audio.currentTime);
    max = props.audio.duration;
  }

  return (
    <div style={{ display: "flex", marginLeft: "10px" }}>
      {playButton}
      <Slider
        style={{ width: "180px", marginLeft: "10px", color: "black" }}
        defaultValue={0}
        onDrag={() => console.log("a")}
        onDragEnter={() => console.log("e")}
        onDragStart={() => console.log("s")}
        value={value}
        aria-labelledby="discrete-slider"
        step={1}
        min={0}
        max={max}
        onChangeCommitted={(event, value) =>
          props.eventHandler("time_changed_by_user", value)
        }
      />
      <span style={{ marginLeft: "10px", fontSize: "11px" }}>
        {formatTime(value)}
      </span>
    </div>
  );
}

// time in second --> 13:02
function formatTime(time) {
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = "0" + seconds.toString();
  }
  let minutes = Math.floor(time / 60);
  if (minutes < 10) {
    minutes = "0" + minutes.toString();
  }
  let hours = Math.floor(time / 3600);
  return hours.toString() + ":" + minutes + ":" + seconds;
}

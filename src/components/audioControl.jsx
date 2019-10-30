import React, { Component } from "react";
import Clock from "../Clock";
import AppContext from "../AppContext";

class AudioControl extends Component {
  static contextType = AppContext;

  constructor(props, context) {
    super(props);
    this.audio = null;
    this.clock = new Clock(context.rate, this.props.onNextTimestamp);

    // bind methods to the class
    this.onAudioPaused = this.onAudioPaused.bind(this);
    this.onAudioPlayed = this.onAudioPlayed.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onSeeked = this.onSeeked.bind(this);
  }

  render() {
    if (this.props.source === null) {
      return null;
    }

    if (this.props.isAudioLoaded) {
      this.audio = (
        <audio
          ref={ref => (this.audio = ref)}
          onPlay={this.onAudioPlayed}
          onPause={this.onAudioPaused}
          onSeeked={this.onSeeked}
          onTimeUpdate={this.onTimeUpdate}
          controls
          src={this.props.source}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      );
    }

    return (
      <div>
        <h4 style={{ textAlign: "center" }}>Audio</h4>
        <figure>{this.audio}</figure>
      </div>
    );
  }

  // event handlers
  onAudioPlayed() {
    this.clock.setAudio(this.audio);
    this.clock.start(this.audio); // the clock time gets synced with the audio
  }

  onAudioPaused() {
    this.clock.pause();
  }

  onTimeUpdate() {
    this.clock.setTime(this.audio.currentTime);
  }

  onSeeked() {
    this.clock.setTime(this.audio.currentTime);
    this.props.onSeeked(this.clock.time);
  }
}

export default AudioControl;

import React, { Component } from "react";

class Controller extends Component {
  render() {
    let btnLabel = "Start";
    if (this.props.isPlaying) {
      btnLabel = "Stop";
    }
    return (
      <React.Fragment>
        <h4 style={{ textAlign: "center" }}>Draw</h4>
        <div id="controller_btns">
          <button key="play_btn" onClick={this.props.onPlayButtonClicked}>
            {btnLabel}
          </button>
          <button key="reset_btn" onClick={this.props.onResetButtonClicked}>
            {"Reset"}
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Controller;

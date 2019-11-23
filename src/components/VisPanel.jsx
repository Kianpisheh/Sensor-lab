import React, { Component } from "react";
import DropUploader from "./DropUploader";
import DataManager from "../DataManager";
import DrawingRequestManager from "../DrawingRequestManager";
import ChartPanel from "./ChartPanel";
import VisPanelContext from "./VisPanelContext";

class VisPanel extends Component {
  state = {
    isAudioLoaded: false,
    rate: 0.03,
    isPlaying: false,
    timeWindow: 10, // seconds
    overviewTimeWindow: 800, // seconds
    overviewCurrTime: 0,
    samplingTolerence: 0.3,
    drawingRequestsList: [],
    isDataLoaded: false,
    dataToDraw: null,
    audioSR: null,
    dataBatch: null
  };

  constructor(props) {
    super(props);
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
    this.dataManager = new DataManager(this.handleDataLoaded);
    this.onFeatureSelectorChanged = this.onFeatureSelectorChanged.bind(this);
  }

  // data import event handlers
  handleDataLoaded() {
    // create the default drawing request
    const initialDrawingRequest = [];
    initialDrawingRequest.push(
      DrawingRequestManager.createInitialDrawingRequest(this.dataManager.data)
    );
    this.audio = this.dataManager.audio;
    this.setState({
      drawingRequestsList: initialDrawingRequest,
      isAudioLoaded: true,
      dataBatch: this.dataManager.data,
      audioSR: this.dataManager.audioSampleRate,
      isDataLoaded: true
    });
  }

  // feature selection event handlers
  onFeatureSelectorChanged(value, id, sensorChanged) {
    console.log(value);
    console.log(id);
    const newDrawingRequestList = DrawingRequestManager.updateDrawingRequest(
      this.state.drawingRequestsList,
      value,
      id,
      sensorChanged
    );

    this.setState({ drawingRequestsList: newDrawingRequestList });
  }

  render() {
    let view = (
      <DropUploader onInputDataRequest={this.dataManager.load}></DropUploader>
    );
    if (this.state.isDataLoaded) {
      view = this.state.drawingRequestsList.map(req => (
        <ChartPanel
          key={req.id}
          id={req.id}
          sensor={req.sensor}
          feature={req.feature}
          sensorsFeatureList={DrawingRequestManager.sensorFeatureList}
          onFeatureSelectorChanged={this.onFeatureSelectorChanged}
        ></ChartPanel>
      ));
    }
    return (
      <VisPanelContext.Provider>
        <div className="vis_panel_container">{view}</div>
      </VisPanelContext.Provider>
    );
  }
}

export default VisPanel;

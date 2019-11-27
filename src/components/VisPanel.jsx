import React, { Component } from "react";

import DropUploader from "./DropUploader";
import DataManager from "../DataManager";
import DrawingRequestManager from "../DrawingRequestManager";
import ChartPanel from "./ChartPanel";
import VisPanelContext from "./VisPanelContext";
import Clock from "../Clock";
import Controller from "./Controller";

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
    dataBatch: null,
    dataRange: null
  };

  constructor(props) {
    super(props);
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
    this.handleAudioEvent = this.handleAudioEvent.bind(this);
    this.onFeatureSelectorChanged = this.onFeatureSelectorChanged.bind(this);
    this.onNextTimestamp = this.onNextTimestamp.bind(this);
    this.onOverviewSettingsChange = this.onOverviewSettingsChange.bind(this);

    this.drawingRequestManager = new DrawingRequestManager();
    this.dataManager = new DataManager(this.handleDataLoaded);
    this.clock = new Clock(this.state.rate, this.onNextTimestamp);
  }

  handleAudioEvent(eventType, value) {
    switch (eventType) {
      case "play_button_clicked":
        if (this.state.isPlaying) {
          if (this.audio !== null) {
            this.audio.pause();
          }
          this.clock.pause();
          this.setState({ isPlaying: false });
        } else {
          this.clock.setAudio(this.audio);
          this.clock.start();
          if (this.audio !== null) {
            this.audio.play();
          }
          this.setState({ isPlaying: true });
        }
        break;
      case "time_updated":
        this.clock.setTime(value);
        break;
      case "time_changed_by_user":
        if (this.audio !== null) {
          this.audio.currentTime = value;
        } else {
          this.clock.time = value * 1000;
        }
        const drawingRequestsList = this.drawingRequestManager.resetIndex(
          this.state.drawingRequestsList
        );
        this.setState({ drawingRequestsList });
        break;
      default:
        console.log("no matched event to handle");
    }
  }

  // data import event handlers
  handleDataLoaded() {
    // create the default drawing request
    const initialDrawingRequest = [];
    initialDrawingRequest.push(
      this.drawingRequestManager.createInitialDrawingRequest(
        this.dataManager.data
      )
    );
    this.audio = this.dataManager.audio;
    let dataRange = this.dataManager.calcDataRange(
      this.drawingRequestManager.sensorFeatureList
    );
    console.log(this.dataManager.data);
    this.setState({
      drawingRequestsList: initialDrawingRequest,
      isAudioLoaded: true,
      dataBatch: this.dataManager.data,
      dataRange: dataRange,
      audioSR: this.dataManager.audioSampleRate,
      isDataLoaded: true
    });
  }

  onOverviewSettingsChange(values) {
    // values are in minutes
    const [start, duration] = values;
    this.setState({
      overviewTimeWindow: duration * 60,
      overviewCurrTime: start
    });
  }

  onNextTimestamp(timestamp) {
    // get the new data points
    const [newSamples, newIndeces] = this.dataManager.getSample(
      this.state.drawingRequestsList,
      timestamp,
      this.state.samplingTolerence
    );
    const updatedDrawingRequest = this.drawingRequestManager.updateIndeces(
      this.state.drawingRequestsList,
      newIndeces
    );

    this.setState({
      drawingRequestsList: updatedDrawingRequest,
      dataToDraw: newSamples
    });
  }

  // feature selection event handlers
  onFeatureSelectorChanged(value, id, sensorChanged) {
    const newDrawingRequestList = this.drawingRequestManager.updateDrawingRequest(
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
        <React.Fragment key={req.id + "frag"}>
          <ChartPanel
            key={req.id + "chart_panel" + this.props.v}
            drawingRequest={req}
            sensorsFeatureList={this.drawingRequestManager.sensorFeatureList}
            onFeatureSelectorChanged={this.onFeatureSelectorChanged}
            onOverviewSettingsChange={this.onOverviewSettingsChange}
          ></ChartPanel>
          <Controller
            key={req.id + "controller" + this.props.v}
            audio={this.audio}
            clockTime={Math.floor(this.clock.time / 1000)}
            isAudioPlaying={this.state.isPlaying}
            eventHandler={this.handleAudioEvent}
          ></Controller>
        </React.Fragment>
      ));
    }
    return (
      <VisPanelContext.Provider value={this.state}>
        <div className="vis_panel_container">{view}</div>
      </VisPanelContext.Provider>
    );
  }
}

export default VisPanel;

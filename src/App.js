import React, { Component } from "react";
import "./App.css";
import DataImport from "./components/dataImport";
import FeatureSelection from "./components/featureSelection";
import DataManager from "./DataManager";
import VisualizationCanvas from "./components/visualizationCanvas";
import Clock from "./Clock";
import AppConstext from "./AppContext";
import AudioControl from "./components/audioControl";
import DrawingRequestManager from "./DrawingRequestManager";
import OverviewSettings from "./components/OverviewSettings";

class App extends Component {
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
    this.audio = null;

    this.numSamples = Math.floor(this.state.timeWindow / this.state.rate);

    // method bindings
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
    this.onFeatureSelectorChanged = this.onFeatureSelectorChanged.bind(this);
    this.onNextTimestamp = this.onNextTimestamp.bind(this);
    this.onAddButtonClicked = this.onAddButtonClicked.bind(this);
    this.onRemoveButtonClicked = this.onRemoveButtonClicked.bind(this);
    this.onOverviewSettingsChange = this.onOverviewSettingsChange.bind(this);
    this.handleAudioEvent = this.handleAudioEvent.bind(this);

    this.dataManager = new DataManager(this.handleDataLoaded);
    this.clock = new Clock(this.state.rate, this.onNextTimestamp);
  }

  // data import event handlers
  handleDataLoaded() {
    // create the default drawing request
    const initialDrawingRequest = [];
    initialDrawingRequest.push(
      DrawingRequestManager.createInitialDrawingRequest(this.dataManager.data)
    );
    console.log(this.dataManager.data);
    this.audio = this.dataManager.audio;
    this.setState({
      drawingRequestsList: initialDrawingRequest,
      isAudioLoaded: true,
      dataBatch: this.dataManager.data,
      audioSR: this.dataManager.audioSampleRate,
      isDataLoaded: true
    });
  }

  setAudio(source) {
    return (
      <audio
        ref={ref => (this.audio = ref)}
        onPlay={this.handleAudioEvent("audio_played", null)}
        onPause={this.handleAudioEvent("audio_paused", null)}
        onSeeked={() => this.handleAudioEvent("seeked", this.audio.currentTime)}
        onTimeUpdate={() =>
          this.handleAudioEvent("time_updated", this.audio.currentTime)
        }
        controls
        src={source}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    );
  }

  // feature selection event handlers
  onFeatureSelectorChanged(value, id, sensorChanged) {
    const newDrawingRequestList = DrawingRequestManager.updateDrawingRequest(
      this.state.drawingRequestsList,
      value,
      id,
      sensorChanged
    );

    this.setState({ drawingRequestsList: newDrawingRequestList });
  }

  onAddButtonClicked(topId) {
    const updatedDrawingRequest = DrawingRequestManager.createNewDrawingRequest(
      this.state.drawingRequestsList,
      topId
    );
    this.setState({
      drawingRequestsList: updatedDrawingRequest
    });
  }

  onRemoveButtonClicked(id) {
    const updatedDrawingRequest = DrawingRequestManager.removeDrawingRequest(
      this.state.drawingRequestsList,
      id
    );
    this.setState({ drawingRequestsList: updatedDrawingRequest });
  }

  onNextTimestamp(timestamp) {
    // get the new data points
    const [newSamples, newIndeces] = this.dataManager.getSample(
      this.state.drawingRequestsList,
      timestamp,
      this.state.samplingTolerence
    );
    const updatedDrawingRequest = DrawingRequestManager.updateIndeces(
      this.state.drawingRequestsList,
      newIndeces
    );

    this.setState({
      drawingRequestsList: updatedDrawingRequest,
      dataToDraw: newSamples
    });
  }

  onOverviewSettingsChange(parameter, value) {
    // value is in minutes
    if (parameter === "overview_time_window") {
      this.setState({ overviewTimeWindow: value * 60 });
    } else if (parameter === "overview_time") {
      this.setState({ overviewCurrTime: value });
    }
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
          console.log(value);
        } else {
          console.log(value);
          this.clock.time = value * 1000;
        }
        const drawingRequestsList = DrawingRequestManager.resetIndex(
          this.state.drawingRequestsList
        );
        this.setState({ drawingRequestsList });
        break;
      default:
        console.log("no matched event to handle");
    }
  }

  render() {
    return (
      <AppConstext.Provider value={this.state}>
        <div id="root">
          {/*The left pane*/}
          <div id="left_pane" style={{ position: "relative" }}>
            <DataImport onInputDataRequest={this.dataManager.load} />
            <FeatureSelection
              sensorFeatureList={DrawingRequestManager.sensorFeatureList}
              onFeatureSelectorChanged={this.onFeatureSelectorChanged}
              onAddButtonClicked={this.onAddButtonClicked}
              onRemoveButtonClicked={this.onRemoveButtonClicked}
            />
            <OverviewSettings
              isDataLoaded={this.state.isDataLoaded}
              onOverviewSettingsChange={this.onOverviewSettingsChange}
            ></OverviewSettings>
            <AudioControl
              audio={this.audio}
              clockTime={Math.floor(this.clock.time / 1000)}
              isAudioPlaying={this.state.isPlaying}
              eventHandler={this.handleAudioEvent}
            ></AudioControl>
          </div>
          {/*The right pane*/}
          <div id="right_pane">
            <VisualizationCanvas id={"vis"} data={this.state.dataToDraw} />
          </div>
        </div>
      </AppConstext.Provider>
    );
  }
}

export default App;

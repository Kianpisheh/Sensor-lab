import React, { Component } from "react";
import "./App.css";
import DataImport from "./components/dataImport";
import FeatureSelection from "./components/featureSelection";
import DataManager from "./DataManager";
import DrawingManager from "./DrawingManager";
import VisualizationCanvas from "./components/visualizationCanvas";
import Clock from "./Clock";
import AppConstext from "./AppContext";
import AudioControl from "./components/audioControl";
import DrawingRequestManager from "./DrawingRequestManager";

class App extends Component {
  state = {
    isAudioLoaded: false,
    rate: 0.03,
    timeWindow: 10,
    samplingTolerence: 0.3,
    drawingRequestsList: [],
    dataToDraw: null,
    dataBatch: null
  };
  constructor(props) {
    super(props);

    this.numSamples = Math.floor(this.state.timeWindow / this.state.rate);

    // method bindings
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
    this.onFeatureSelectorChanged = this.onFeatureSelectorChanged.bind(this);
    this.onNextTimestamp = this.onNextTimestamp.bind(this);
    this.onAddButtonClicked = this.onAddButtonClicked.bind(this);
    this.onRemoveButtonClicked = this.onRemoveButtonClicked.bind(this);
    this.onTimeChangedByUser = this.onTimeChangedByUser.bind(this);

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
    this.setState({
      drawingRequestsList: initialDrawingRequest,
      isAudioLoaded: true,
      dataBatch: this.dataManager.data
    });
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

    console.log(newSamples);

    this.setState({
      drawingRequestsList: updatedDrawingRequest,
      dataToDraw: newSamples
    });
  }

  onTimeChangedByUser(timestamp) {
    const drawingRequestsList = DrawingRequestManager.resetIndex(
      this.state.drawingRequestsList
    );
    this.setState({ drawingRequestsList });
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
            <AudioControl
              source={this.dataManager.audioURL}
              isAudioLoaded={this.state.isAudioLoaded}
              onNextTimestamp={this.onNextTimestamp}
              onSeeked={this.onTimeChangedByUser}
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

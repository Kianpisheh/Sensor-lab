import { createContext } from "react";

const VisPanelContext = createContext({
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
});

export default VisPanelContext;

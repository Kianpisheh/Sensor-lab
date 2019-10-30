import { createContext } from "react";

const AppConstext = createContext({
  rate: 0.03,
  timeWindow: 10,
  isAudioLoaded: false,
  samplingTolerence: 0.3,
  onFeatureSelectorChanged: null
});

export default AppConstext;

import React, { Component } from "react";
import VisPanel from "./components/VisPanel";

import "./App2.css";

class App2 extends Component {
  render() {
    return (
      <div id="app_container">
        <VisPanel id="1"></VisPanel>
        <VisPanel id="2"></VisPanel>
      </div>
    );
  }
}

export default App2;

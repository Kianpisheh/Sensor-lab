import React, { Component } from "react";
import VisPanel from "./components/VisPanel";

import "./App2.css";

class App2 extends Component {
  render() {
    return (
      <div id="app_container">
        <VisPanel v={"1"} key={"1"} id="1"></VisPanel>
        <VisPanel v={"2"} key={"2"} id="2"></VisPanel>
      </div>
    );
  }
}

export default App2;

import React from "react";

function DataImport(props) {
  return (
    <React.Fragment>
      <h4 style={{ textAlign: "center" }}>Select data</h4>
      <input
        multiple={true}
        type="file"
        id="input_file_path"
        name="file_input"
        accept=".csv, .txt, .wav"
        onChange={e => props.onInputDataRequest(e.target.files)}
        style={{ padding: "20px 10px" }}
      ></input>
    </React.Fragment>
  );
}

export default DataImport;

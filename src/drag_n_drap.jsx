import React from "react";
import Dropzone from "react-dropzone";

function Basic(props) {
  return (
    <div className="text-center mt-5">
      <Dropzone onDrop={console.log("file droped")}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            Click me to upload a file!
          </div>
        )}
      </Dropzone>
    </div>
  );
}

export default Basic;

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function DropUploader(props) {
  const onDrop = useCallback(acceptedFiles => {
    props.onInputDataRequest(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        height: "200px",
        textAlign: "center",
        position: "relative",
        background: "#F7F4F4",
        border: "solid",
        borderWidth: "1px"
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p
          style={{
            position: "absolute",
            top: "43%",
            left: "32%",
            height: "200px"
          }}
        >
          Drop or select files to visualize
        </p>
      )}
    </div>
  );
}

export default DropUploader;

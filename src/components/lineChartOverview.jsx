import React, { useState, useEffect, useRef } from "react";

const width = 900;
const height = 150;
const margin = { top: 20, right: 10, bottom: 20, left: 30 };

export const LineChartOverview = props => {
  // access the canvas
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef();
  useEffect(() => setCanvas(canvasRef), []);

  return (
    <div>
      <h2>Hello</h2>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

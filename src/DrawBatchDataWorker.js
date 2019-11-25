export default () => {
  onmessage = e => {
    // retrieve data
    const { timestamps, data, width, height, timeWindow, dataRange } = e.data;

    // TODO: make it a global variable (take it from the app thread)
    const margin = { top: 20, right: 10, bottom: 20, left: 40 };

    // setup the offscreen canvas
    var canvas = new OffscreenCanvas(width, height);
    var canvasContext = canvas.getContext("2d");
    canvasContext.lineWidth = 1;

    // draw the path (line chart)
    canvasContext.beginPath();
    for (let i = 0; i < timestamps.length; i++) {
      if (data[i] === null) {
        continue;
      }
      if (i === 0) {
        canvasContext.moveTo(
          (timestamps[i] / (timeWindow * 1000)) *
            (width - margin.right - margin.left) +
            margin.left,
          height -
            margin.bottom -
            ((data[i] - dataRange[0]) / (dataRange[1] - dataRange[0])) *
              (height - margin.top - margin.bottom)
        );
      } else {
        canvasContext.lineTo(
          (timestamps[i] / (timeWindow * 1000)) *
            (width - margin.right - margin.left) +
            margin.left,
          height -
            margin.bottom -
            ((data[i] - dataRange[0]) / (dataRange[1] - dataRange[0])) *
              (height - margin.top - margin.bottom)
        );
      }
    }
    canvasContext.stroke();
    canvasContext.closePath();

    // send the result into the main thread (OverviewLineChart.jsx)
    postMessage(canvasContext.getImageData(0, 0, width, height));
  };
};

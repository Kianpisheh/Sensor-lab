export default () => {
  onmessage = e => {
    // retrieve data
    const { imageData, width, height, x0, x1, y0 } = e.data;
    let sw = imageData.width;
    var canvas = new OffscreenCanvas(width, height);
    var canvasContext = canvas.getContext("2d");
    let result = canvasContext.createImageData(width, height);
    for (let x = 0; x < x1 - x0; x++) {
      for (let y = 0; y < height; y++) {
        result.data[y * (width * 4) + x * 4] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4];
        result.data[y * (width * 4) + x * 4 + 1] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 1];
        result.data[y * (width * 4) + x * 4 + 2] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 2];
        result.data[y * (width * 4) + x * 4 + 3] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 3];
      }
    }
    // send the result into the main thread (OverviewLineChart.jsx)
    postMessage(result);
  };
};

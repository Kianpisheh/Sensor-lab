export default () => {
  onmessage = e => {
    // retrieve data
    const { imageData, width, height, x0, y0 } = e.data;
    let sw = imageData.width;
    var canvas = new OffscreenCanvas(width, height);
    var canvasContext = canvas.getContext("2d");
    let result = canvasContext.createImageData(width, height);
    let data = result.data;
    let t1 = performance.now();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        data[y * (width * 4) + x * 4] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4];
        data[y * (width * 4) + x * 4 + 1] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 1];
        data[y * (width * 4) + x * 4 + 2] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 2];
        data[y * (width * 4) + x * 4 + 3] =
          imageData.data[(y0 + y) * (sw * 4) + (x + x0) * 4 + 3];
      }
    }
    console.log(performance.now() - t1);
    // send the result into the main thread (OverviewLineChart.jsx)
    postMessage(result);
  };
};

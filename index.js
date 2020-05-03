const ChartjsNode = require('chartjs-node');
// 600x600 canvas size
var chartJsOptions = {
  type: 'line',
  data: {
    datasets: [
      {
        data: [10, 10, 20, 30, 40],
        backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
        label: 'Dataset 1'
      }
    ],
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue']
  },
  options: {}
};

var chartNode = new ChartjsNode(600, 600);
return chartNode.drawChart(chartJsOptions)
.then(() => {
    // chart is created

    // get image as png buffer
    return chartNode.getImageBuffer('image/png');
})
.then(buffer => {
    Array.isArray(buffer) // => true
    // as a stream
    return chartNode.getImageStream('image/png');
})
.then(streamResult => {
    // using the length property you can do things like
    // directly upload the image to s3 by using the
    // stream and length properties
    streamResult.stream // => Stream object
    streamResult.length // => Integer length of stream
    // write to a file
    return chartNode.writeImageToFile('image/png', './testimage.png');
})
.then(() => {
    // chart is now written to the file path
    // ./testimage.png
});
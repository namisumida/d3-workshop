var svg = d3.select("#svg-barchart");
// Set margins - having margins makes elements more spaced out and visually nicer
var marginLeft = 30;
var marginRight = 30;
var marginTop = 30;
var marginBottom = 30;
var axisLabelWidth = 80;
var dataLabelWidth = 20;
var maxBarWidth = 500;
var dataset; // globally defining what dataset is so we can refer to it in Inspector (helpful for seeing if data loads and debugging)

// This is a helper function that converts variables into the right data types. Necessary when working with ints/floats
var rowConverter = function(d) {
  return {
    champion: d.champion,
    queueid: parseInt(d.queueid),
    ngames: parseInt(d.ngames),
    nwins: parseInt(d.nwins),
    nkills: parseInt(d.nkills),
    ndeaths: parseInt(d.ndeaths),
    nassists: parseInt(d.nassists),
    totalminionskilled: parseInt(d.totalminionskilled),
    neutralminionskilled: parseInt(d.neutralminionskilled),
    avgdamagedealtchampions: parseInt(d.avgdamagedealtchampions),
    role: d.role,
    broad_role: d.broad_role
  };
}; // end row converter

// Load in the data
d3.csv('nexusblitzdata.csv', rowConverter, function(data) {

  dataset = data; // save dataset to globally defined "dataset" variable so we can refer to it in the browser console

}) // end d3.csv()

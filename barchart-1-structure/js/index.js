var svg = d3.select("#svg-barchart");
var w = document.getElementById('svg-barchart').getBoundingClientRect().width;
// Set margins - having margins makes elements more spaced out and visually nicer
var marginLeft = 30;
var marginRight = 30;
var marginTop = 30;
var marginBottom = 30;
var axisLabelWidth = 100;
var dataLabelWidth = 20;
var maxBarWidth = w - marginLeft - axisLabelWidth - dataLabelWidth - marginRight; // Figure out the maximum bar width that we're ok with. This is the entire width of svg minus the margins, the width of the axis labels and width of data labels
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

  dataset = data; // save dataset to globally defined "dataset" variable

}) // end d3.csv()

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
  dataset = data.sort(function(a,b) { return b.ngames-a.ngames; }); // sorted dataset

  // Create a scale/function that converts the data to an x coordinate on the page. As input, it requres the min and max data values and corresponding min and max x coordinates for the page.
  // It will map the min data value to the min x coordinate, max data value to the max x coordinate and everything else in between accordingly.
  // This will be used to determine the width of each bar.
  var xScale = d3.scaleLinear()
                 .domain([d3.min(dataset, function(d) { return d.ngames; }),
                          d3.max(dataset, function(d) { return d.ngames; })]) // domain is an array with the min data value and max data value
                 .range([1, maxBarWidth]); // range is an array with the min x coordinate and max x coordinate

   // Create bars
   svg.selectAll("bars")
      .data(dataset)
      .enter()
      .append("rect") // bars
      .attr("class", "bars")
      .attr("x", marginLeft+axisLabelWidth)
      .attr("y", function(d,i) {
        return 20*i;
      })
      .attr("width", function(d) {
        return xScale(d.ngames);
      })
      .attr("height", 15);

  // Create axis labels which will be champion names
  svg.selectAll("axisLabels")
     .data(dataset)
     .enter()
     .append("text") // champion names
     .attr("class", "axisLabels")
     .attr("x", marginLeft + axisLabelWidth - 10)
     .attr("y", function(d,i) {
       return 20*i + 10;
     })
     .text(function(d) {
       return d.champion;
     });

  // Create data labels for the # of games played
  svg.selectAll("dataLabels")
     .data(dataset)
     .enter()
     .append("text")
     .attr("class", "dataLabels")
     .attr("x", function(d) {
       return marginLeft + axisLabelWidth + xScale(d.ngames) + 5;
     })
     .attr("y", function(d,i) {
       return 20*i + 10;
     })
     .text(function(d) {
       return d3.format(",")(d.ngames);
     });
}) // end d3.csv()

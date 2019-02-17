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

  // Filtering
  d3.select("#filter-class").on("change", function() {
    var filterSelection = d3.select(this).node().value; //selection value

    // update the dataset based on the filter value (role)
    if (filterSelection=="all") { // if the filter is set back to the total, we want to show all champions
      dataset = data.sort(function(a,b) { return b.ngames-a.ngames; }); // set dataset to the original data with all champions, but sorted
    }
    else { // when a role is chosen, we want to filter to champions with that role
      dataset = data.filter(function(d) { return d.broad_role==filterSelection; }) // filter by role selected
                    .sort(function(a,b) { return b.ngames-a.ngames; }); // sort the data by # games played in descending order
    };

    // Update bars
    var bars = svg.selectAll(".bars").data(dataset); // bind new data
    var barsEnter = bars.enter() // if there aren't enough bars, create some new ones
                        .append("rect")
                        .attr("class", "bars");
    bars.exit().remove(); // if there are too many bars, remove the ones that are not needed
    bars = bars.merge(barsEnter); // merge the new bars (barsEnter) with the bars that were already on the page
    bars.attr("x", marginLeft+axisLabelWidth) // update all bars
        .attr("y", function(d,i) {
          return 20*i;
        })
        .attr("width", function(d) {
          return xScale(d.ngames);
        })
        .attr("height", 15);

    // Update axis labels
    var axisLabels = svg.selectAll(".axisLabels").data(dataset); // bind new data
    var axisLabelsEnter = axisLabels.enter() // if there aren't enough labels, create some new ones
                                    .append("text")
                                    .attr("class", "axisLabels");
    axisLabels.exit().remove(); // if there are too many labels, remove the ones that are not needed
    axisLabels = axisLabels.merge(axisLabelsEnter); // merge the new labels with the ones already on the page
    axisLabels.attr("x", marginLeft + axisLabelWidth - 10) // update all axis labels
              .attr("y", function(d,i) {
                return 20*i + 10;
              })
              .text(function(d) {
                return d.champion;
              });

    // Update data labels
    var dataLabels = svg.selectAll(".dataLabels").data(dataset); // bind new data
    var dataLabelsEnter = dataLabels.enter() // if there aren't enough labels, create some new ones
                                    .append("text")
                                    .attr("class", "dataLabels");
    dataLabels.exit().remove(); // if there are too many data labels, remove the ones that are not needed anymore
    dataLabels = dataLabels.merge(dataLabelsEnter); // merge the new labels with the ones already on the page
    dataLabels.attr("x", function(d) {
                 return marginLeft + axisLabelWidth + xScale(d.ngames) + 5;
               })
               .attr("y", function(d,i) {
                 return 20*i + 10;
               })
               .text(function(d) {
                 return d3.format(",")(d.ngames);
               });
  }); // end changing filter-class
}) // end d3.csv()

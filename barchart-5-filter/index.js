var svg = d3.select("#svg-barchart");
// Set margins - having margins makes elements more spaced out and visually nicer
var marginLeft = 30;
var marginRight = 30;
var marginTop = 10;
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
        return 20*i + marginTop;
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
       return 20*i + 10 + marginTop;
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
       return 20*i + 10 + marginTop;
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

    // Remove old bars
    svg.selectAll(".bars").remove();
    // Create new ones
    svg.selectAll("bars")
       .data(dataset)
       .enter()
       .append("rect") // bars
       .attr("class", "bars")
       .attr("x", marginLeft+axisLabelWidth)
       .attr("y", function(d,i) {
         return marginTop + 20*i;
       })
       .attr("width", function(d) {
         return xScale(d.ngames);
       })
       .attr("height", 15);

    // Remove old axis labels
    svg.selectAll(".axisLabels").remove();
    // Create new ones
    svg.selectAll("axisLabels")
       .data(dataset)
       .enter()
       .append("text") // champion names
       .attr("class", "axisLabels")
       .attr("x", marginLeft + axisLabelWidth - 10)
       .attr("y", function(d,i) {
         return 20*i + 10 + marginTop;
       })
       .text(function(d) {
         return d.champion;
       });

    // Remove old data labels
    svg.selectAll(".dataLabels").remove();
    // Create new ones
    svg.selectAll("dataLabels")
       .data(dataset)
       .enter()
       .append("text")
       .attr("class", "dataLabels")
       .attr("x", function(d) {
         return marginLeft + axisLabelWidth + xScale(d.ngames) + 5;
       })
       .attr("y", function(d,i) {
         return 20*i + 10 + marginTop;
       })
       .text(function(d) {
         return d3.format(",")(d.ngames);
       });
  }); // end changing filter-class
}) // end d3.csv()

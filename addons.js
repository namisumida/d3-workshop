////////////////////////////////////////////////////////////////////////////////
// STEP 2: CREATING BARS
//dataset = data.sort(function(a,b) { return b.ngames-a.ngames; }); // sorted dataset

// Create a scale/function that converts the data to an x coordinate on the page. As input, it requres the min and max data values and corresponding min and max x coordinates for the page.
// It will map the min data value to the min x coordinate, max data value to the max x coordinate and everything else in between accordingly.
// This will be used to determine the width of each bar.
var xScale = d3.scaleLinear()
               .domain([d3.min(dataset, function(e) { return d.ngames; }),
                        d3.max(dataset, function(d) { return d.ngames; })]) // domain is an array with the min data value and max data value
               .range([1, maxBarWidth]); // range is an array with the min x coordinate and max x coordinate

 // Create bars
 svg.selectAll("myElements")
    .data(dataset)
    .enter()
    .append("rect") // element type rectangle
    .attr("class", "bars") // you can give it any class name you want
    .attr("height", 15)
    .attr("width", function(d) {
      return xScale(d.ngames);
    })
    .attr("x", marginLeft+axisLabelWidth)
    .attr("y", function(d,i) {
      return marginTop + 20*i;
    });

////////////////////////////////////////////////////////////////////////////////
// STEP 3: CREATING AXIS LABELS
// Create axis labels which will be champion names
svg.selectAll("axisLabels")
   .data(dataset)
   .enter()
   .append("text") // champion names
   .attr("class", "axisLabels")
   .attr("x", marginLeft + axisLabelWidth - 10)
   .attr("y", function(d,i) {
     return 20*i + marginTop + 10;
   })
   .text(function(d) {
     return d.champion;
   });
////////////////////////////////////////////////////////////////////////////////
// STEP 4: CREATING DATA LABELS
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
////////////////////////////////////////////////////////////////////////////////
// STEP 5: FILTERING
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

  // BARS
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
////////////////////////////////////////////////////////////////////////////////
  // AXIS LABELS
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
////////////////////////////////////////////////////////////////////////////////
  // AXIS LABELS
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

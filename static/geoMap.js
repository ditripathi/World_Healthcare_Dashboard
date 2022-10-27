var geoMap_year = 2019;
var geoMap_var = "Healthcare Expenditure";
var countries = null;
var geoMap_colorScale = d3.scaleThreshold()
      .domain([1.26,3.115,3.91,4.55,5.12,5.71,6.55,7.275,8.28,9.645,50.18])
      .range(d3.schemeOrRd[7]);
const URL = "http://127.0.0.1:5000/get-data"

function plot_geoMap(geoMap_year)
{
  console.log("Plotting GeoMap for year : ", geoMap_year);
  var request_body = {plot_type : "geomap", year:geoMap_year};

  fetch(URL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(request_body)
    })
  .then(response => response.json())
  .then(data => { 
    
    var height = 250;
    var width = 730;
    
    var color_index = 0;
    
    var initX;
    var mouseClicked = false;
    var s = 1;
    var rotated = 0;
      
    var mouse;

    var projection = d3.geoMercator()
    .scale(85)
    .translate([width/2,height/1.5])
    .rotate([rotated,0,0]); //center on USA
      
    var path = d3.geoPath().projection(projection);

    var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed)
    .on("end", zoomended);

    // d3.select("#geoMap").html("");
    var svg = d3.select("#geoMap").append("svg")
    .attr("style", "outline: thin solid black;")
    .attr("width", width)
    .attr("height", height+50)
    .on("wheel", function() {
      //zoomend needs mouse coords
      initX = d3.mouse(this)[0];
    })
    .on("mousedown", function() {
      if(s !== 1) return;
      initX = d3.mouse(this)[0];
      mouseClicked = true;
    })
    .call(zoom);

    var g = svg.append("g");

    function rotateMap(endX) {
      projection.rotate([rotated + (endX - initX) * 360 / (s * width),0,0]);
      g.selectAll('path').attr('d', path);
    }

    function zoomended(){
      if(s !== 1) return;
      rotated = rotated + ((mouse[0] - initX) * 360 / (s * width));
      mouseClicked = false;
    }  

    function zoomed() {
      var t = [d3.event.transform.x,d3.event.transform.y];
      s = d3.event.transform.k;
      var h = 0;

      t[0] = Math.min(
        (width/height)  * (s - 1), 
        Math.max( width * (1 - s), t[0] )
      );

      t[1] = Math.min(
        h * (s - 1) + h * s, 
        Math.max(height  * (1 - s) - h * s, t[1])
      );

      g.attr("transform", "translate(" + t + ")scale(" + s + ")");

      //adjust the stroke width based on zoom level
      d3.selectAll(".country").style("stroke-width", 1 / s);

      mouse = d3.mouse(this); 
      
      if(s === 1 && mouseClicked) {
        //rotateMap(d3.mouse(this)[0]);
        rotateMap(mouse[0]);
        return;
      }

    }

    
    d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
      if(error) return console.error(error);

      //countries
      var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([10,0])
            .html(function(d) {
                return "<strong>"+d["Country"]+":</strong> <span style='color:#46B2E'>" + d[geoMap_var] + "%</span>";
        })

    svg.call(tip);

      countries = g.append("g")
        .attr("class", "country")
        .selectAll("country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .on("click",function(d,i){
          var record = data.filter(element => element["Numeric_code"]==d.id)

          update_mutliline_plot(record[0].Country);
          update_barplot2(geoMap_year, record[0].Country);
        })
        .on("mouseover",function(d,i){
          var record = data.filter(element => element["Numeric_code"]==d.id);
          tip.show(record[0]);
        })
        .on("mouseout",tip.hide)
        .attr("d", path)
        .attr("fill",function (d) {
          var record = data.filter(element => element["Numeric_code"]==d.id)
          if (record.length>0)
          {
            var color = record[0][geoMap_var] | 0;
            return geoMap_colorScale(color);
          }
          else
          {
            return geoMap_colorScale(0);
          }
        });
            
        add_playable_slider("geoMap", 2000, 2019, update_geoMap, width, height, {left:50, right:50, top:0, bottom:0}, svg);
        
    });
  });
}
function update_geoMap(geoMap_year)
{
  var request_body = {plot_type : "geomap", year:geoMap_year};
  console.log("Requesting Data for year : ", geoMap_year)
  fetch(URL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(request_body)
    })
  .then(response => response.json())
  .then(data => { 
    countries
    .transition().duration(300)
    .attr("fill",function (d) {
          var record = data.filter(element => element["Numeric_code"]==d.id)
          if (record.length>0)
          {
            var color = record[0][geoMap_var] | 0;
            return geoMap_colorScale(color);
          }
          else
          {
            return geoMap_colorScale(0);
          }
        });
  });
}
function changeColor()
{
  geoMap_year += 1;
  update_geoMap(geoMap_year);
}
plot_geoMap(geoMap_year)


function updatePCPPlot(year)
{
    var country="World"
    var request_body = {plot_type : "pcpPlot", year: year, world:country };
        
    fetch(URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request_body)
        })
        .then(response => response.json())
        .then(data => {
            
            
            d3.select("#pcp_plot").html("");

            var margin = 0, svgWidth = 400, svgHeight = 200, width = svgWidth - margin, height = svgHeight - margin;

            var x = d3.scalePoint().range([0, width]).padding(1);

            var y = {},
            dragging = {};

            var line = d3.line(),
            axis = d3.axisLeft();

            var svg = d3.selectAll("#pcp_plot")
                .append("svg")
                .attr("style", "outline: thin solid black;")
                .attr("width", width-40)
                .attr("height", height+100)
                .attr("transform","translate(40,0)");

            var g = svg.append("g")
            .attr("height", height+100)
            .attr("transform", "translate(" + -20 + "," + 80 + ")");

            const categorical =["Country","Code"]

            attributes = d3.keys(data[0]).filter(function(d) {
    
                
                if(categorical.includes(d)) {
                    y[d] = d3.scalePoint()
                        .domain(data.map(function(p) { return p[d]; }))
                        .range([height, 0]);
                }
                else {
                    y[d] = d3.scaleLinear()
                        .domain(d3.extent(data, function(p) { return +p[d]; }))
                        .range([height, 0]);
                }
                return true;
            });


            x.domain(attributes);

            
            //Background lines on the chart with grey color
            background = g.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                    .attr("d", path);

             //Foreground lines on the chart with cluster ID color
            foreground = g.append("g")
            .attr("class", "foreground_pcp")
            .selectAll("path")
            .data(data)
            .enter().append("path")
                .attr("d", path)
                .style("stroke", "#9c0d14");

            //Add the axes line 
            g = g.selectAll(".dimension_pcp")
            .data(attributes)
            .enter().append("g")
                .attr("class", "dimension_pcp")
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                .call(d3.drag()
                        .subject(function(d) { return {x: x(d)}; })

                        .on("start", function(d) {
                            dragging[d] = x(d);
                            background.attr("visibility", "hidden");
                        })

                        .on("drag", function(d) {
                            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                            foreground.attr("d", path);
                            attributes.sort(function(a, b) { return position(a) - position(b); });
                            x.domain(attributes);
                            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                        })
                        
                        .on("end", function(d) {
                            delete dragging[d];
                            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                            transition(foreground).attr("d", path);
                            background.attr("d", path)
                            .transition()
                            .delay(650)
                            .duration(0)
                            .attr("visibility", null);
                        })
                    )
                    
            //Add axis and title for each axis 
            g.append("g")
                .attr("class", "axisPcp")
                .each(function(data) { d3.select(this).call(axis.scale(y[data])); })
                .append("text")
                    .style("text-anchor", "middle")
                    .style("font-size", "11px")
                    .style("fill", "black")
                    .attr("y", -15)
                    .attr("x", -5)
                    
                    .text(function(d) { return d; })
                    .attr("transform", "rotate(-30)");
            
            //Add a  brush for each axis
            g.append("g")
            .attr("class", "brushPcp")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, y[d].range()[1]], [8, y[d].range()[0]]])
                                                    .on("start", brushstart)
                                                    .on("brush", brush)
                        );
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

            function position(data) {
                var v = dragging[data];
                return v == null ? x(data) : v;
            }
            
            //Transition duration
            function transition(g) {
                return g.transition().duration(600);
            }

            //Get the line for the path
            function path(data) {
                return line(attributes.map(function(p) { 
                    return [position(p), y[p](data[p])]; 
                }));
            }

            //Function to start the brush
            function brushstart() {
                d3.event.sourceEvent.stopPropagation();
            }

            //Handling the brush event
            function brush() {
                var lineSelected = [];
                
                //Selected data polylines
                svg.selectAll('.brushPcp')
                    .filter(function(d) 
                    {
                        return d3.brushSelection(this);
                    })
                    .each(function(d) 
                    {
                        // Append selected lines to the lineSelected array
                        lineSelected.push({
                                dimension: d, extent: d3.brushSelection(this)
                            });
                    });
                
                //Hide the unbrushed lines
                foreground.style('display', function(d) {
                    return lineSelected.every(function(activeLine) {
                    return activeLine.extent[0] <= y[activeLine.dimension](d[activeLine.dimension]) && y[activeLine.dimension](d[activeLine.dimension]) <= activeLine.extent[1];
                    }) ? null : 'none';
                });
            }
         });
}

updatePCPPlot(2000);
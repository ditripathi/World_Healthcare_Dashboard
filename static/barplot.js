var barplot_year = 2000;

var barplot_variable = "BirthRate"

function update_barplot(variable_val, year_val)
{
    // console.log("Updating barplot with value : ", variable_val)
    var variable_name = variable_val || barplot_variable;
    var variable_name2 = "Population"

    var year = year_val || barplot_year;
    barplot_year = year;

    
    var request_body = {plot_type : "barplot", variable_name:variable_name, min_year:year, max_year:year};
    var margin = {top: 0, right: 50, bottom: 30, left: 60},
        width = 360 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        innerRadius = 30,
        outerRadius = Math.min(width, height) / 2;  
    // console.log("Requesting Data on : ", URL);
    fetch("http://127.0.0.1:5000/get-data", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request_body)
        })
        .then(response => response.json())
        .then(data => { 
        
        // if(svg)
        //     svg.selectAll('*').remove();
        
        d3.select("#barplot").html("");
        var svg = d3.select("#barplot")
        .append("svg")
        .attr("style", "outline: thin solid black;")
        .attr("width", width + margin.left + margin.right)
        .attr("transform", "translate(70,35)")    
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
    
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>"+variable_name+":</strong> <span style='color:#46B2E'>" + d[variable_name] + "</span> - " +d["Country"];
        })

        svg.call(tip);
        
        var tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Population"+":</strong> <span style='color:#46B2E'>" + d["Population"] + "</span>";
        })

        svg.call(tip2);

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])   
            .align(0)                  
            .domain(data.map(function(d) { return d.Country; })); 
        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])   
            .domain([0,
        d3.max(data, function(d) { return d[variable_name]; }) + 0.5 ]); 
        

        // Second barplot Scales
        var ybis = d3.scaleRadial()
        .range([innerRadius, 5])   // Domain will be defined later.
        .domain([0, d3.max(data, function(d) { return d[variable_name2]; }) + 0.5 ]);

        var arc = d3.arc()     
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d[variable_name]); }) // TODO : Add Transition
        // .outerRadius(function(d) { return y(0); })
        .startAngle(function(d) { return x(d.Country); })
        .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius)
        
        var arc2 = d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius( function(d) { return ybis(0) })
        .outerRadius( function(d) { return ybis(d[variable_name2]); })
        .startAngle(function(d) { return x(d.Country); })
        .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius)
        
        var bars = svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "#E8816A")
            .style("stroke", "black")
            .style("stroke-opacity", .5)
            .attr("class", "bar-on-arc")
            .attr("d", arc)
            
        bars.transition()
        // .on("mouseover",function(d,i){console.log("Mouse on this :",this)})
        .delay(function(d,i){ return 10*i; }) 
        .duration(1000);
        
        
        var texts = svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("class","barplot_text")
            .attr("text-anchor", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d[variable_name])+3) + ",0)"; })
            .append("text")
            .text(function(d){return(d.Country)})
            .attr("transform", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle");
            
        bars.on('mouseover',function(d,i){
            var text_nodes = texts.nodes();
            text_nodes.forEach(text_node => {
                d3.select(text_node).attr("font-weight","normal");
                
            });
            d3.select(text_nodes[i]).attr("font-weight","bolder");
            tip.show(d)
        });
        bars.on('mouseout', tip.hide);

        bars.on('click',function(d,i){
            var text_nodes = texts.nodes();
            text_nodes.forEach(text_node => {
                d3.select(text_node).attr("font-weight","normal");
            });
            d3.select(text_nodes[i]).attr("font-weight","bolder");
        });

        
        var bars2 = svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "#fee1d4")
            .style("stroke", "black")
            .style("stroke-opacity", .5)
            .attr("class", "bar-on-arc")
            .attr("d", arc2)
            
        // console.log("Adding bars2")
        bars2.transition()
        // .on("mouseover",function(d,i){console.log("Mouse on this :",this)})
        .delay(function(d,i){ return 10*i; }) 
        .duration(1000);
        
        
            
        bars2.on('mouseover',function(d,i){
            var text_nodes = texts.nodes();
            text_nodes.forEach(text_node => {
                d3.select(text_node).attr("font-weight","normal");
                
            });
            d3.select(text_nodes[i]).attr("font-weight","bolder");
            tip2.show(d)
        });
        bars2.on('mouseout', tip2.hide);

        bars2.on('click',function(d,i){
            var text_nodes = texts.nodes();
            text_nodes.forEach(text_node => {
                d3.select(text_node).attr("font-weight","normal");
            });
            d3.select(text_nodes[i]).attr("font-weight","bolder");
        });
        
        // createDropDownMenu("Select a Variable",["BirthRate","MortalityRate","LifeExpectancy"],"update_barplot","circular_plot_dropdown")

  });
}
// plot_slider("slider-container",2000,2000);
update_barplot()

// https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
// https://rasmusfonseca.github.io/d3RangeSlider/
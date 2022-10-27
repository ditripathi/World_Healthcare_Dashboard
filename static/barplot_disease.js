
function update_barplot3(year, country)
{
    // console.log("Drawing the barplot")
    if(!country)
    {
        country=barplot_country;
    }
    else
        barplot_country=country;
        
    // console.log("year is", year)
    // console.log("Country is:", country)
    var request_body = {plot_type : "barplot2", year: year, country: country};
    var margin = {top: 30, right: 30, bottom: 20, left: 40},
    width = 480 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

    fetch(URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request_body)
        })
        .then(response => response.json())
        .then(data => { 
        // console.log("data is",data)
        var color = d3.scaleOrdinal(['#fee1d4', '#fdcbb6', '#fcb095', '#fc9475', '#fb7859', '#f65a41', '#eb3c2e', '#d52422', '#bb151a', '#9c0d14', '#75030f'])
        // var color = d3.scaleOrdinal([`#383867`, `#584c77`, `#33431e`, `#a36629`, `#92462f`, `#b63e36`, `#b74a70`, `#946943`]);
        // ["#6b486b", "#a05d56", "#d0743c", "#ff8c00","#6b486b", "#a05d56", "#d0743c", "#ff8c00","#6b486b", "#a05d56"]
        d3.select("#barplot2").html("");
        var svg = d3.select("#barplot2")
            .append("svg")
            // .attr("style", "outline: thin solid black;")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform",
            "translate(50,0)");
        
        g = svg.append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        

        var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Value; })])
        .range([ 0, width]);
                  
        svg.append("g")
        .attr("transform", "translate(100," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        
        // Y axis
        var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) {
            // console.log("Plotting y label : ",d)
            return d["DeathCause"] }))
        svg.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", "translate(100,0)rotate(0)")
        
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>"+country+"-</strong>"+d.DeathCause+"  : <span style='color:#46B2E'>" + d.Value + "%</span>";
        })

        svg.call(tip);

        //Bars
        var bars = svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0)+100)
        .style("background-color", function(d, i) {
            return color(i);
          })
        .attr("y", function(d) { return y(d.DeathCause); })
        .attr("width", function(d) { return x(d.Value); })
        .attr("height", y.bandwidth() )
        .style("stroke", "black")
        .style("stroke-opacity", .5)
        .attr("fill", function(d, i) {
            return color(i);
          })
        .on('mouseover',function(d,i){
            tip.show(d);
        })
        .on('mouseout',function(d,i){
            tip.hide(d);
        })
                
        });


}

function update_barplot2(year, country)
{
    if(!country)
    {
        country=barplot_country;
    }
    else
        barplot_country=country;

        var request_body = {plot_type : "barplot2", year: year, country: country};
        var margin = {top: 30, right: 30, bottom: 20, left: 150},
            width = 480 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

            
        
        
        fetch("http://127.0.0.1:5000/get-data", {
                method: "POST",
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(request_body)
            })
            .then(response => response.json())
            
        .then(data => { 
            
      data = data["data"];
    var keys = ["World","Country","Avg"];
    d3.select("#barplot2").html("");
    var svg = d3.select("#barplot2")
        .append("svg")
        .attr("style", "outline: thin solid black;")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
        "translate(50,0)");
    
    g = svg.append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    var y = d3.scaleBand()			// x = d3.scaleBand()	
        .range([0, height])	// .rangeRound([0, width])
        // .paddingInner(0.05)
        // .align(0.1);

    var x = d3.scaleLinear()		// y = d3.scaleLinear()
        .range([0, width]);	// .rangeRound([height, 0]);
    
    var z = d3.scaleOrdinal()
        .range(["#EDBF69", "#B4161B", "#383CC1"]);
    
    data.sort(function(a, b) { return b.total - a.total; });
    // console.log(data);
    y.domain(data.map(function(d) { return d.DeathCause; }));					// x.domain...
    x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();	// y.domain...
    z.domain(keys);
    
    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                // {Avg: 45052, Country: 864311, DeathCause: 'High BP', World: 7749028, total: 8658391}

                return "<strong>Country/World :</strong>"+(Math.round(d["Country"]/d["World"]*100*100))/100 + " %";
        })

    svg.call(tip);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .style("stroke", "black")
            .style("stroke-opacity", .5)
        .attr("y", function(d) { return y(d.data.DeathCause); })	    //.attr("x", function(d) { return x(d.data.State); })
        .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth())
        .on("mouseover",function(d){
            tip.show(d.data);
        })
        .on("mouseout",function(d){
            tip.hide();
        })
        ;						    //.attr("width", x.bandwidth());	
  
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));
  
    g.append("g")
        .attr("class", "axis")
      .attr("transform", "translate(0,"+height+")")				// New line
        .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5+220) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Number of Deaths")
      .attr("transform", "translate("+ (-width) +",-10)");   	// Newline
  
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
     .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });
  
    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);
  
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}

update_barplot2(2000, "United States");
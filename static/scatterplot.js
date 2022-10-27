// Country,Code,Year,BirthRate,MortalityRate,LifeExpectancy,GDPPerCapita,Population
var variable1 = "GDPPerCapita";
var variable2 = "LifeExpectancy";
var variable3 = "Population";
var year = 2015;
const min_radius = 1;

function update_scatterplot(variable1, variable2, year)
{
    var margin = {top: 10, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#scatterplot")
    .append("svg")
    .attr("style", "outline: thin solid black;")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var request_body = {plot_type : "scatterplot", variable1:variable1, variable2:variable2, variable3:variable3, year:year};
        
    fetch(URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request_body)
        })
        .then(response => response.json())
        .then(data => { 
            // console.log(data);

            // var maxVal = 0;

            // data.forEach(function(d) {
            //     if(maxVal<d[variable3])
            //     maxVal = d[variable3];
            // });
            // console.log("maxVal :"+maxVal);
            // var scaleVal = d3.scaleLinear().domain([0, maxVal]).range([0, 10]);

            // data.forEach(function(d) {
            //     d["Country"] = +d["Country"];
            //     d[variable1] = +d[variable1];
            //     d[variable2] = +d[variable2];
            //     d[variable3] = +scale(d[variable3]);
            //   });
            
            // for ( var i in arr ){
            //     console.log(scale(arr[i]));
            // }
            var x = d3.scaleLinear()
            .domain([0, d3.max([d3.max(data, function (d) { return +d[variable1] })])])
            .range([ 0, width ]);
            
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

            var y = d3.scaleLinear()
                .domain([0, d3.max([d3.max(data, function (d) { return +d[variable2] })])])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", (width/2+margin.left))
                .attr("y", height+margin.top+40)
                .text(variable1);
            
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -40)
                .attr("x", -(height/2-margin.top-30))
                
                .attr("dy", ".10em")
                .attr("transform", "rotate(-90)")
                .text(variable2);
            
                var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return " <span style='color:#46B2E'><span>"+d["Country"];
            })

            svg.call(tip);

            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d[variable1]); } )
                .attr("cy", function (d) { return y(d[variable2]); } )
                .attr("r", function(d){
                    return 5;})
                .style("fill", "#69b3a2")
                .on("mouseover", function(d,i){
                        tip.show(d);    
                    })
                .on("mouseleave", function(d,i){
                        tip.hide(d);    
                })
    });
}

update_scatterplot(variable1, variable2, year);
createDropDownMenu("Select X-Axis Variable",["BirthRate","MortalityRate","LifeExpectancy"],"update_scatterplot","scatterplot_dropdown1")
createDropDownMenu("Select Y-Axis Variable",["BirthRate","MortalityRate","LifeExpectancy"],"update_scatterplot","scatterplot_dropdown2")


var playButton_playing = false;

function plot_slider(div_id, min, max)
{
    var slider = createD3RangeSlider(min, max, "#"+div_id);

    slider.onChange(function(newRange){
        d3.select("#range-label").text(newRange.begin + " - " + newRange.end);
    });
    slider.range(min,max);
}

function add_playable_slider(div_id, start_year, end_year, on_change_function, p_width, p_height, margin, svg)
{
 
    /**
    * Function to add playable slider  
    @param {} div_id id of <div> element
    @param {} start_year starting year of slider
    @param {} end_year ending year of slider
    @param {} on_change_function function to be called with change in value
    @param {} p_width parent division's width
    @param {} p_height parent division's height
    @param {} margin JSON of margin {top, left, right, bottom}
    @param {} svg Parent plot's SVG object
     
    */

    width = p_width - margin.left - margin.right,
    height = p_height - margin.top - margin.bottom;

    var formatTickDate = d3.timeFormat("%Y");
    var formatTooltipDate = d3.timeFormat("%Y");

    var startDate = new Date(start_year,1,1);
    // console.log("startDate",startDate);

    var endDate = new Date(end_year,1,1);
    var timer;

    var tickVals = Array.from(Array(end_year-start_year+1).keys()).map(iter => new Date().setFullYear(start_year+(iter)));

    var sliderTime = d3
    .sliderBottom()
    .min(startDate)
    .max(endDate)
    .step(1)
    .width(width - margin.left - margin.right )
    .tickFormat(formatTickDate)
    .tickValues(tickVals)
    .fill('#2196f3')
    .displayFormat(formatTooltipDate)
    .default(startDate)
    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
    .on("drag", function (val) {
        resetTimer();
    }).on("onchange", function (val) { 
        d3.select(".tick text").attr("opacity", "1");
        on_change_function(val.getFullYear());
        update_barplot(null, val.getFullYear())
        updatePCPPlot(val.getFullYear())
        update_barplot2(val.getFullYear());
        val.geoMap_year=getFullYear();
    });

    var playButton = document.getElementById("play_button");
    
    var gTime = svg.append("g").attr("transform", "translate("+margin.left+","+height+")");
    gTime.call(sliderTime);

    const box = document.querySelector('.box');

    // box.addEventListener('click', (e)=>{
    //     console.log("Clicked on play:",playButton_playing);
    //     if (playButton_playing)
    //     {
    //         moving = true;
    //         timer = setInterval(update, 1000);   
    //         e.target.classList.toggle('pause');
    //     }
    //     else
    //     {
    //         resetTimer();   
    //         e.target.classList.toggle('pause');
        
    //     }
    //     playButton_playing = !playButton_playing;
        
    // })

    playButton.addEventListener("click", function () {
        var button = document.getElementById("play_button");
        
        this.classList.toggle('pause');
        if (button.getAttribute("value") == "Pause") {
            resetTimer();
            // this.classList.toggle('pause');
        } 
        else {
            moving = true;
            timer = setInterval(update, 360);
            button.setAttribute("value","Pause");
        }
    });
    function update() {
        var d = sliderTime.value();      
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var offset = new Date(year + 1, month, day);
        sliderTime.value(offset);
        if(offset >= endDate.valueOf()) {
            resetTimer();
        }
    }

    function resetTimer() {
        moving = false;
        clearInterval(timer);
        playButton.setAttribute("value","Play");
    }
}



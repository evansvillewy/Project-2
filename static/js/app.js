let stateDD = d3.select("#selDataset");

//add the ul for the states
function addStateDD(states){
    //var ul = d3.select(".state").append('ul');
    let stateDD = d3.select("#selDataset");

    stateDD.append("option").text("--Select a State--");
    
    // add the subjects to the select list
    states.forEach(function(row) {
        // create the drop down menu of subjects
        stateDD
        .append("option")
            .text(row)
        });  

    let theState = stateDD.property("value");
    console.log("called addStateDD");
    console.log("theState"+theState);        
};

function updateLine(theState) {

    // Get the state specific data for analysis
    d3.json(`/state_data/hour/${theState}`)
    .then(function (json) {

    let x = [];
    let y = [];

    for(var i = 0; i < json.length; i++) {
        var obj = json[i];

        x.push(obj.hour);
        y.push(obj.accident_count)
    };

    let lineData = [{
        x: x,
        y: y,
        type: "line"
    }];

    let lineLayout = {
        xaxis: {title: "Time of Day"},
        yaxis: {title: "Accident Count"}
    };

    Plotly.newPlot("line", lineData, lineLayout, responsive = true);

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
    });
};

// Source reference: https://plotly.com/javascript/plotlyjs-events/#hover-event
var barPlot;
var bar2Plot;

function updatebar1New(theState){

    //Get the state specific data for analysis
    d3.json(`/state_data/weekday/${theState}`)
    .then(function (json) {

        y = [];
        x = [];
        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
            y.push(obj.accident_count);
            x.push(obj.weekday);
        };

    barPlot = document.getElementById('bar'),
     x = x,
     y = y,
     colors =['#1371a4','#1371a4','#1371a4',
              '#1371a4','#1371a4','#1371a4',
              '#1371a4'],
     data = [{x:x, y:y,
              type:'bar',
              mode:'markers',marker:{color:colors}}],
     layout = {
         hovermode:'closest',
         yaxis:{title:"Accident Count"},
         xaxis:{title:"Weekday"}
      };

    Plotly.newPlot("bar",data,layout);

    barPlot.on('plotly_hover', function(data){
        console.log(data);
        var pn='',
            tn='',
            pi='',
            colors=[];
        for(var i=0; i < data.points.length; i++){
          console.log(i);
          console.log(data.points[i]);
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
          pi = data.points[i].pointIndex;
          colors = data.points[i].data.marker.color;
        };
        colors[pn] = '#808000';
      
        var update = {'marker':{color: colors, size:16}};
        Plotly.restyle('bar', update, [tn]);
      });
      
      barPlot.on('plotly_unhover', function(data){
        var pn='',
            tn='',
            pi='',
            colors=[];
        for(var i=0; i < data.points.length; i++){
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
          pi = data.points[i].pointIndex;
          colors = data.points[i].data.marker.color;
        };
        colors[pn] = '#1371a4';
      
        var update = {'marker':{color: colors}};
        Plotly.restyle('bar', update, [tn]);
      });

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
    });    
};

function updatebar2New(theState){

    //Get the state specific data for analysis
    d3.json(`/state_data/count_by_day/${theState}`)
    .then(function (json) {

        y = [];
        x = [];
        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
            y.push(obj.accident_date);
            x.push(obj.accident_count);
        };

    bar2Plot = document.getElementById('bar2'),
     x = x,
     y = y,
     colors =['#1371a4','#1371a4','#1371a4',
              '#1371a4','#1371a4','#1371a4',
              '#1371a4','#1371a4',
              '#1371a4','#1371a4'],
     data = [{x:x, y:y,
              type:'bar',
              orientation: "h",
              mode:'markers',marker:{color:colors}}],
     layout = {
        hovermode:'closest',
        yaxis:{title:"Accident Date"},
        xaxis:{title:"Accident Count"}
      };

    Plotly.newPlot("bar2",data,layout);

    bar2Plot.on('plotly_hover', function(data){
        console.log(data);
        var pn='',
            tn='',
            pi='',
            colors=[];
        for(var i=0; i < data.points.length; i++){
          console.log(i);
          console.log(data.points[i]);
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
          pi = data.points[i].pointIndex;
          colors = data.points[i].data.marker.color;
        };
        colors[pn] = '#808000';
      
        var update = {'marker':{color: colors}};
        Plotly.restyle('bar2', update, [tn]);
      });
      
      bar2Plot.on('plotly_unhover', function(data){
        var pn='',
            tn='',
            pi='',
            colors=[];
        for(var i=0; i < data.points.length; i++){
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
          pi = data.points[i].pointIndex;
          colors = data.points[i].data.marker.color;
        };
        colors[pn] = '#1371a4';
      
        var update = {'marker':{color: colors, size:16}};
        Plotly.restyle('bar2', update, [tn]);
      });

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
    });    
};
    
//Update the visualizations based on the subject selected
function updatePage(){
    // get the selected Statwe
    let theState = "--Select a State--"
    let stateDD = d3.select("#selDataset");
    theState = stateDD.property("value");
  
    if (theState != "--Select a State--" && theState && typeof theState != undefined) {
      //Prevent the page from reloading with D3
      d3.event.preventDefault();
     }
     else{
       theState = "FL";
       console.log("subject if/else");
     };

    updateLine(theState);
    updatebar1New(theState);
    updatebar2New(theState);
};

// Get the list of distinct states for populating the drop down select list on the page
d3.json('/states')
    .then(function (json) {

        statesArray = [];

        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
        
            statesArray.push(obj.state);
        }

        addStateDD(statesArray);

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
      });       

// reference UCF Bootcamp Interactive Viz Lecture Day 2 - Activity 7
d3.selectAll("body").on("change", updatePage);

updatePage();

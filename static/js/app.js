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

    function updatebar1(theState){

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

        // Create a bar chart for the accident count by day
        let trace1 = {
            x: x,
            y: y,
            type: "bar",
        };

        let content = [trace1];
        let layout = {
            yaxis:{title:"Accident Count"},
            xaxis:{title:"Weekday"}
        };

        Plotly.newPlot("bar",content,layout);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
          });     
    };

    function updatebar2(theState){

        //Get the state specific data for analysis
        d3.json(`/state_data/count_by_day/${theState}`)
        .then(function (json) {

            y = [];
            x = [];
            for(var i = 0; i < 11; i++) {
                var obj = json[i];
                y.push(obj.accident_date);
                x.push(obj.accident_count);
            };

        // Create a horizontal bar chart for the top 10 accident days
        let trace1 = {
            x: x,
            y: y,
            type: "bar",
            orientation: "h",
            //text: top_otu_labels,
        };

        let content = [trace1];

        let layout = {
            yaxis:{title:"Accident Date"},
            xaxis:{title:"Accident Count"}
        };

        Plotly.newPlot("bar2",content,layout);
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
       let alert = d3.select("#alert");
       alert.text('Clicked '+theState );
     };

    updateLine(theState);
    updatebar1(theState);
    updatebar2(theState);

     };

     updatePage();

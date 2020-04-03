let stateDD = d3.select("#selDataset");

//add the ul for the states
function addStateDD(states){
    //var ul = d3.select(".state").append('ul');
    
    stateDD.append("option").text("--Select a State--");
    
    // add the subjects to the select list
    states.forEach(function(row) {
        // create the drop down menu of subjects
        stateDD
        .append("option")
            .text(row)
        });  
}

// Get the list of distinct states for populating the drop down select list on the page
d3.json('/states')
    .then(function (json) {

        statesArray = [];

        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
        
            statesArray.push(obj.state);
        }

        addStateDD(statesArray)

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
      });       

// reference UCF Bootcamp Interactive Viz Lecture Day 2 - Activity 7
d3.selectAll("body").on("change", updatePage);

//Update the visualizations based on the subject selected
function updatePage(){
    // get the selected subject Id
    let theState = stateDD.property("value");
    console.log(theState);
  
    if (theState != "--Select a State--") {
      //Prevent the page from reloading with D3
      d3.event.preventDefault();
     }
     else{
       theState = "FL";
       console.log("subject if/else");
     };

    //Get the state specific data for analysis
    d3.json(`/state_data/${theState}`)
    .then(function (json) {
        console.log('GET response as JSON:');
        console.log(json); // Here’s our JSON object

    }).catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
      });     

     };

updatePage();
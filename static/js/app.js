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
}

// Send the same request
fetch('/states')
    .then(function (response) {
        return response.json(); // But parse it as JSON this time
    })
    .then(function (json) {
        console.log('GET response as JSON:');
        console.log(json); // Here’s our JSON object

        statesArray = [];

        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
        
            statesArray.push(obj.state);
        }

        //console.log(statesArray);
        addStateDD(statesArray)
    })


  
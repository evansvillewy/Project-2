function Logging(){
    console.log("Map triggered");
    console.log(this);
    console.log("My Name "+this.data.name);
};

// reference UCF Bootcamp Interactive Viz Lecture Day 2 - Activity 7
d3.select("#map2").on("click", Logging);
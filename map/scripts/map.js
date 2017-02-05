datasetUK =  "data/map.json";
datasetTowns = "data/data.json";
// datasetTowns = "http://ac32007.cloudapp.net:8080/Circles/Towns/" + numberOfTowns;

var width=600;
var height=800;

var scaling = width*8;
var mapPlacement = [width/2, height/2];
var mapCenter;
var projection;
var path;

  // d3.json(datasetUK, function(error,UKData){
  //   if(error)	{
  //     console.log("Map failed to load")
  // }
  // else {
  //   DataLoad(UKData);
  //   d3.json(datasetTowns, function(error,TownsData){
  //     if(error)	{console.log("Towns Data failed to load")
  //   }
  //   else{
  //     DataLoad(UKData,TownsData);
  //   }
  // })
// }
// });

function DataLoad(){
  d3.json(datasetUK, function(error,UKData){
    if(error)	{
      console.log("Map failed to load");
  }
  else{
    d3.json(datasetTowns, function(error,townsData){
      if(error)
      {
        console.log("Towns Data failed to load");
      }
      else
    {
      drawMap(UKData,townsData);
    }
  });
}
});
}

function drawMap(UKData,townsData)
{
  var svg=d3.select("body")
                    .append("svg")
                    .attr("width",width)
                    .attr("height",height);
  var g=svg.append("g");
  mapCenter=d3.geoCentroid(UKData);
  projection=d3.geoMercator()
                              .center(mapCenter)
                              .scale(scaling)
                              .translate(mapPlacement);
  path=d3.geoPath().projection(projection);
  var layer=g.attr("class","geo-layers")
                    .selectAll(".layer")
                    .data(UKData.features)
                    .enter()
                    .append("g")
                    .attr("class","layer");
  var circles=g.attr("class","circles")
                      .selectAll("circle")
                      .data(townsData)
                      .enter()
                      .append("circle")
                      .attr("visibility","visible");
  layer.append("path")
          .attr("d", path)
          // .attr("stroke","black")
          // .attr("stroke-width",0.2)
          .style("fill",function(d)
          {
            return "#ccc";
          });

paintMap(UKData,townsData);
}

function paintMap(UKData,townsData){
  var selectionSVG=d3.select("svg");

  var body=d3.select("body");

  selectionSVG.selectAll("circle")
                      .data(townsData)
                      .transition()
                      .delay(2000)
                      .duration(2000)
                      .attr("visibility","visible")
                      .attr("cx", 	function(d){return 	projection([d.lng,d.lat])[0]	;} )
                      .attr("cy",		function(d){return 	projection([d.lng,d.lat])[1]	;} )
                      .attr("r", 		8)
                      .attr("fill","blue")
                      .attr("opacity",0.5);
}

// function Initialise()
// {
// 	d3.select("p").classed("hidden",false);
// 	 setTimeout(function () {
// 		 DataLoad();
// 		 d3.select("p").classed("hidden",true);
//    } ,1000);
// }
window.onload = DataLoad();

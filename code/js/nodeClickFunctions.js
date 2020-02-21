// WHAT ABOUT ZOOMING TO ANOTHER NODE/BRANCH OUTSIDE THE ONE YOU"RE ON???
// THIS IS ABLE TO BE FIGURED OUT BY COMPARING THE 
// SEARCHED FOR NODE WITH THE cfg.prvClk.pack
// we'll zoom out and then zoom in.
function zoomableTreeResponse(d, is_root=0) {

	if (cfg.zoomZooming){
      console.log("Zooming in progress...")
      return 0;
  }
  // ZOOM IN ON ZOOMABLE GRAPH FUNCTION
  if(cfg.change > 1 || (cfg.zoomableTransition > 0) ) {
      cfg.change = 0;
      return 0;
  }
  
  // build the id for the zoomable graph from the node clicked in pack
  var originalId = ["zoomable"].concat(buildId(d).reverse()).join("-");

  var clickedPackId = ["pack"].concat(buildId(d).reverse()).join("-");

  var isTheSamePackEl = (clickedPackId == cfg.prvClk.pack);

  cfg.prvClk.pack = clickedPackId;
  // get the id of the zoomable tree that needs to zoom
  // what zoomable elements are exposed?
  // select the exposed element that most closely resembles the
  // pack view node
  var id;
  var idArr = originalId.split("-");
  var idArrLength = idArr.length;
  var newId = "";
  var gDiff = 0;
  var partialZoomIds = [];
  var partialZoomArrLength = idArrLength;

  var zoomableElements = d3.selectAll(".zoomable");

  var grandParent = d3.select(".grandparent").attr("id");
  // if there are no zoomable elements, it is the root
  // and should go up as many as it takes to get to the same node
    // what does going up mean?


  zoomableElements.each(function(d){ 
      var zPId = d3.select(this).attr("id");

      var zPArr = zPId.split("-");
      partialZoomArrLength = zPArr.length;
      
      partialZoomIds.push(zPArr);
  });


  // what about if we click the great grand parent of Pack?
  // what if we click the same element we're in in pack?

  // check if the zoom is going deeper
  // check where the zoom is and which direction, up or down
      // is it at the root?
      
      // if zooming in, down, 
      // the partialZoomArrLength is less than the pack idArrLegth
      
      // if zooming out, up, 
      // the partialZoomArrLength is greater than the pack selected idArrLength
  if (isTheSamePackEl){
      //zoom all the way out
  } else if ( (zoomableElements.size() == 0 && grandParent != originalId) || is_root ){
      cfg.zoomZooming = true;
      // go up so many times
      var transition = 600;
      rGrPar = grandParent + "-root";

      // Need to work on stopping click events for pack when this is going on
      var zoomTimeOver = rGrPar.split("-").length - originalId.split("-").length;
      var zTime = 1;

      for ( zTime, rGrPar, p = Promise.resolve(); rGrPar != originalId; ){
          p = p.then(_ => new Promise(resolve =>{
              // if (zTime == zoomTimeOver)
              //     cfg.zoomZooming = false;

              d3.select(".grandparent").dispatch("drill");
              transition += 200;
              // zTime++
              return setTimeout(function(){
                  if (zTime == zoomTimeOver)
                      cfg.zoomZooming = false;
                  
                  zTime++;
                  return resolve();   
              }, transition);
          }));
          
          var gArr = rGrPar.split("-");
          gArr.pop();
          rGrPar = gArr.join("-");
      } 

  } else if (partialZoomArrLength < idArrLength) {
      cfg.zoomZooming = true;

      partialZoomIds.forEach(function(zoomArr){ 
          // if the id is not present in any of the exposed zoomable elements...
          // get the one that most closely matches it 
          
          var partiallyZoomedId = [];                            
          
          for(var i in zoomArr) {   
              if(idArr.indexOf(zoomArr[i]) > -1){
                  partiallyZoomedId.push(zoomArr[i]);
              }
          }

          if (partiallyZoomedId.length > gDiff) {
              newId = partiallyZoomedId.join("-");
              gDiff = partiallyZoomedId.length;
          }
      });
      
      var extra = []; 

      idArr.forEach(function(id){
          if (newId.split("-").indexOf(id) == -1)
              extra.push(id);
      });

      cfg.zoomableTransition = idArrLength - partialZoomArrLength;
      
      id = newId; 

      var transition = 600;
      // We're going to need to update the cfg.zoomzooming in the final setTimeout function,
      // Need to work on stopping click events for pack when this is going on
      var zoomTimeOver = cfg.zoomableTransition;
      var zTime = 0;

      for (zTime, cfg.zoomableTransition, p = Promise.resolve(); cfg.zoomableTransition >= 0; cfg.zoomableTransition--){
          p = p.then(_ => new Promise(resolve =>{
              
              d3.select("#"+id).dispatch('drill')
              id += '-' + extra.shift();
              transition += 200;
              
              return setTimeout(function(){
                  if (zTime == zoomTimeOver)
                      cfg.zoomZooming = false;
                  
                  zTime++;
                  return resolve();   
              }, transition);
              
          }));
      }  
      
      cfg.zoomableTransition = 0;
   
  } else {
      id = originalId;
      d3.select("#"+id).dispatch('click', function(){
          cfg.change = cfg.change + 1;
      });
  }

  return 1;
}
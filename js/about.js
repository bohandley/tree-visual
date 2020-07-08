function gotoAbout()
{
  let hiddenElementsName = "#textWidthDiv, .loading-wrapper, #topNav, #mainDiv, .introjs-hints";
  // clear body (hide all body's children)
  $(hiddenElementsName).hide();

  // create new gloabl div
  let globalDiv = $("<div id='globalDiv'><div>");
  // append to body
  $("body").append(globalDiv);
  // load html
  globalDiv.load("about.html");

}


function backfromAbout()
{
  let hiddenElementsName = "#textWidthDiv, #topNav, #mainDiv, .introjs-hints";

  let globalDiv = $("#globalDiv");
  globalDiv.remove();

  $(hiddenElementsName).show();
}

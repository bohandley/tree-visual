01/16/2020: 1hr 
	set up
	analysis
	compare to graph visual
	check on options for tree graph connections with click events

1/30/2020
  6:19pm - 9:19pm
  	Begin connecting graphs. Zoom in zoomable treemap zooms in pack
  		-add unique id for each circle or square
  		-fire click event
  		-how to ensure they are the truly unique ids?
  			debug similar children names

2/1/2020
	5:00pm-6:00pm
	10:30pm-11:30pm
		Build recursive function to build the unique id for the circle graph

2/2/2020
	9:00pm-11:00pm
		Begin building on the "click pack graph, zoom in on zoomable tree"

2/3/2020
	6:00pm - 8:00pm
		Begin building full algorithm to identify what hidden ids in
		zoomable can be connected to pack ids.
			-zoom in on pack with hidden zoomables, expose zoomables

2/5/2020
	5:30pm to 7:30pm
		Iterate, drill down into zoomable treemap ids

2/9/2020
	1:00pm-5:30pm
	Drill up through zoomable tree map when clicking
		same node in pack view
		white background in pack view

2/13/2020
	5:30 to 9:30
		debug and solve issue of multiple firings when zooming
		prevent click events when the zoomable tree is 
			drilling down
			drilling up
		

2/16/2020
	2:00pm-5:00pm
		debug and solve issue of not firing corectly after changing selection of graph
			pack view does not zoom correctly


2/17/2020
	6:00pm-10:00pm
		Build responsive radial tree graph
		Begin to pull out json asynch code in each graph to make a config
			so that the data can be adjusted.

2/19/2020
	7:30pm-10:30
		Do the json outside each graph drawing
		Build a config
		

2/20/2020
	8:30pm-10:00pm
		Refactor the zoomable tree response to the pack zoom
		Refactor the zoomable tree response to the pack root zoom

  Features:
  	-look into the errors with the mouseovers on certain graphs
  	-build object or config for full graphs containing zoomzoomin, c, etc
  	-reset the graphs every time a new on is selected
  	-reset the zooming in progress if a new graph is selected


  	-build up brushing and linking
  		highlight one, get the other
  	-Interface on right
  		focus on certain year
  		slider or control

  	-Tree graph is not responsive
  		collaspible tree - LOOK AT PerformanceVis
  		control to help dense views
  		--MAKE COLLAPSIBLE TREE 
  		--MAKE NON COLLAPSIBLE TREE 
  			add select for these
  			only allow non collapsible to compare to Treemap(grids)

  	-Connect graphs
  		sunburst selection explore hierarchy
  		zoomable tree graph

  	X-Change name of circle view to packview

  	-Click on one, synchronize the other if zoomable
  		NEED to fincish pack and zoomable, in pack if click on other node, cross node
  			NEED TO ZOOM OUT THEN ZOOM IN

  	-Onboarding
  		Brief introduction if first view, 1,2,3,4...

  	-Create about pages in top right like graphVis
  		same topics
  		same styling

  	-New data sets
  		departments at ND
  		tree of life
  		FIND A MEDIUM SIZE DATA SET
  		not too large
  		consider computer speed and ability

  	-TESTING
  		mac
  		linux

  	-Quiz component


  	-How does graphVis do it?
  		linking and brushing
  		connecting the two viewed graphs on click
  		connecting the slider in the control panel





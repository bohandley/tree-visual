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

2/25/2020
	6:30pm-11:30pm
		Build zooming capability to zoom out and zoom in to parallel branches
		Refactor zoomable tree response to pack view

2/26/2020
	6:30pm-11:30pm
		Build responsive zooming into tree and zoomable tree
		Begin building resposive zooming into tree and pack
		Refactor responsive zooming to add id that corresponds to view

2/27/2020
  9:00pm-11:00pm
    Connect pack and responsive radial tree zooming
    Build new function for tree to respond to pack

3/3/2020
  6:00pm-11:00pm
    Debug pack and responsive radial tree zooming
    Debug zoomable tree and responsive radial tree
    Build select for tree graph(regular and responsive radial)

3/4/2020
  6:30pm-10:30pm
    Debug zoomable tree and collapsible tree
      need to add capability for clicking on zoomable tree and opening up multiple tree nodes
    Complete select for the responsive tree and normal tree
    Begin creating "clicked node: " that updates when a node is clicked

3/5/2020
  5:50pm-9:30pm
    Complete ZT and CT open up multiple nodes in CT when ZT is clicked
    Debug ZT and CT interaction when CT node is clicked

3/6/2020
  1:30pm-5:30pm
  Document zoomable tree function, zoomindrill and zoomoutdrill in 
  preparation for refactoring and building the new zooming functions for sunburst

3/9/2020
  5:30-10:30pm
  refactor ZT and P view to simplify the finding of the zoomin path and the timeout zooming

3/10/2020
  4:30pm-6:30pm
  8:00pm-10:30pm
  Fix bug with CT and ZT that had to do with it appearing to click
  the previous node(used for pack) 
  Complete responsiveness with CT & ZT, CT & P, and ZT & P

3/11/2020
  5:30pm-8:30pm
  Found bug in CT and P
    click CT year 1987, click CT [J], click CT year 1987, click P 1987-[J]-Other,
    starts to expose CT again, node by node, opens all node path by first click, 
    clicks the next node which closes the CT path, breaks

3/19/2020
  8:00pm-11:00pm
  -v remove tree dropdown and make another select option for radial tree
  -v add class to the clicked node on all graphs 
      v added class
        change the border or give an indication that the selected node is selected
        what about nodes that haven't been exposed yet?
          need to wait until they're exposed to add the class
  -bug: CT and Pack, open path to leaf in CT, open a second path to leaf, in pack jump
    -to the first leaf(in another branch from root) and it closes the leaves

3/26/2020
  9:00pm-11:30pm
    POSSIBLE WORK TODAY
    -build up brushing and linking
      ZT and CT done!
      ***BUGs: fill in empty, fill in the leaf ids
        SOLVE by filling in all " " with data, some name!
        fill in the leaf ids
      why is collapsible tree not highlighting?
        the id is on g, but the circle needs to be highlighted
      How does the ZT highlight and get highlighted
      highlight one, get the other
      the clicked node is identified by contrasting color***
    
3/28/2020
  9:00-11:00pm
    Complete CT highlighting with all other maps, done!

3/29/2020
  10:00am-5:00pm
    refactor getColor(d, color) to handle d.data.name, done!
    Complete all mouseover and mouseout event handling linkings all graphs, done!

87hrs

5/14/2020
  6:00pm-9:00pm
    begin building the treeLib module
    refactor the pathId function
    add the treeLib pathId to zoomable tree

5/18/2020
  7:30pm-10:30pm
    buildConfig()
    updateConfig()
    think through the type, id, pathRestr, exposedNodes
    NOW NEED TO add callback!

5/19/2020
  5:30pm-8:00pm
    refactor adding the g1 or g2 to the id
    adding the position as a class allows us to get around that g or circle selectall
    begin adding linkedClick to zoomable tree and collapsible tree
    
5/20/2020
  4:30pm-8:30pm
    refactor getColor() to not need to look for "flare"
    Fixed the issue with authors names
    Build the correct function between zoomable treemap and collapsible tree
      one way from zoomable treemap to collapsible tree

5/21/2020
  4:30pm-9:30pm
    Build almost all of the functioning from collapsible tree to zoomable treemap

5/22/2020
  4:30pm-8:30pm
    Complete all functioning of collapsible tree and zoomable treemap
    Begin building zoomable tree and pack functioning

5/24/2020
  12:00pm-5:00pm
    begin work on pack and zoomable tree
    complete most, debugg zooming back

5/25/2020
  8:00pm-11:00pm
    complete all work on pack and zoomable tree

5/26/2020
  7:00pm-11:30pm
    begin work on sunburst and zoomable tree
      sunburst needs the color for the return button to be the same
      debugg highlighting, ZT is displaying two nodes

5/28/2020
  4:30pm-8:00pm
    complete work on sunburst and zoomable tree
    begin work on collapsible tree and sunburst
      debug closing nodes when moving to other branches
      do we want to close when we zoom back to the node?
      we could show all the nodes???

5/29/2020
  4:30pm-8:30pm
    do we show all the nodes in collapsible tree for things like the sunburst, pack?
      it gets very busy
    solve leaf issue with long node names
    display leaf name shortened(not tooltip) in:
      colapsible tree, zoomable treemap, radial tree, and pack
    complete one way event linking with collapsible tree and sunburst
    complete one way linking from sunburst back to collapsible tree
    fix the highlighting with the leaf issue

6/6/2020
  7:00pm-10:00pm
    restrict sunburst to cetain levels for ZT and CT
      only for root and traveling away and back to root

6/7/2020
  10:00am-11:00pm
  8:30pm-10:00pm
    Consider restricting Sunburst on CT as we expand the paths for CT
      show one level more but do not click on the node... 
      How can we show what needs to be shown by the node that was clicked?
      Currently we show the whole path but collapsible tree may show a partial path
      Collapsible tree would then have to everything in a child of root
      Sunburst: show level by what is exposed in CT
      CT: show all nodes exposed for a branch if paired with sunburst?

      ON CLICK OF SUNBURST if >3 do not click action, click to 3 and expose another level

6/8/2020
  7:30pm-11:00pm
  To reset sunburst to new behavior
    preventEvent()
    clickActionCTSunburst()
    restrictOnReturn() levels 2

6/16/2020
  4:30pm-
    show only exposed nodes from sunburst that correspond 
      to the exposed nodes in CT, i.e. hide nodes in sunburst even though they are on the page
      Where can we do the visibility hidden?
      
5/ /2020 NEED TO REFACTOR THAT LEAF THING
Next
  -pass json into the build functions
      filter json with slider or select?
    -Interface on right
      focus on certain year
      slider or control
    CT = collapsible tree
    ZT = zoomable tree
    P = pack
    -
    **BUG with CT: clicking on a leaf node. This breaks responsiveness with ZT abd Pack
      Fixed 3/6 with not allowing click events to proceed from CT with ids including 'leaf'
    -
    Need to work out 
      CT clicks the same one to close and P zooms out
        repeated node clicks, or highlight the certain node and display?
      What about clicking on the leaves of the CT?
        the node's children are collapsed
          do we compare the node to the root to get the entire leaf path to see if it's a leaf?
          Can we create am isLeaf function?
      completed 3/5- What if a CT is closed but it had previously been clicked and the ZT is displaying that node?
        Can we re-open the CT nodes?
      highlight node in other graph as drill zooming
    -
    **click the collapsible tree node to close it and zoomable tree responds 
        by zooming to the clicked node <- XXX incorrect!
          it does do this. click year in CT and ZT shows year as parent and nodes as chilcdren
    -
    **sunburst responsive zooming with ct, zt, pack
    **same color for root of zommable tree and sunburst
    **same for collapsible tree root too!
    **select new node, reset as the new root
  Features:
  	-look into the errors with the mouseovers on certain graphs
  	-build object or config for full graphs containing zoomzoomin, c, etc
  	-reset the graphs every time a new on is selected
  	-reset the zooming in progress if a new graph is selected**


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





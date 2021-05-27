## Treevisual TODO Tracking List

### 2021 Todo list

### May/June

#### Onboarding

- [X] the graph -> the tree
- [X] the graph layout -> the tree layout
- [X] accumulated leaf size data -> accumulated attribute values of leaves
- [X] the graph drawing -> the tree drawing
- [X] Filter nodes by parents in leaves between the root and the leaves. -> Prune tree branches based on the labels of intermediate nodes. 
- [X] to highlight, and adjust the unselected part's opacity. -> to highlight. Automatically adjust the unselected nodes' opacity.  

#### About Page

- [X] All changes from email on 4/8/21
- [X] The onboarding function should show up automatically only when a user uses the program for the first time. If the user revisits the program, then he/she can activate this by clicking on 'help?'.
createSelectionSelectPicker
	gives a title to the options in the original html before instantiating the seletpicker
	creates the leafGlobals
	figure out the disabled
	resort the leaf globals from the disabled
	then create the li titles
#### Dropdown box

- [ ] The dropdown box often shows (...) at the end for some entries. Sometimes, there are no additional characters there so "..." is unnecessary. In other cases, when the length of the box is long, we only use a fraction of it with "..." showing, which is not desired. 
- [X] sort and alphabetize titles

####  Datasets
Could you go over the data so that they are formatted consistently? The problems I see so far are:

- [ ] publication/citation data: 
	- [ ] Some publications capitalize every single character, some capitalize the first character of the first word, and some capitalize each word's first character. In general, we can do the following: only capitalize the first character of the first word. Exceptions are: if there is a ':' then the first character of the next word is capitalized as well. For special terms, we capitalize them as well. Using my publications as examples: 
	- [ ] In situ visualization for large-scale combustion simulations (only capitalize the first character of the first word)
	- [ ] Parallel hierarchical visualization of large time-varying 3D vector fields
	- [ ] (3D is a special term, 'D' should be capitalized)
	- [ ] TransGraph: Hierarchical exploration of transition relationships in time-varying volumetric data
		- [ ] ("TransGraph" is a special term, so 'G' is capitalized as well. 'H' in "Hierarchical" is also capitalized since "Hierarchical" is right after ':')
	- [ ] If you have doubts or are unsure about some publication titles, please send them to me for an edit. 

- [ ] government data: 
	- [ ] Canada: I found typos (Branche, Fedral) in Level 1 (Governer) in Level 2; Repeated entries in Level 2 (Governer General, Judicial/Judiciary, Legislative); Level 2 and Level 3 both have the same entries (Governer/Governor General). In the leave nodes, I found the same entries (House of Commons/House of commons), "Senate(" should be "Senate (". Filtering shows five levels, while the data description shows four levels. I also question if the data are actually correct (where is the source of data?
	- [ ] Philippines: Executive branch -> Executive Branch (do the same for other entries). I did not check other issues as the Canada data set, but I see they could happen here as well. 
	- [ ] I did not check UK and US data. 
	- [ ] I would suggest we go over each government data set and check carefully. 

- [ ] trade data:
	- [ ] Capital goods -> Capital Goods (do the same for other entries). 

- [ ] tree of live data:
	- [ ] I cannot tell most names there, but it would be good to see if any of the issues we found for the rest of three categories (publication/citation, government, trade) of data sets remain here as well. If yes, please correct them.


### April
- [ ] fix title bug in pink treemap
- [ ] use different browser to see if sort with different browser, chrome, safari, firefox
- [ ] go through label in government, spelling check
- [X] more colors? schemeCategory20


### 2021 March
- [X] update about page
		- [ ] leave the reference out for now, is there anything we can add in
- [X] do the help, onboarding 

- [X] break the "selected node" text, add "=>" or " " to show the level
	- [X] use smaller font, spaces
	- [X] consistent format, 
- [X] for title in treemap, have a line break between levels 
	one line using arrows
- [X] space for tree of life datasets "name (description)"
- [ ] can we do transition on filter?
- [X] remove proportional node size, default, always on
	- [X] remove the lock icon, because we have the implicit lock
- [X] remove squarify tiling strategy for the tree map, leave binary
- [X] grey out the # key for size by # 
- [X] broke filter when removing lock, fix this
- [X] only load the visualization that has changed, not both
- [ ] get size value for government employees
- [X] take out color that is similar to white grey root color
- [X] pick a color for highlighting nodes in radial tree doesn't clash, use similar color for edges
- [X] Number of 1mil USD -> Number of USD (Million)
- [X] We should order (e.g., alphabetical) items shown in the Selection dropdown list to help users make the selection.
- [X] Remove highlighting For zoomable treemap, when mouse over the root, no need to bold the label's font.
- [X] Make all dropdown lists' actual width, not just optons widths as wide as possible when the browser's window is resized. 
- [X] zoomable treemap size is 0 for all node sizes, fix in display
- [X] Publication data, [R] [J] [C], what [R] stands for? If it means "Other", we should use [O] maybe?
- [ ] levels 2 and 3 in the filter
- [ ] data cleaning for government

When you switch between for example, # Papers to # Citations, make sure '#' in # Papers also gets the gray color. Do the same for all data sets. 

When I show any government data, with a Sunburst view, the switching from # Branches to # Employees creates inconsistency (I guess this is because there is no employee number data as "Number of employees" label shows 0 / 0). 

For trade data, import data should use a color rather than gray for non-root nodes, currently, they are not quite distinguishable in tree layouts. 

For all tree nodes, using black color for the node's boundary would look clearer. 

Number of 1mil USD -> Number of USD (Million)



We should order (e.g., alphabetical) items shown in the Selection dropdown list to help users make the selection.



For zoomable treemap, when mouse over the root, no need to bold the label's font.



Make all dropdown lists' widths as wide as possible when the browser's window is resized. 



Make "Proportional Node Size" default and remove the toggle. 



Make "Lock" feature default and remove both icons from the interface. 



Zoomable treemap, when showing a leaf node, it is not clickable, the label shown at the bottom of the screen does not display leaf node info. Regular treemaps have no such problem. 



Publication data, [R] [J] [C], what [R] stands for? If it means "Other", we should use [O] maybe?



If possible, consider only updating the view that has been changed or needs change. For example, if I switch from Sunburst to Treemap on the left visualization panel, only the left panel should be updated. 




### 2021-01-13 testing comments

### Firebox as the browser

#### General Issues

- [X] When I first visit the website, one of the two visualization panels does not show up. I need to reload the page or switch to a different visual form (e.g., Pack -> Radial Tree) to bring up the visualization. 
	- [ ] add a loading gif
- [ ] The first time I tried "Color Blind Palette", it took quite a while to apply. 
- [X] When I switch between data sets in different types, the visualization panels do not update well, I have to refresh again to get it right. 
- [X] When "Proportional Node Size" is on, changing "Node Size" does not take effect, until I switch back and force "Proportional Node Size". 

 
- [ ] Hint for the lock icon: 
	- [ ] "Check to store the most recent layout chosen (data-specific layouts not supported)" -> "Check to store the most recent layout chosen" (I thought the bracket is only for GraphVisual)

- [X] Hint for "Size by #???/???"
	- [X] "Display Value by Accumulated Leaves or Size" -> "Display node size based on given quantity"

- [X] Hint for "Remove Text"
	- [X]"Reduce the length of text displayed in visualizations" -> "Hide node labels"
	- [X] "Remove Text" -> "Hide Label"

- [X] Show the full label of each leaf node in the tooltip when mousing over the displayed items under "Leaves". 
- [X] Show the full label of the data subset parents in the filter selects title
- [X] The section of leaves does not clear itself when the visualizations are reloaded or refreshed by other interactions (the visualization does not show the selected nodes but the "Leaves" box does).



#### Publication Data Sets

- [X] "Size by #Papers/Citations" -> "Size by # Papers / # Citations"

- [ ] Description:
	- [X] "The visualization is showing John Stasko's publications from 1987 to 2017." -> "The tree shows John Stasko's publications from 1987 to 2017." (do the same for other data sets)

- [ ] Source:
	- [X] Microsoft Academic Graph & Google_scholar -> Microsoft Academic Graph & Google Scholar

- [X] Filtered Papers/Total Papers: -> Number of papers (displayed / total):
- [X] Filtered Citation/Total Citations: -> Number of citations (displayed / total):
- [ ] I saw node labels like "522/NaN".


#### Government Data Sets===

- [X] "Size by #Branches/Employees" -> "Size by # Branches / # Employees"
- [ ] When I switch to # Employees, the visualization does not show up correctly (for Pack, Sunburst, Treemap, or Treemap (zoomable) layout). I guess we do not have the employee data? Do we?

- [ ] Description:
	- [X] "The visualization is showing the government structure of Canada." -> "The tree shows the government structure of Canada." (do the same for other data sets)

- [ ] Tree hierarchy: 
	- [ ] Should they be all the same (First Level to Fourth Level) regardless of which country is chosen?

- [X] Filtered Branches/Total Branches: -> Number of branches (displayed / total):

- [X] Should we have "Number of employees (displayed / total)" as well?

- [ ] We need to check node labels carefully, for example, US government data, I saw "The Supreme Court of The" (removing "The" at the end) "United States" (missing something at the end)
- [ ] I suggest we correct this in the data file directly in one careful pass.


#### Trade Data Sets

- [X] "Size by #Countries/Thousands" -> "Size by # Countries / # 1,000 USD"

- [ ] Description:
	- [X] "The visualization is showing China's trade data." -> "The tree shows China's trade data in 2018." (do the same for other data sets)
	- [X] Filtered Import/Export Countries/Total Import/Export Countries: -> Number of countries (displayed / total):
	- [X] Filtered Volume/Total Volume of Import/Export ($ Thousand): -> Number of 1,000 USD (displayed / total):

- [ ] The above two labels do not seem to update as I add filtering.
	***They do update but the number of countries is only by unique countries 
- [ ] I saw node labels like "19,909,491/NaN". 


#### Tree Taxonomy Data Sets

- [X] Could we also have four data sets here like the other types of data? So, we could have 16 in total?

- [X] "Size by #Species/#Species" -> "Size by # Species in Truncated / Full Taxonomy"

- [ ] Display either "Size by # Species in Truncated Taxonomy" or "Size by # Species in Full Taxonomy"

- [ ] Description:
	- [X] "The visualization is showing Archaea's tree taxonomy." -> "The tree shows the taxonomy of Archaea." (do the same for other data sets)
	- [X] Filtered Species/Total Species: -> Number of species in truncated taxonomy (displayed / total):
	- [X] Filtered Species/Total Species Covered in Taxonomy: -> Number of species in full taxonomy (displayed / total):

- [ ] I saw node labels like "35/NaN". 



#### Menu: Selection, add and include the following

- [X] Add dropdown with “Leaf Nodes”
	- [X] multiselect
	- [X] Collection of all leaf nodes
	- [X] Disable or deactivate leaf nodes that are filtered out
	- [X] Select by leaf and if id is repeated, select all

- [x] Remove cluster EK

#### Filtering on Data Selection

- [ ] Distinct about what we trim on initial view 
	- [ ] for example, don’t trim the author, 
	- [ ] don’t trim if the browser can handle it

#### Bugs

- [X] Tree taxonomy select text is too wide, stretching options and not visible
- [X] Size by country in trade value is incorrect 
	- [X] label or country is not unique, so showing this in the count?
	- [X] This is repeated in import and export, i.e., U.S. happens multiple times
- [ ] Replicate this! Bug switch from tree to author, greyed Sunburst
- [X] Header accumulated leaves, show the count after the filter or on initial display with filter
	- [X] Number of total leaves, total value display
- [X] Include actual colorblind palette
	- [X] use from PerformanceVis


#### Data set adjustment

- [ ] Tree Taxonomy is too big, reduce size
- [ ] Get number of employees from google for government

#### Formatting 

- [ ] Trade value is in dollar amount or dollars
- [X] Show the number displayed versus the filtered displayed
	- [X] displayed leaves / total leaves
	- [X] displayed value / total value
  - [X] I.e. number of papers displayed/total, just like graph visual

#### Visual hint to give users a clue on prefiltering
- [ ] Show a red dot in the top right corner to have a hint like graph viz
	- [ ] “We’ve already done some pre-filtering for you

#### Linking behavior

- [X] In leaf node list, highlight all the leafs with similar names?



### (2020 list below, archived, thank you Haobin!)
### Page structure & style

#### Header

- [x] Change Info position from left to right
- [x] Change title bar height to match GraphVisual
- [x] Move path string to the bottom



#### Tree Visual Section

- [x] Sort layout option alphabetically
- [ ] Change node tooltip style to match GraphVisual
- [ ] ~~Edge thickness of radial tree~~



#### Sidebar Panel

- [x] Data source grouping by data type
- [x] Change description font style to match GraphVisual
  - [x] Sync description text with current data source
- [x] Change switch style from checkbox to round switch
- [x] Slider tooltip (title & slider button)
- [ ] ~~Disabled slider's style is not correct~~
- [ ] Node size slider is not synced at startup
- [ ] Filtering panel not shown completely (under graph panel)
- [x] Filter preset
- [ ] ~~Filter bug when switching dataset~~
- [x] Color blind palette
- [x] Edge thickness (move to radial tree)



#### Miscellaneous

- [x] Page flickering on some browser when point to tree nodes, According collapsing or expansion 





### Tree Visual

- [x] Fix (size => value) function in zoomable treemap
- [x] Fix zoomable tree map click event
- [x] Trim the tree of life dataset



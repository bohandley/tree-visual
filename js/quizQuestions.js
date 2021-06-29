// dataSets
// Faloutsos
// Han
// Stasko
// Leskovec
// Gov_Canada
// Gov_Philippines
// Gov_United_Kingdom
// Gov_United_States
// Trade_China
// Trade_Germany
// Trade_United_Kingdom
// Trade_United_States
// TreeOfLife_Anura
// TreeOfLife_Carnivora
// TreeOfLife_Pelecaniformes
// TreeOfLife_Afrosoricida

const quizQuestions =
{
    "quizId": "tree_quiz",
    "questions": [
        {
        		"id": 1,
            "options": [
                "14 and 3",
                "37 and 65",
                "59 and 26",
                "46 and 11"
            ],
            "tree": {
                "layouts": [
                	// update the layout select to only allow the following tree layouts
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	"Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "YIFAN_HU"
                ],
                // select the dataSet
                "dataSet": "Faloutsos",//""//"Cat Brain"
            },
            "text": "Assuming that the edge length in the drawing represents the length of a fiber tract, which two nuclei are the farthest apart?",
            "type": "radio",
            "answer": "59 and 26"
        },
        {
        		"id": 2,
            "tree": {
                "layouts": [
                    // "FORCE_ATLAS",
                    // "OPENORD"
                    "Radial_Tree"
                ],
                "dataSet": "Han",//"Cat Brain"
            },
            "text": "Which of the following two layouts (ForceAtlas2, OpenOrd) is better when depicting the Cat Brain data set? Briefly explain.",
            "type": "text",
            "answer": "Force atlas is better as it keeps the clusters better together and spreads the nodes more evenly."
        },
        {
        		"id": 3,
            "options": [
                "1",
                "2",
                "3",
                "4"
            ],
            "tree": {
                "dataSet": "Stasko",//"Divorce",
                "layouts": [
                		
	                	"Pack",
	                	// "Radial_Tree",
	                	// "Collapsible_Tree",
	                	"Sunburst",
	                	"Treemap",
	                	"Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "How many states have every legal ground for divorce?",
            "type": "radio",
            "answer": "1"
        },
        {
        		"id": 4,
            "options": [
                "Delaware",
                "Hawaii",
                "Louisiana",
                "Wisconsin"
            ],
            "tree": {
                "layouts": [
                  "Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Leskovec",//"Divorce"
            },
            "text": "Among the states listed below, which state does not have the same legal grounds for divorce as others?",
            "type": "radio",
            "answer": "Louisiana"
        },
        {
        		"id": 5,
            "options": [
                "Connecticut",
                "Idaho",
                "Oklahoma",
                "Utah"
            ],
            "tree": {
                "layouts": [
                 //  "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Gov_Canada",//"Divorce"
            },
            "text": "Among the states listed below, which state has fewer legal grounds for divorce than others?",
            "type": "radio",
            "answer": "Utah"
        },
        {
        		"id": 6,
            "tree": {
                "dataSet": "Gov_Philippines",//"Divorce",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "What are the pros and cons of the bipartite layout when depicting the Divorce data set? Briefly explain.",
            "type": "text",
            "answer": "It is clearly seen which nodes are states and which are legal grounds in the bipartite layout, however, their connections is harder to see due to the occlusion of all the edges. "
        },
        {
        		"id": 7,
            "options": [
                "DN63",
                "Web",
                "Zig",
                "Zipfel"
            ],
            "tree": {
                "layouts": [
                 //  "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Gov_United_Kingdom",//"Dolphins"
            },
            "text": "Which node is the most distinct one in the spectral layout?",
            "type": "radio",
            "answer": "Zig"
        },
        {
        		"id": 8,
            "tree": {
                "dataSet": "Gov_United_States",//"Dolphins",
                "layouts": [
                	"Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	"Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "What are the pros and cons of the spectral layout when depicting the Dolphins data set compared to the other layouts. Briefly explain.",
            "type": "text",
            "answer": "In the Spectral layout, the nodes are squished together (except for light blue cluster), which disallows to see the connections among nodes outside the light blue cluster. However this also helps to identify that nodes of that cluster are not related with the ones of the other clusters."
        },
        {
        		"id": 9,
            "options": [
                "42",
                "80",
                "60",
                "38"
            ],
            "tree": {
                "dataSet": "Trade_China",//"Enron Email",
                "layouts": [
	                "Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "Among all the employees, the one with the most contact has how many contacts?",
            "type": "radio",
            "answer": "42"
        },
        {
        		"id": 10,
            "options": [
                "23 and 92",
                "42 and 92",
                "80 and 92",
                "134 and 92"
            ],
            "tree": {
                "layouts": [
                  "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                ],
                "dataSet": "Trade_Germany",//"Enron Email"
            },
            "text": "Which two nodes have the longest path (along graph edges) in the spectral layout?",
            "type": "radio",
            "answer": "42 and 92"
        },
        {
        		"id": 11,
            "options": [
                "15-25%",
                "35-45%",
                "55-65%",
                "75-85%"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Anura",//"Naval",
                "layouts": [
                	// "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "What percentage of naval bases have connections with at least 8 other bases?",
            "type": "radio",
            "answer": "55-65%"
        },
        {
        		"id": 12,
            "tree": {
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "FM_3",
                    // "SPECTRAL"
                ],
                "dataSet": "Trade_United_Kingdom",//"Naval"
            },
            "text": "Which of the following two layouts (FM3, spectral) is better when depicting the Naval data set? Briefly explain.",
            "type": "text",
            "answer": "There is no clear favorite. The Fm3 allows seeing the structure better, while the spectral layout allows to see that nodes within a clusters are barely connected to nodes outside that cluster."
        },
        {
        		"id": 13,
            "tree": {
                "layouts": [
                	"Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "FORCE_DIRECTED",
                    // "YIFAN_HU",
                    // "OPENORD"
                ],
                "dataSet": "Trade_United_States",//"Netscience"
            },
            "text": "Among the force-directed layouts, which is the best in depicting the Netscience data set? Briefly explain.",
            "type": "text",
            "answer": "The D3 force directed layout is the clear favorite as it keeps the clusters nicer together"
        },
        {
        		"id": 14,
            "tree": {
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "OPENORD",
                    // "YIFAN_HU"
                ],
                "dataSet": "TreeOfLife_Carnivora",//"Netscience"
            },
            "text": "Briefly explain the main similarities and differences between OpenOrd and Yifan Hu layouts when depicting the Netscience data set. ",
            "type": "text",
            "answer": "Both of the layouts do not keep clusters together. OpenOrd, however, overlaps the nodes so strong that its barely visible that there are as many nodes"
        },
        {
        		"id": 15,
            "options": [
                "Chicago O'hare Intl",
                "Dallas/Fort Worth Intl",
                "Lambert-St Louis Intl",
                "The William B Hartsfield Atlan"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Afrosoricida",//"USAir97",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "Which airport has the most direct flights to and from other airports?",
            "type": "radio",
            "answer": "Chicago O'hare Intl"
        },
        {
        		"id": 16,
            "options": [
                "Chicago O'hare Intl",
                "Los Angeles Intl",
                "San Francisco Intl",
                "Seattle-Tacoma Intl"
            ],
            "tree": {
                "layouts": [
                	"Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
                    // "extra"
                ],
                "dataSet": "TreeOfLife_Pelecaniformes",//"USAir97"
            },
            "text": "From Anchorage Intl to Pago Pago Intl, which of the following airport  should be used for transferring so that the number of legs is minimized?",
            "type": "radio",
            "answer": "Los Angeles Intl"
        },
        {
        		"id": 17,
            "tree": {
                "dataSet": "TreeOfLife_Afrosoricida",//"USAir97",
                "layouts": [
                	// "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                    // "RANDOMIZED",
                    // "CIRCULAR",
                    // "SPECTRAL",
                    // "FORCE_DIRECTED",
                    // "FM_3",
                    // "FORCE_ATLAS",
                    // "OPENORD",
                    // "YIFAN_HU"
                ]
            },
            "text": "What are the pros and cons of the geographical layout when depicting the USAir97 data set? Briefly explain.",
            "type": "text",
            "answer": "The geographical layout allows to use previous knowledge to find specific nodes. It also gives meaningful order into the nodes, however it doesnt reveal the connections very well."
        },
        // WHAT TO DO WITH THESE THAT DON'T INCLUDE A LAYOUT???
        // {
        // 		"id": 18,
        //     "text": "In a force-directed graph drawing, what does a long edge indicate?",
        //     "type": "text",
        //     "answer": "A long edge means a repulsive force that is much higher than the attracting force between the two nodes the edge connects."
        // },
        // {
        // 		"id": 19,
        //     "options": [
        //         "FM3",
        //         "Random",
        //         "ForceAtlas2",
        //         "OpenOrd"
        //     ],
        //     "text": "Which of the following are force-directed layouts?",
        //     "type": "checkbox",
        //     "answer": [
        //         "FM3",
        //         "ForceAtlas2",
        //         "OpenOrd"
        //     ]
        // },
        // {
        // 		"id": 20,
        //     "options": [
        //         "Circular",
        //         "OpenOrd",
        //         "Spectral",
        //         "Yifan Hu"
        //     ],
        //     "text": "Which of the following are not force-directed layouts?",
        //     "type": "checkbox",
        //     "answer": [
        //         "Circular",
        //         "Spectral"
        //     ]
        // },
        // {
        // 		"id": 21,
        //     "text": "In a force-directed layout, what is the name of the force that counterbalances the repulsive force?",
        //     "type": "text",
        //     "answer": "Attractive force"
        // },
        // {
        // 		"id": 21,
        //     "options": [
        //         "Adjacency matirx",
        //         "Laplacian matrix",
        //         "Graph eigenvalues of adjacency matrix",
        //         "Graph eigenvalues of Laplacian matrix"
        //     ],
        //     "text": "What is the spectrum of a graph called? ",
        //     "type": "radio",
        //     "answer": "Graph eigenvalues of adjacency matrix"
        // }
    ]
}

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
                "Court of Appeal",
                "Supreme Court",
                "Ontario Court",
                "Small Claims, Family Court"
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
                ],
                // select the dataSet
                "dataSet": "Gov_Canada"
            },
            "text": "On provincial level, which court is at the lowest level?",
            "type": "checkbox",
            "answer": "Small Claims, Family Court"
        },
        {
        	"id": 2,
            "options": [
                "Nation",
                "Province",
                "Municipality",
                "Autonomous Region",
                "Barangay"
            ],
            "tree": {
                "dataSet": "Gov_Philippines",
                "layouts": [
                    "Treemap",
	                "Pack",
	                // "Radial_Tree",
	                // "Collapsible_Tree",
	                "Collapsible_Tree"
                ]
            },
            "text": "Which branch of the Philippines Government has the highest number of employees?",
            "type": "radio",
            "answer": "Nation"
        },
        {
        	"id": 3,
            "options": [
                "Connecticut",
                "Idaho",
                "Oklahoma",
                "Utah"
            ],
            "tree": {
                "layouts": [
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Gov_United_States"
            },
            "text": "Which of the following three layouts (Sunburst, Treemap, Zoomable Treemap) is best at depicting the hierarchy of the United States Government?",
            "type": "text",
            "answer": "Sunburst or Zoomable Treemap"
        },
        {
        	"id": 4,
            "options": [
                "1997",
                "1998",
                "1987",
                "1991"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst"
                ],
                "dataSet": "Faloutsos"
            },
            "text": "Before the 21st century, on which year was Faloutsos most prolific in terms of number of papers?",
            "type": "radio",
            "answer": "1998"
        },
        {
        	"id": 5,
            "options": [
                "1997",
                "1998",
                "1987",
                "1991"
            ],
            "tree": {
                "layouts": [
                    "Pack"
                ],
                "dataSet": "Faloutsos"
            },
            "text": "What are the pros and cons of the pack layout when depicting the Faloutsos dataset?",
            "type": "text",
            "answer": "1998"
        },
        {
        	"id": 6,
            "options": [
                "Germany",
                "United States",
                "Singarpore",
                "Netherlands",
                "China"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Collapsible_Tree",
                    "Zoomable_Treemap"
                ],
                "dataSet": "Trade_United_Kingdom"
            },
            "text": "Which country is UK's second-largest exporter in capital goods?",
            "type": "radio",
            "answer": "Germany"
        },
        {
        	"id": 7,
            "options": [
                "4",
                "5",
                "6",
                "7"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                	"Collapsible_Tree",
                    "Zoomable_Treemap"
                ],
                "dataSet": "Trade_China"
            },
            "text": "How many countries (regions) are both China's importer and exporter in vegatable?",
            "type": "radio",
            "answer": "5"
        },
        {
        	"id": 8,
            "options": [
                "Agricultural Raw Materials",
                "Fuels",
                "Hides and Skins",
                "Mach and Elec",
                "Intermediate goods"
            ],
            "tree": {
                "dataSet": "Trade_Germany",
                "layouts": [
                	"Radial_Tree",
                	"Collapsible_Tree",
                    "Pack"
                ]
            },
            "text": "Which of the following kind of goods did Spain import from Germany in 2018?",
            "type": "radio",
            "answer": "Mach and Elec"
        },
        {
        	"id": 9,
            "options": [
                "4",
                "5",
                "6",
                "7"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst",
                    "Radial_Tree",
                	"Collapsible_Tree",
                    "Treemap",
                    "Zoomable_Treemap"
                ],
                "dataSet": "Trade_China"
            },
            "text": "Considering the features of hierarchy of trade datasets, which layout(s) is better at depicting the trade datasets?",
            "type": "text",
            "answer": "Pack, Collapsible Radial Tree, Zoomable Treemap"
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
                ],
                "dataSet": "Trade_United_Kingdom"
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
                ],
                "dataSet": "Trade_United_States"
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
                ],
                "dataSet": "TreeOfLife_Carnivora"
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
                "dataSet": "TreeOfLife_Afrosoricida",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	// "Sunburst",
                	// "Treemap",
                	// "Zoomable_Treemap"
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
                ],
                "dataSet": "TreeOfLife_Pelecaniformes"
            },
            "text": "From Anchorage Intl to Pago Pago Intl, which of the following airport  should be used for transferring so that the number of legs is minimized?",
            "type": "radio",
            "answer": "Los Angeles Intl"
        },
        {
        	"id": 17,
            "tree": {
                "dataSet": "TreeOfLife_Afrosoricida",
                "layouts": [
                	// "Pack",
                	// "Radial_Tree",
                	// "Collapsible_Tree",
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
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

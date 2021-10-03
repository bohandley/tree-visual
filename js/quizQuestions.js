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
        // {
        // 	"id": 1,
        //     "options": [
        //         "Court of Appeal",
        //         "Supreme Court",
        //         "Ontario Court",
        //         "Small Claims, Family Court"
        //     ],
        //     "tree": {
        //         "layouts": [
        //         	// update the layout select to only allow the following tree layouts
        //         	"Pack",
        //         	"Radial_Tree",
        //         	"Collapsible_Tree",
        //         	"Sunburst",
        //         	// "Treemap",
        //         	// "Zoomable_Treemap"
        //         ],
        //         // select the dataSet
        //         "dataSet": "Gov_Canada"
        //     },
        //     "text": "On the provincial level, which court is at the lowest level?",
        //     "type": "radio",
        // },
        // {
        //     "id": 2,
        //     "options": [
        //         "Supreme Court",
        //         "Superior Court",
        //         "Premiers",
        //         "Governor General",
        //         "Lieutenant Governors"
        //     ],
        //     "tree": {
        //         "layouts": [
        //         	// update the layout select to only allow the following tree layouts
        //         	"Pack",
        //         	"Radial_Tree",
        //         	"Collapsible_Tree",
        //         	"Sunburst",
        //         ],
        //         // select the dataSet
        //         "dataSet": "Gov_Canada"
        //     },
        //     "text": "Which of the following are Federal institutions?",
        //     "type": "checkbox",
        // },
        // {
        // 	"id": 3,
        //     "options": [
        //         "Nation",
        //         "Province",
        //         "Municipality",
        //         "Autonomous Region",
        //         "Barangay"
        //     ],
        //     "tree": {
        //         "dataSet": "Gov_Philippines",
        //         "layouts": [
        //             "Treemap",
	       //          "Pack",
	       //          "Collapsible_Tree"
        //         ]
        //     },
        //     "text": "Which branch of the Philippines Government has the most number of employees?",
        //     "type": "radio",
        // },
        // {
        //     "id": 4,
        //     "options": [
        //         "Government Publishing Office",
        //         "Architect of the Capitol",
        //         "Government Accountability Office",
        //         "Library of Congress",
        //         "Congressional Budget Office",
        //         "The Congress",
        //         "United States Botanic Garden"
        //     ],
        //     "tree": {
        //         "layouts": [
        //             "Treemap",
        //             "Pack",
        //             "Collapsible_Tree",
        //             "Sunburst"
        //         ],
        //         "dataSet": "Gov_United_States"
        //     },
        //     "text": "Which of the following institutions in the legislative branch of the United States has the most number of employees?",
        //     "type": "radio",
        // },
        // {
        // 	"id": 5,
        //     "tree": {
        //         "layouts": [
        //         	"Sunburst",
        //         	"Treemap",
        //         	"Zoomable_Treemap"
        //         ],
        //         "dataSet": "Gov_United_States"
        //     },
        //     "text": "Which of the following three layouts (Sunburst, Treemap, Treemap (Zoomable)) are best at depicting the hierarchy of the United States Government? Explain your answer.",
        //     "type": "text",
        // },
        {
            "id": 6,
            "tree": {
                "layouts": [
                    "Treemap",
                    "Radial_Tree"
                ],
                "dataSet": "Gov_United_Kingdom"
            },
            "text": "Briefly compare Treemap and Radial Tree in depicting the hierarchy of the United Kingdom Government. Which layout do you prefer?",
            "type": "text",
        },
        {
        	"id": 7,
            "options": [
                "Kronecker graphs: An approach to modeling networks",
                "Empirical comparison of algorithms for network community detection",
                "Signed networks in social media",
                "Predicting positive and negative links in online social networks",
                "On the convexity of latent social network inference"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst",
                    "Treemap",
                    "Radial_Tree"
                ],
                "dataSet": "Leskovec"
            },
            "text": "Among all Leskovec's publications in 2010, which paper is cited most?",
            "type": "radio",
        },
        {
        	"id": 8,
            "options": [
                "Mining big data to extract patterns and predict real-life outcomes",
                "Inferring person-to-person proximity using WiFi signals",
                "Psycho-demographic analysis of the Facebook Rainbow Campaign",
                "Higher-order organization of complex networks",
                "SNAP: A general-purpose network analysis and graph-mining library",
                "Improving website hyperlink structure using server logs"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst",
                    "Treemap",
                    "Radial_Tree"
                ],
                "dataSet": "Leskovec"
            },
            "text": "Among Leskovec's publications in 2016, which paper(s) are of type [J]?",
            "type": "checkbox",
        },
        {
        	"id": 9,
            "options": [
                "7",
                "9",
                "11",
                "13"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst",
                    "Treemap"
                ],
                "dataSet": "Stasko"
            },
            "text": "How many papers did Stasko publish in 2008?",
            "type": "radio",
        },
        {
        	"id": 10,
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
            "text": "Before the 21st century, on which year was Faloutsos most prolific in terms of the number of papers?",
            "type": "radio",
        },
        {
        	"id": 11,
            "tree": {
                "layouts": [
                    "Pack"
                ],
                "dataSet": "Faloutsos"
            },
            "text": "What are the pros and cons of the Pack layout when depicting the Faloutsos dataset?",
            "type": "text",
        },
        {
        	"id": 12,
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
            "text": "Which country is UK's second-largest exporter of capital goods?",
            "type": "radio",
        },
        {
        	"id": 13,
            "options": [
                "5%",
                "10%",
                "20%",
                "30%",
                "35%"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Collapsible_Tree",
                    "Sunburst"
                ],
                "dataSet": "Trade_United_Kingdom"
            },
            "text": "Among UK's import volume in 2018, at roughly what percentage did manufacture accounts for?",
            "type": "radio",
        },
        {
        	"id": 14,
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
            "text": "How many countries (regions) are both China's importers and exporters in vegatable?",
            "type": "radio",
        },
        {
        	"id": 15,
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
        },
        {
        	"id": 16,
            "options": [
                "Belgium",
                "China",
                "Netherlands",
                "Russian Federation",
                "United States",
                "United Kingdom"
            ],
            "tree": {
                "dataSet": "Trade_Germany",
                "layouts": [
                	"Pack",
                    "Sunburst",
                    "Radial_Tree",
                	"Collapsible_Tree",
                    "Treemap",
                    "Zoomable_Treemap"
                ]
            },
            "text": "Which countries export food <b>and</b> fuels to Germany?",
            "type": "checkbox",
        },
        {
        	"id": 17,
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
            "text": "Considering the features of the hierarchy of trade datasets, which layout(s) is better at depicting the trade datasets? Explain your answers.",
            "type": "text",
        },
        {
        	"id": 18,
            "tree": {
                "layouts": [
                	"Treemap"
                ],
                "dataSet": "Trade_United_States"
            },
            "text": "Is Treemap a good layout for depicting the United States trade dataset? Briefly explain.",
            "type": "text",
        },
        {
        	"id": 19,
            "options": [
                "13",
                "27",
                "66",
                "116",
                "176"
            ],
            "tree": {
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "TreeOfLife_Pelecaniformes"
            },
            "text": "How many subspecies does the Ardeidae family have?",
            "type": "radio",
        },
        {
        	"id": 20,
            "options": [
                "N.cinerea - Australian sea lion",
                "O.flavescens - South American sea lion",
                "A.philippii - Juan Fernández fur seal",
                "B.astutus - Ring-tailed cat",
                "N.olivacea - Western dwarf coati"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ],
                "dataSet": "TreeOfLife_Carnivora"
            },
            "text": "Which of the following species belong to the Otariidae family?",
            "type": "checkbox",
        },
        {
        	"id": 21,
            "options": [
                "Hyaenidae",
                "Canidae",
                "Mustelidae",
                "Felidae",
                "Procyonidae"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Carnivora",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Which of the following families have more than 30 species?",
            "type": "checkbox",
        },
        {
        	"id": 22,
            "options": [
                "Felidae, Viverridae",
                "Canidae, Viverridae",
                "Canidae, Canidae",
                "Viverridae, Felidae",
                "Mustelidae, Canidae"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Carnivora",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Find the family with the most number of species, and family with the most number of subspecies.",
            "type": "radio",
        },
        {
        	"id": 23,
            "options": [
                "Felidae",
                "Ursidae",
                "Mustelidae",
                "Canidae",
                "Procyonidae",
                "Viverridae"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Carnivora",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Which family does T.taxus - American badger belong to?",
            "type": "radio",
        },
        {
            "id": 24,
            "options": [
                "Pack",
                "Radial Tree",
                "Radial Tree (Collapsible)",
                "Sunburst",
                "Treemap",
                "Treemap (Zoomable)"
            ],
            "text": "Which of the following layout(s) explicitly shows the paths from the root to leaves?",
            "type": "checkbox",
        },
        {
            "id": 25,
            "options": [
                "Circle A is enclosed in circle B",
                "Circle B is enclosed in circle A",
                "Circle A intersects with circle B",
                "Circle A is tangent to circle B",
                "None of the above is true"
            ],
            "text": "In the Pack layout, if node B is node A's grandchild, which of the following is true about the circles for A and B?",
            "type": "radio",
        },
        {
            "id": 26,
            "text": "What is the benefit of Radial Tree (Collapsible) compared to Radial Tree?",
            "type": "text",
        },
        {
            "id": 27,
            "text": "Briefly compare the different ways Radial Tree and Pack use to indicate hierarchy.",
            "type": "text",
        }
        
    ]
}

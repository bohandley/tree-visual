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
        // {//**
        // 	"id": 1,
        //     "options": [
        //         "Ardeidae",
        //         "Threskiornithidae",
        //         "Pelecanidae",
        //         "Scopidae"
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
        //         "dataSet": "TreeOfLife_Pelecaniformes"
        //     },
        //     "text": "Which of the following families has the least amount of species?",
        //     "type": "radio",
        // },
        // {//**
        //     "id": 2,
        //     "options": [
        //         "1992",
        //         "1993",
        //         "1994",
        //         "1995",
        //         "1996"
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
        //         "dataSet": "Stasko"
        //     },
        //     "text": "In which of the following years did John Stasko publish eleven papers?",
        //     "type": "checkbox",
        // },
        // {//**
        // 	"id": 3,
        //     "options": [
        //         "Belgium",
        //         "France",
        //         "Hong Kong",
        //         "Ireland",
        //         "United States"
        //     ],
        //     "tree": {
        //         "dataSet": "Trade_United_Kingdom",
        //         "layouts": [
        //           "Radial_Tree",
	       //          "Pack",
	       //          "Sunburst"
        //         ]
        //     },
        //     "text": "Of the following countries, which does the United Kingdom export the most animal products to?",
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
        {//**
        	"id": 10,
            "options": [
                "2010",
                "2013",
                "2016",
                "2017"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                    "Sunburst"
                ],
                "dataSet": "Leskovec"
            },
            "text": "Between 2010 and 2017, on which year was Leskovec most prolific in terms of the number of papers?",
            "type": "radio",
        },
        {//**
        	"id": 11,
            "tree": {
                "layouts": [
                    "Pack"
                ],
                "dataSet": "Leskovec"
            },
            "text": "What are the pros and cons of the Pack layout when depicting the Leskovec dataset?",
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
        {//**
        	"id": 14,
            "options": [
                "5",
                "6",
                "7",
                "8"
            ],
            "tree": {
                "layouts": [
                  "Pack",
                	"Collapsible_Tree",
                  "Zoomable_Treemap"
                ],
                "dataSet": "Trade_United_Kingdom"
            },
            "text": "How many countries (regions) are both the United Kingdom's importers and exporters in vegatable?",
            "type": "radio",
        },
        {//**
        	"id": 15,
            "options": [
                "Animal",
                "Wood",
                "Vegetable",
                "Textiles",
                "Metals"
            ],
            "tree": {
                "dataSet": "Trade_United_Kingdom",
                "layouts": [
                	"Radial_Tree",
                	"Collapsible_Tree",
                  "Pack"
                ]
            },
            "text": "Which of the following goods did the United Kingdom import from Sweden in 2018?",
            "type": "radio",
        },
        {//**
        	"id": 16,
            "options": [
                "Brazil",
                "Canada",
                "China",
                "Hong Kong",
                "Philippines",
                "Colombia"
            ],
            "tree": {
                "dataSet": "Trade_United_States",
                "layouts": [
                	"Pack",
                    "Sunburst",
                    "Radial_Tree",
                	"Collapsible_Tree",
                    "Treemap",
                    "Zoomable_Treemap"
                ]
            },
            "text": "The United States exports food <b>and</b> fuels to which countries?",
            "type": "checkbox",
        },
        {//**
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
                "dataSet": "Trade_United_States"
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
        {//**
        	"id": 20,
            "options": [
                "P.rufescens - Pink-backed pelican",
                "P.ajaja - Roseate spoonbill",
                "T.melanocephalus - Black-headed ibis",
                "A.insignis - White-bellied heron",
                "B.lentiginosus - American bittern"
            ],
            "tree": {
                "layouts": [
                    "Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ],
                "dataSet": "TreeOfLife_Pelecaniformes"
            },
            "text": "Which of the following species belong to the Ardeidae family?",
            "type": "checkbox",
        },
        {//**
        	"id": 21,
            "options": [
                "Threskiornithidae",
                "Pelecanidae",
                "Ardeidae",
                "Scopidae",
                "Balaenicipitidae"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Pelecaniformes",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Which of the following families have more than 30 species?",
            "type": "checkbox",
        },
        {//**
        	"id": 22,
            "options": [
                "Neamblysomus",
                "Micropotamogale",
                "Amblysomus",
                "Hemicentetes",
                "Echinops"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Afrosoricida",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Which of the following genuses has the most subspecies?",
            "type": "radio",
        },
        {//**
        	"id": 23,
            "options": [
            		"Carpitalpa",
            		"Calcochloris",
            		"Chlorotalpa",
                "Chrysochloris",
                "Cryptochloris"
            ],
            "tree": {
                "dataSet": "TreeOfLife_Afrosoricida",
                "layouts": [
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                ]
            },
            "text": "Which genus does C.wintoni - De Winton's golden mole belong to?",
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

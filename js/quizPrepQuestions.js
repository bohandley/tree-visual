const quizPrepQuestions = {
    "quizId": "tree_quiz",
    "questions": [
        {//**
        	"id": 1,
            "options": [
                "Ardeidae",
                "Threskiornithidae",
                "Pelecanidae",
                "Scopidae"
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
                "dataSet": "TreeOfLife_Pelecaniformes"
            },
            "text": "Which of the following families has the least amount of species?",
            "type": "radio",
        },
        {//**
            "id": 2,
            "options": [
                "1992",
                "1993",
                "1994",
                "1995",
                "1996"
            ],
            "tree": {
                "layouts": [
                	// update the layout select to only allow the following tree layouts
                	"Pack",
                	"Radial_Tree",
                	"Collapsible_Tree",
                	"Sunburst",
                ],
                // select the dataSet
                "dataSet": "Stasko"
            },
            "text": "In which of the following years did John Stasko publish eleven papers?",
            "type": "checkbox",
        },
        {//**
        	"id": 3,
            "options": [
                "Belgium",
                "France",
                "Hong Kong",
                "Ireland",
                "United States"
            ],
            "tree": {
                "dataSet": "Trade_United_Kingdom",
                "layouts": [
                  "Radial_Tree",
	                "Pack",
	                "Sunburst"
                ]
            },
            "text": "Of the following countries, which does the United Kingdom export the most animal products to?",
            "type": "radio",
        },
        {
            "id": 4,
            "options": [
                "Government Publishing Office",
                "Architect of the Capitol",
                "Government Accountability Office",
                "Library of Congress",
                "Congressional Budget Office",
                "The Congress",
                "United States Botanic Garden"
            ],
            "tree": {
                "layouts": [
                    "Treemap",
                    "Pack",
                    "Collapsible_Tree",
                    "Sunburst"
                ],
                "dataSet": "Gov_United_States"
            },
            "text": "Which of the following institutions in the legislative branch of the United States has the most number of employees?",
            "type": "radio",
        },
        {
        	"id": 5,
            "tree": {
                "layouts": [
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Gov_United_States"
            },
            "text": "Which of the following three layouts (Sunburst, Treemap, Treemap (Zoomable)) are best at depicting the hierarchy of the United States Government? Explain your answer.",
            "type": "text",
        },
      ]
    }
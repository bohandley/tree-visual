const quizPrepQuestions = {
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
            "text": "On the provincial level, which court is at the lowest level?",
            "type": "radio",
        },
        {
            "id": 2,
            "options": [
                "Supreme Court",
                "Superior Court",
                "Premiers",
                "Governor General",
                "Lieutenant Governors"
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
                "dataSet": "Gov_Canada"
            },
            "text": "Which of the following are Federal institutions?",
            "type": "checkbox",
        },
        {
        	"id": 3,
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
	                "Collapsible_Tree"
                ]
            },
            "text": "Which branch of the Philippines Government has the most number of employees?",
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
        }
      ]

    }


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

// The questions.id here is only for internal reference
// it will NOT be used

// We need to make a unified form for checkbox answers
// shall we write a concatnated string or an array of strings?

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

            "text": "On provincial level, which court is at the lowest level?",
            "type": "radio",
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
	                "Collapsible_Tree"
                ]
            },
            "text": "Which branch of the Philippines Government has the highest number of employees?",
            "type": "radio",
            "answer": "Nation"
        },
        {
        	"id": 3,
            "tree": {
                "layouts": [
                	"Sunburst",
                	"Treemap",
                	"Zoomable_Treemap"
                ],
                "dataSet": "Gov_United_States"
            },
            "text": "Which of the following three layouts (Sunburst, Treemap, Zoomable Treemap) are best at depicting the hierarchy of the United States Government? Explain your answer.",
            "type": "text",
            "answer": "Sunburst or Zoomable Treemap"
        },
        {
            "id": 4,
            "tree": {
                "layouts": [
                    "Treemap",
                    "Collapsible_Tree"
                ],
                "dataSet": "Gov_United_Kingdom"
            },
            "text": "Briefly compare the Treemap and Collapsible Tree in depicting the hierarchy of the United States Government.",
            "type": "text",
            "answer": "I don't know"
        },
        {
        	"id": 5,
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
                    "Treemap"
                ],
                "dataSet": "Leskovec"
            },
            "text": "Among all Leskovec's publications in 2010, which paper were cited most?",
            "type": "radio",
            "answer": "Predicting positive and negative links in online social networks"
        },
        {
        	"id": 6,
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
            "answer": "13"
        },
        {
        	"id": 7,
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
        	"id": 8,
            "tree": {
                "layouts": [
                    "Pack"
                ],
                "dataSet": "Faloutsos"
            },
            "text": "What are the pros and cons of the pack layout when depicting the Faloutsos dataset?",
            "type": "text",
            "answer": "I don't know."
        },
        {
        	"id": 9,
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
        	"id": 10,
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
        	"id": 11,
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
        	"id": 12,
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
            "answer": ["Belgium", "Netherlands", "United States"]
        },
        {
        	"id": 13,
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
            "text": "Considering the features of hierarchy of trade datasets, which layout(s) is better at depicting the trade datasets? Explain your answers.",
            "type": "text",
            "answer": "Pack, Collapsible Tree, Zoomable Treemap"
        },
        {
        	"id": 14,
            "tree": {
                "layouts": [
                	"Treemap"
                ],
                "dataSet": "Trade_United_States"
            },
            "text": "Is Treemap a good layout for depicting the United States trade dataset? Briefly explain.",
            "type": "text",
            "answer": "No."
        },
        {
        	"id": 15,
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
            "answer": "116"
        },
        {
        	"id": 16,
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
            "answer": ["N.cinerea - Australian sea lion",
                    "O.flavescens - South American sea lion",
                ]
        },
        {
        	"id": 17,
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
            "answer": [
                "Canidae",
                "Felidae"
            ]
        },
        {
        	"id": 18,
            "options": [
                "Felidae, Viverridae",
                "Canidae, Viverridae",
                "Canidae, Mustelidae",
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
            "text": "Find the family with the most number of species, and family with the most number of subspecies",
            "type": "radio",
            "answer": "Canidae, Mustelidae"
        },
        {
            "id": 19,
            "tree": {
                "dataSet": "TreeOfLife_Carnivora",
                "layouts": [
                    "Pack",
                    "Radial_Tree"
                ]
            },
            "text": "Compare the pros and cons of Pack and Radial Tree in depicting the Carnivora dataset.",
            "type": "text",
            "answer": "I don't know"
        },
        {
            "id": 20,
        }
    ]
}

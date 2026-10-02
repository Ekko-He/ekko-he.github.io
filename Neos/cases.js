/* Recorded cases. Summaries are editorial; there is no live model call. */
window.NEOS_CASES = [
  {
    "id": "recorder",
    "title": "From a concert to six controls",
    "label": "The recording studio",
    "benchmark": "MMBC",
    "subtitle": "Identify a band, trace its recording equipment, then inspect newly acquired pixels.",
    "insight": "The first crop is not the whole answer. Missing textual detail sends the agent back to image search, where a wider view reveals the separate sixth knob.",
    "question": "The band in the picture released a studio album in 1967. During the recording process, how many knobs were there on the front panel of the tape recorder they used?",
    "initialImages": [
      "img_1"
    ],
    "images": {
      "img_1": {
        "src": "assets/replay/recorder-img_1.webp",
        "label": "Input concert photograph",
        "width": 1024,
        "height": 640
      },
      "img_2": {
        "src": "assets/replay/recorder-img_2.webp",
        "label": "First recorder photograph",
        "width": 1763,
        "height": 1363
      },
      "img_3": {
        "src": "assets/replay/recorder-img_3.webp",
        "label": "Upper controls crop",
        "width": 848,
        "height": 118
      },
      "img_4": {
        "src": "assets/replay/recorder-img_4.webp",
        "label": "Central controls crop",
        "width": 404,
        "height": 110
      },
      "img_5": {
        "src": "assets/replay/recorder-img_5.webp",
        "label": "Additional verification photograph",
        "width": 1200,
        "height": 813
      },
      "img_6": {
        "src": "assets/replay/recorder-img_6.webp",
        "label": "Second verification photograph",
        "width": 567,
        "height": 395
      }
    },
    "steps": [
      {
        "turn": 1,
        "tool": "ReverseImageSearch",
        "summary": "Identify the band in the input photograph before investigating its recording equipment.",
        "observation": "Matching concert photographs identify The Beatles. This provides an entity for the next text search.",
        "args": {
          "image_token": [
            "img_1"
          ],
          "goal": "Identify the band performing in this vintage 1960s stadium concert photo and the event/concert"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 2,
        "tool": "TextSearch",
        "summary": "Look for the tape machines used for the band’s 1967 studio albums.",
        "observation": "Search results provide recording-history leads for the Beatles and their 1967 sessions. The equipment still needs verification.",
        "args": {
          "query": [
            "Beatles 1967 studio album recording used tape recorder",
            "Sgt. Pepper Lonely Hearts Club Band tape recorder recording session knobs",
            "Magical Mystery Tour recording tape recorder",
            "Beatles album recorded \"Telco\" tape machine"
          ]
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 3,
        "tool": "WebVisit",
        "summary": "Read the album and recording-history pages to find the recorder model.",
        "observation": "The Sgt. Pepper page provides an image reference for the Studer J37. It does not state the requested front-panel knob count.",
        "args": {
          "url": [
            "https://en.wikipedia.org/wiki/Sgt._Pepper%27s_Lonely_Hearts_Club_Band",
            "https://en.wikipedia.org/wiki/Magical_Mystery_Tour",
            "https://en.wikipedia.org/wiki/Recording_practices_of_the_Beatles"
          ],
          "goal": "Find which tape recorder (model) was used during recording of these 1967 Beatles albums, and any statement about knobs on the front panel of that tape recorder"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 4,
        "tool": "TextSearch",
        "summary": "Narrow the search to the Studer J37 and its front-panel controls.",
        "observation": "Descriptions and image references are found for the Studer J37. The visual count is still unresolved.",
        "args": {
          "query": [
            "Studer J37 tape recorder Wikipedia",
            "Studer J37 tape recorder knobs front panel",
            "Studer J37 four track tape recorder description"
          ]
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 5,
        "tool": "FetchImage",
        "summary": "Load the recorder photograph rather than relying only on its caption.",
        "observation": "The retrieved photograph is now available as img_2. Newly acquired pixels enter the visual context.",
        "args": {
          "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/0/0d/Studer_J37_4-track_tape_recorder_%281964-1972%29,_Abbey_Road_Studios.jpg"
          ]
        },
        "images": [
          "img_2"
        ],
        "warning": false,
        "answer": null
      },
      {
        "turn": 6,
        "tool": "CropImage",
        "summary": "Inspect two regions of the recorder to examine its controls more closely.",
        "observation": "The two saved crops are img_3 and img_4. A central cluster of five rotary knobs is visible, but this partial view does not settle the full-panel count.",
        "args": {
          "crop_config": {
            "img_2": [
              [
                60,
                550,
                900,
                700
              ],
              [
                100,
                760,
                500,
                900
              ]
            ]
          }
        },
        "images": [
          "img_3",
          "img_4"
        ],
        "warning": false,
        "answer": null
      },
      {
        "turn": 7,
        "tool": "WebVisit",
        "summary": "Check equipment pages for an explicit description of the front-panel controls.",
        "observation": "The pages confirm the recorder model but do not provide an explicit knob count. Further visual evidence is needed.",
        "args": {
          "url": [
            "https://www.abbeyroad.com/news/studer-j37-gearthatmadeus-3195",
            "https://www.vintagedigital.com.au/studer-j-37/"
          ],
          "goal": "Description of the Studer J37 tape recorder front panel controls, especially how many knobs/rotary controls are on the front panel"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 8,
        "tool": "ImageSearch",
        "summary": "Search for additional photographs that show the entire front panel.",
        "observation": "The search returns candidate front-panel photographs and image references. Their pixels have not yet been loaded into the policy context.",
        "args": {
          "query": [
            "Studer J37 tape recorder front panel",
            "Studer J37 4 track tape recorder controls knobs"
          ],
          "goal": "Clear front-panel view of Studer J37 tape recorder showing all knobs/rotary controls on the front"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 9,
        "tool": "FetchImage",
        "summary": "Load two additional views and compare the complete control layout.",
        "observation": "The photographs are registered as img_5 and img_6. The policy counts five central knobs and one separate knob on the right.",
        "args": {
          "urls": [
            "https://musictech.com/wp-content/uploads/2014/05/studer-j37.jpg",
            "https://www.lightsoundjournal.com/images/2008/j37.jpg"
          ]
        },
        "images": [
          "img_5",
          "img_6"
        ],
        "warning": false,
        "answer": null
      },
      {
        "turn": 10,
        "tool": "Answer",
        "summary": "Answer from the accumulated recording-history and visual evidence.",
        "observation": "The recorded answer is 6: five central knobs plus one separate right-side knob.",
        "args": null,
        "images": [],
        "warning": false,
        "answer": "6"
      }
    ],
    "paperFigure": "assets/figures/recorder-case.webp",
    "provenance": {
      "kind": "recorded_benchmark_evaluation",
      "sample_id": "id_25",
      "question_display_edit": "Removed fixed benchmark instruction prefix only",
      "text": "Editorial summaries; original action order and recorded images. Animation timing is illustrative.",
      "image_credits": [
        {
          "image": "img_1",
          "source_url": "https://raw.githubusercontent.com/MMBrowseComp/MM-BrowseComp/refs/heads/main/MMBC_images/25.png",
          "kind": "input"
        },
        {
          "image": "img_2",
          "source_url": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Studer_J37_4-track_tape_recorder_%281964-1972%29,_Abbey_Road_Studios.jpg",
          "kind": "fetch"
        },
        {
          "image": "img_3",
          "source_url": null,
          "kind": "crop"
        },
        {
          "image": "img_4",
          "source_url": null,
          "kind": "crop"
        },
        {
          "image": "img_5",
          "source_url": "https://musictech.com/wp-content/uploads/2014/05/studer-j37.jpg",
          "kind": "fetch"
        },
        {
          "image": "img_6",
          "source_url": "https://www.lightsoundjournal.com/images/2008/j37.jpg",
          "kind": "fetch"
        }
      ]
    }
  },
  {
    "id": "fashion",
    "title": "A pattern shared across two regions",
    "label": "The rainy campaign",
    "benchmark": "VisBrowse",
    "subtitle": "Find the campaign, acquire the rainy scene, and compare the umbrella with the scarf.",
    "insight": "The answer depends on a relationship inside a newly retrieved photograph. Even when the final cross-check times out, the already acquired image and crops remain usable evidence.",
    "question": "The girl in the picture shot a poster for a brand's outerwear series in 2024. In a poster with a rainy background, what item has the same pattern as the umbrella she is holding?",
    "initialImages": [
      "img_1"
    ],
    "images": {
      "img_1": {
        "src": "assets/replay/fashion-img_1.webp",
        "label": "Input photograph",
        "width": 932,
        "height": 922
      },
      "img_2": {
        "src": "assets/replay/fashion-img_2.webp",
        "label": "Fetched campaign candidate",
        "width": 730,
        "height": 1298
      },
      "img_3": {
        "src": "assets/replay/fashion-img_3.webp",
        "label": "Retrieved rainy scene",
        "width": 533,
        "height": 690
      },
      "img_4": {
        "src": "assets/replay/fashion-img_4.webp",
        "label": "Additional fetched candidate",
        "width": 1080,
        "height": 1437
      },
      "img_5": {
        "src": "assets/replay/fashion-img_5.webp",
        "label": "Fetched park-scene candidate",
        "width": 1536,
        "height": 2048
      },
      "img_6": {
        "src": "assets/replay/fashion-img_6.webp",
        "label": "Umbrella and scarf comparison crop",
        "width": 454,
        "height": 346
      },
      "img_7": {
        "src": "assets/replay/fashion-img_7.webp",
        "label": "Second comparison crop",
        "width": 454,
        "height": 276
      }
    },
    "steps": [
      {
        "turn": 1,
        "tool": "ReverseImageSearch",
        "summary": "Use the input photograph to obtain identity and campaign leads.",
        "observation": "The returned identity candidates lead to a search for Zhang Jingyi and a 2024 outerwear campaign.",
        "args": {
          "image_token": [
            "img_1"
          ],
          "goal": "Identify the female actress and source of this photo (drama promotion or brand campaign)"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 2,
        "tool": "TextSearch",
        "summary": "Search for the 2024 outerwear campaign and rainy-background posters.",
        "observation": "The results point toward Burberry campaign material and images involving an umbrella.",
        "args": {
          "query": [
            "张婧仪 2024 外套 海报 雨伞 雨天",
            "张婧仪 2024 品牌 外套系列 海报 雨伞",
            "Zhang Jingyi 2024 outerwear series poster umbrella rain brand ambassador"
          ]
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 3,
        "tool": "WebVisit",
        "summary": "Read the official campaign page and collect relevant image references.",
        "observation": "The Burberry campaign page supplies campaign evidence and image references. The shared pattern still requires visual inspection.",
        "args": {
          "url": [
            "https://www.burberry.cn/c/burberry-world/stories/outerwear-2024-campaign/"
          ],
          "goal": "Find details of Zhang Jingyi posters in Burberry 2024 outerwear campaign, especially any poster with rainy background holding an umbrella, and pattern descriptions"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 4,
        "tool": "ImageSearch",
        "summary": "Locate campaign photographs with an umbrella and the requested rainy setting.",
        "observation": "Candidate descriptions distinguish a rainy scene from other campaign settings. Fetching selected images will make direct inspection possible.",
        "args": {
          "query": [
            "Zhang Jingyi Burberry 2024 outerwear campaign poster umbrella",
            "Zhang Jingyi Burberry trench campaign rain umbrella",
            "张婧仪 Burberry 2024 外套系列 海报 雨伞"
          ],
          "goal": "Find the Burberry 2024 outerwear campaign poster of Zhang Jingyi holding an umbrella against a rainy background, to identify the umbrella pattern and matching item pattern"
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 5,
        "tool": "FetchImage",
        "summary": "Load four candidate photographs, including the rainy scene.",
        "observation": "Four photographs enter the visual context as img_2 through img_5. The rainy scene is img_3; the other candidates are retained for comparison.",
        "args": {
          "urls": [
            "https://www.designscene.net/wp-content/uploads/2024/10/Burberry-Outerwear-9x16-Zhang-Jingyi1.jpg",
            "http://wx1.sinaimg.cn/middle/008qZRKlgy1i3q2rrbxdzj315o1hztoz.jpg",
            "https://q4.itc.cn/q_70/images03/20241011/18d2cb6b28f746ac8511703621f0b924.jpeg",
            "https://lofficielthailand.com/wp-content/uploads/2025/07/Burberry-CVD25-Campaign-Zhang-Jingyi-3x4-15-scaled.jpg"
          ]
        },
        "images": [
          "img_2",
          "img_3",
          "img_4",
          "img_5"
        ],
        "warning": false,
        "answer": null
      },
      {
        "turn": 6,
        "tool": "CropImage",
        "summary": "Crop two regions of img_3 to inspect the umbrella and scarf patterns.",
        "observation": "The saved crops, img_6 and img_7, show the red check pattern on the umbrella and scarf.",
        "args": {
          "crop_config": {
            "img_3": [
              [
                150,
                150,
                1000,
                650
              ],
              [
                150,
                300,
                1000,
                700
              ]
            ]
          }
        },
        "images": [
          "img_6",
          "img_7"
        ],
        "warning": false,
        "answer": null
      },
      {
        "turn": 7,
        "tool": "TextSearch",
        "summary": "Cross-check the campaign description against the visual observation.",
        "observation": "An official search result describes Zhang Jingyi wearing a Burberry trench coat with a red Burberry Check scarf.",
        "args": {
          "query": [
            "Burberry 2024 outerwear campaign Zhang Jingyi red checked scarf umbrella poster"
          ]
        },
        "images": [],
        "warning": false,
        "answer": null
      },
      {
        "turn": 8,
        "tool": "TextSearch",
        "summary": "Make one further text-search cross-check.",
        "observation": "This request returns a gateway timeout. No new evidence is obtained; the previously loaded photographs and crops remain available.",
        "args": {
          "query": [
            "Burberry check umbrella red Zhang Jingyi poster 2024 outerwear"
          ]
        },
        "images": [],
        "warning": true,
        "answer": null
      },
      {
        "turn": 9,
        "tool": "Answer",
        "summary": "Give the answer supported by the collected visual evidence.",
        "observation": "The scarf shares the umbrella’s red check pattern.",
        "args": null,
        "images": [],
        "warning": false,
        "answer": "The scarf — she's wrapping a red plaid (Burberry check) scarf around her neck, matching the check pattern of the umbrella."
      }
    ],
    "paperFigure": "assets/figures/fashion-case.webp",
    "provenance": {
      "kind": "recorded_benchmark_evaluation",
      "sample_id": "item_038",
      "question_display_edit": "None",
      "text": "Editorial summaries; original action order and recorded images. Animation timing is illustrative.",
      "image_credits": [
        {
          "image": "img_1",
          "source_url": "https://raw.githubusercontent.com/ZhengboZhang/VisBrowse-Bench/10b95c0cd5ae3c645b23d676d2421b4306df1034/VisBrowse_Bench_images/38.png",
          "kind": "input"
        },
        {
          "image": "img_2",
          "source_url": "https://www.designscene.net/wp-content/uploads/2024/10/Burberry-Outerwear-9x16-Zhang-Jingyi1.jpg",
          "kind": "fetch"
        },
        {
          "image": "img_3",
          "source_url": "http://wx1.sinaimg.cn/middle/008qZRKlgy1i3q2rrbxdzj315o1hztoz.jpg",
          "kind": "fetch"
        },
        {
          "image": "img_4",
          "source_url": "https://q4.itc.cn/q_70/images03/20241011/18d2cb6b28f746ac8511703621f0b924.jpeg",
          "kind": "fetch"
        },
        {
          "image": "img_5",
          "source_url": "https://lofficielthailand.com/wp-content/uploads/2025/07/Burberry-CVD25-Campaign-Zhang-Jingyi-3x4-15-scaled.jpg",
          "kind": "fetch"
        },
        {
          "image": "img_6",
          "source_url": null,
          "kind": "crop"
        },
        {
          "image": "img_7",
          "source_url": null,
          "kind": "crop"
        }
      ]
    }
  }
];

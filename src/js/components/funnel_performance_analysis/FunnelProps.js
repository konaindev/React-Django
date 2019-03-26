const FUNNEL_HISTORY = [
  {
    month: "2017-08",
    monthly_volumes: {
      usv: 1899,
      inq: 100,
      tou: 36,
      app: 13,
      exe: 10
    },
    weekly_volumes: {
      usv: [348, 982, 92, 477],
      inq: [2, 7, 44, 47],
      tou: [8, 7, 12, 9],
      app: [4, 2, 2, 5],
      exe: [3, 0, 1, 6]
    },
    monthly_conversions: {
      usv_inq: 0.0526592943654555,
      inq_tou: 0.36,
      tou_app: 0.3611111111111111,
      app_exe: 0.7692307692307693,
      usv_exe: 0.0052659294365455505
    },
    weekly_conversions: {
      usv_inq: [
        0.008634712805674316,
        0.011573741117033557,
        0.03245084044274763,
        0.08
      ],
      inq_tou: [
        0.15802582617089161,
        0.10248352205448703,
        0.0005773339424159946,
        0.09891331783220539
      ],
      tou_app: [
        0.42,
        0.23927579005566946,
        0.05429129329419167,
        0.06754402776124997
      ],
      app_exe: [
        0.16300607528901173,
        0.4977656298541172,
        0.10845906408764039,
        0.78
      ],
      usv_exe: [
        0.0010327458274518157,
        0.53,
        0.003452773374096907,
        0.0007804102349968277
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2017-09",
    monthly_volumes: {
      usv: 1495,
      inq: 67,
      tou: 20,
      app: 7,
      exe: 5
    },
    weekly_volumes: {
      usv: [103, 199, 1117, 76],
      inq: [33, 11, 17, 6],
      tou: [6, 1, 5, 8],
      app: [1, 1, 4, 1],
      exe: [1, 0, 1, 3]
    },
    monthly_conversions: {
      usv_inq: 0.044816053511705686,
      inq_tou: 0.29850746268656714,
      tou_app: 0.35,
      app_exe: 0.7142857142857143,
      usv_exe: 0.0033444816053511705
    },
    weekly_conversions: {
      usv_inq: [
        0.021418899389251497,
        0.011141994376551462,
        0.00664063988402588,
        0.00561451986187685
      ],
      inq_tou: [
        0.06617028688675138,
        0.1520759776843975,
        0.04071337978743225,
        0.03954781832798601
      ],
      tou_app: [
        0.02446817366924496,
        0.03753579716823162,
        0.09053592284562409,
        0.1974601063168993
      ],
      app_exe: [
        0.10537807614475013,
        0.2971785455626725,
        0.07835691434068769,
        0.23337217823760398
      ],
      usv_exe: [
        0.00011490247877723306,
        0.0017029090022995794,
        5.4887613691119005e-5,
        0.001471782510583239
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2017-10",
    monthly_volumes: {
      usv: 1342,
      inq: 80,
      tou: 25,
      app: 9,
      exe: 6
    },
    weekly_volumes: {
      usv: [326, 124, 277, 334, 281],
      inq: [23, 6, 30, 13, 8],
      tou: [2, 13, 2, 8, 0],
      app: [3, 4, 1, 0, 1],
      exe: [2, 1, 2, 0, 1]
    },
    monthly_conversions: {
      usv_inq: 0.05961251862891207,
      inq_tou: 0.3125,
      tou_app: 0.36,
      app_exe: 0.6666666666666666,
      usv_exe: 0.004470938897168405
    },
    weekly_conversions: {
      usv_inq: [
        0.006898396120932842,
        0.029774030715278052,
        0.007915181121571207,
        0.013651090633035436,
        0.001373820038094534
      ],
      inq_tou: [
        0.030172212228986587,
        0.03799115757274813,
        0.06129625484892656,
        0.1102582373184749,
        0.0727821380308638
      ],
      tou_app: [
        0.1272240496914858,
        0.05000298319733477,
        0.07081794801701342,
        0.006909527665865811,
        0.1050454914283002
      ],
      app_exe: [
        0.32063135492171096,
        0.04630438015501452,
        0.2447671282127626,
        0.044743436536795474,
        0.01022036684038316
      ],
      usv_exe: [
        0.0009925518613897754,
        0.0015757003454554654,
        0.0003405595928275123,
        0.0002880851331396591,
        0.001274041964355993
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2017-11",
    monthly_volumes: {
      usv: 1678,
      inq: 45,
      tou: 16,
      app: 6,
      exe: 5
    },
    weekly_volumes: {
      usv: [556, 669, 441, 12],
      inq: [27, 2, 16, 0],
      tou: [2, 4, 4, 6],
      app: [2, 1, 1, 2],
      exe: [2, 1, 0, 2]
    },
    monthly_conversions: {
      usv_inq: 0.026817640047675805,
      inq_tou: 0.35555555555555557,
      tou_app: 0.375,
      app_exe: 0.8333333333333334,
      usv_exe: 0.0029797377830750892
    },
    weekly_conversions: {
      usv_inq: [
        0.01506181440387176,
        0.0035308172297282424,
        0.007584917173709077,
        0.000640091240366723
      ],
      inq_tou: [
        0.02402245398098458,
        0.08852757787412899,
        0.39,
        0.243005523700442
      ],
      tou_app: [
        0.020901748178663748,
        0.0640045516946994,
        0.42,
        0.2900937001266368
      ],
      app_exe: [
        0.011343997537842078,
        0.026537981012255095,
        0.01545135478323617,
        0.78
      ],
      usv_exe: [
        2.896065746481777e-5,
        0.0012041671505573289,
        0.0012722458068694805,
        0.0004743641681834622
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2017-12",
    monthly_volumes: {
      usv: 1346,
      inq: 58,
      tou: 21,
      app: 8,
      exe: 5
    },
    weekly_volumes: {
      usv: [76, 165, 117, 988],
      inq: [11, 26, 7, 14],
      tou: [1, 9, 9, 2],
      app: [1, 4, 1, 2],
      exe: [2, 2, 1, 0]
    },
    monthly_conversions: {
      usv_inq: 0.04309063893016345,
      inq_tou: 0.3620689655172414,
      tou_app: 0.38095238095238093,
      app_exe: 0.625,
      usv_exe: 0.003714710252600297
    },
    weekly_conversions: {
      usv_inq: [
        0.00925114382027752,
        0.0013025490476362557,
        0.025700044207648598,
        0.006836901854601077
      ],
      inq_tou: [
        0.11614820933568551,
        0.12786712719213383,
        0.10505362207235293,
        0.013000006917069148
      ],
      tou_app: [
        0.0354365970698076,
        0.016331615864708843,
        0.2524168320625319,
        0.07676733595533261
      ],
      app_exe: [
        0.48804248282320245,
        0.008843367840401758,
        0.02398251311235297,
        0.10413163622404284
      ],
      usv_exe: [
        0.00035164653897033787,
        0.0008338114286738395,
        0.0016696888911826376,
        0.0008595633937734825
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-01",
    monthly_volumes: {
      usv: 1202,
      inq: 76,
      tou: 25,
      app: 9,
      exe: 6
    },
    weekly_volumes: {
      usv: [218, 296, 174, 335, 179],
      inq: [12, 16, 12, 7, 29],
      tou: [0, 4, 6, 12, 3],
      app: [2, 2, 1, 4, 0],
      exe: [0, 1, 0, 2, 3]
    },
    monthly_conversions: {
      usv_inq: 0.0632279534109817,
      inq_tou: 0.32894736842105265,
      tou_app: 0.36,
      app_exe: 0.6666666666666666,
      usv_exe: 0.004991680532445923
    },
    weekly_conversions: {
      usv_inq: [
        0.08,
        0.006553678983036298,
        0.006342284768374775,
        0.03054462673245977,
        0.019787362927110856
      ],
      inq_tou: [
        0.10774058628958233,
        0.39,
        0.009591019483744193,
        0.11490929122892152,
        0.09670647141880462
      ],
      tou_app: [
        0.17025559814461147,
        0.11760093387499707,
        0.015386686105603287,
        0.03676308130746112,
        0.01999370056732702
      ],
      app_exe: [
        0.13028732201813945,
        0.03299987691902838,
        0.0877029629325328,
        0.3296954451797965,
        0.08598105961716951
      ],
      usv_exe: [
        0.00026741765256419186,
        0.0022559044363506305,
        0.53,
        0.0017375350157418864,
        0.0007308234277892151
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-02",
    monthly_volumes: {
      usv: 1813,
      inq: 76,
      tou: 25,
      app: 9,
      exe: 6
    },
    weekly_volumes: {
      usv: [245, 957, 142, 469],
      inq: [31, 33, 5, 7],
      tou: [3, 9, 12, 1],
      app: [3, 0, 5, 1],
      exe: [2, 0, 3, 1]
    },
    monthly_conversions: {
      usv_inq: 0.041919470490899065,
      inq_tou: 0.32894736842105265,
      tou_app: 0.36,
      app_exe: 0.6666666666666666,
      usv_exe: 0.003309431880860452
    },
    weekly_conversions: {
      usv_inq: [
        0.00029082711375978974,
        0.011710681049869267,
        0.011080324538123285,
        0.018837637789146724
      ],
      inq_tou: [
        0.04069638735130324,
        0.07940937113316598,
        0.15785567740136644,
        0.050985932535217
      ],
      tou_app: [
        0.11190580058085559,
        0.06863811492064978,
        0.08485242915250091,
        0.09460365534599373
      ],
      app_exe: [
        0.14643246830390033,
        0.34387724224819866,
        0.16300435717075817,
        0.013352598943809454
      ],
      usv_exe: [
        0.00023644461770159746,
        0.00038844577532225666,
        0.00011942379522452644,
        0.0025651176926120714
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-03",
    monthly_volumes: {
      usv: 1417,
      inq: 45,
      tou: 15,
      app: 6,
      exe: 4
    },
    weekly_volumes: {
      usv: [307, 199, 175, 736],
      inq: [17, 6, 21, 1],
      tou: [1, 4, 8, 2],
      app: [1, 2, 2, 1],
      exe: [1, 2, 1, 0]
    },
    monthly_conversions: {
      usv_inq: 0.03175723359209598,
      inq_tou: 0.3333333333333333,
      tou_app: 0.4,
      app_exe: 0.6666666666666666,
      usv_exe: 0.0028228652081863093
    },
    weekly_conversions: {
      usv_inq: [
        0.008417445527758428,
        0.00926278385824552,
        0.005018633233628813,
        0.009058370972463217
      ],
      inq_tou: [
        0.07595650705498733,
        0.044149758140672415,
        0.007785166638241768,
        0.2054419014994318
      ],
      tou_app: [
        0.124164470035882,
        0.03614842718527303,
        0.2068621795697396,
        0.03282492320910543
      ],
      app_exe: [
        0.06740405906274548,
        0.31562628079022903,
        0.05807888189754039,
        0.2255574449161517
      ],
      usv_exe: [
        0.0006449182901361656,
        0.0015341138654473045,
        7.327021075991261e-5,
        0.0005705628418429268
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-04",
    monthly_volumes: {
      usv: 1269,
      inq: 49,
      tou: 14,
      app: 5,
      exe: 3
    },
    weekly_volumes: {
      usv: [312, 33, 607, 5, 312],
      inq: [8, 33, 3, 3, 2],
      tou: [1, 1, 8, 1, 3],
      app: [1, 2, 0, 0, 2],
      exe: [1, 0, 0, 0, 2]
    },
    monthly_conversions: {
      usv_inq: 0.038613081166272656,
      inq_tou: 0.2857142857142857,
      tou_app: 0.35714285714285715,
      app_exe: 0.6,
      usv_exe: 0.002364066193853428
    },
    weekly_conversions: {
      usv_inq: [
        0.003566342981490336,
        0.00956847816015914,
        0.0015727160430272062,
        0.009942383034666297,
        0.013963160946929674
      ],
      inq_tou: [
        0.03011000365932879,
        0.023293424502960083,
        0.09624693419200961,
        0.07207048564977013,
        0.0639934377102171
      ],
      tou_app: [
        0.14015476058727427,
        0.01501872321143325,
        0.022022681565342282,
        0.13662140968722863,
        0.04332528209157873
      ],
      app_exe: [
        0.19273922215761466,
        0.22751023752931013,
        0.06328501102913865,
        0.0289172399184697,
        0.08754828936546681
      ],
      usv_exe: [
        0.0008412817069659189,
        0.0004007301961406817,
        0.53,
        0.0003938284992357049,
        0.0007282257915111221
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-05",
    monthly_volumes: {
      usv: 1891,
      inq: 63,
      tou: 20,
      app: 8,
      exe: 5
    },
    weekly_volumes: {
      usv: [869, 83, 708, 231],
      inq: [17, 25, 20, 1],
      tou: [11, 3, 3, 3],
      app: [2, 2, 2, 2],
      exe: [0, 3, 0, 2]
    },
    monthly_conversions: {
      usv_inq: 0.033315705975674244,
      inq_tou: 0.31746031746031744,
      tou_app: 0.4,
      app_exe: 0.625,
      usv_exe: 0.0026441036488630354
    },
    weekly_conversions: {
      usv_inq: [
        0.014232847636134664,
        0.016295001826793613,
        0.002451271761959786,
        0.00033658475078618297
      ],
      inq_tou: [
        0.0020414961738111923,
        0.04340164256062611,
        0.17145086859096897,
        0.10056631013491116
      ],
      tou_app: [
        0.039732248467639966,
        0.04917493008351086,
        0.06577393941712671,
        0.24531888203172245
      ],
      app_exe: [
        0.037615238485040677,
        0.78,
        0.15473505954219224,
        0.43264970197276714
      ],
      usv_exe: [
        0.0002137360941345841,
        1.1297902440322803e-5,
        0.001346218192803912,
        0.0010728514594842164
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-06",
    monthly_volumes: {
      usv: 1471,
      inq: 80,
      tou: 29,
      app: 11,
      exe: 9
    },
    weekly_volumes: {
      usv: [478, 642, 26, 325],
      inq: [41, 3, 3, 33],
      tou: [3, 2, 13, 11],
      app: [5, 5, 0, 1],
      exe: [1, 4, 0, 4]
    },
    monthly_conversions: {
      usv_inq: 0.054384772263766146,
      inq_tou: 0.3625,
      tou_app: 0.3793103448275862,
      app_exe: 0.8181818181818182,
      usv_exe: 0.006118286879673691
    },
    weekly_conversions: {
      usv_inq: [
        0.01628604912378643,
        0.005385708272604748,
        0.029757751864802433,
        0.0029552630025725395
      ],
      inq_tou: [
        0.09747310751565404,
        0.1533987903448096,
        0.39,
        0.11162810213953636
      ],
      tou_app: [
        0.42,
        0.12633443943193282,
        0.2041536108298465,
        0.04882229456580688
      ],
      app_exe: [
        0.5297658554931248,
        0.008422881567896813,
        0.11454046658429234,
        0.16545261453650414
      ],
      usv_exe: [
        0.0029603110042082325,
        0.0027502078082483243,
        3.920229221275495e-5,
        0.0003685657750043792
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  },
  {
    month: "2018-07",
    monthly_volumes: {
      usv: 1797,
      inq: 91,
      tou: 30,
      app: 12,
      exe: 8
    },
    weekly_volumes: {
      usv: [775, 199, 32, 493, 298],
      inq: [4, 6, 63, 1, 17],
      tou: [3, 5, 1, 14, 7],
      app: [4, 3, 1, 0, 4],
      exe: [3, 0, 2, 1, 2]
    },
    monthly_conversions: {
      usv_inq: 0.05063995548135782,
      inq_tou: 0.32967032967032966,
      tou_app: 0.4,
      app_exe: 0.6666666666666666,
      usv_exe: 0.004451864218141347
    },
    weekly_conversions: {
      usv_inq: [
        0.012630369027512698,
        0.025026259270705578,
        0.08,
        0.003662522160146756,
        0.009320805022992791
      ],
      inq_tou: [
        0.17521829602910224,
        0.010569734148966031,
        0.033157483150897914,
        0.020842584471302845,
        0.08988223187006072
      ],
      tou_app: [
        0.32717984339047074,
        0.021370321996689683,
        0.007952851179596756,
        0.00686501266891509,
        0.03663197076432775
      ],
      app_exe: [
        0.23418272144531638,
        0.09230494614598186,
        0.23081388071658238,
        0.07843617750451629,
        0.030928940854269768
      ],
      usv_exe: [
        9.909070962866384e-5,
        0.00064307090051857,
        0.002749157828511779,
        0.0009015409469855115,
        5.900383249682187e-5
      ]
    },
    weekly_costs: {
      usv: ["3.47", "3.47", "3.47", "3.47", "3.47"],
      inq: ["86.62", "86.62", "86.62", "86.62", "86.62"],
      tou: ["262.00", "262.00", "262.00", "262.00", "262.00"],
      app: ["708.00", "708.00", "708.00", "708.00", "708.00"],
      exe: ["1000.00", "1000.00", "1000.00", "1000.00", "1000.00"]
    },
    monthly_costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    }
  }
];

export default {
  funnel_history: FUNNEL_HISTORY
};

export const funnel_history = FUNNEL_HISTORY;
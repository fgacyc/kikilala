export const satelliteList = [
    {
        text: "Kuchai YW",
        value: "Kuchai YW",
    },
    {
        text: "Kuchai WK",
        value: "Kuchai WK",
    },
    {
        text: "Kuchai GS",
        value: "Kuchai GS",
    },
    {
        text: "Klang",
        value: "Klang",
    },
    {
        text: "Serdang",
        value: "Serdang",
    },
    {
        text: "Kepong",
        value: "Kepong",
    },
    {
        text: "USJ",
        value: "USJ",
    },
    {
        text: "Setapak",
        value: "Setapak",
    },
    {
        text: "SG Long",
        value: "SG Long",
    },
    {
        text: "Seremban",
        value: "Seremban",
    }
];

export const pastoralTeamList = [
    {
        text: "Move",
        value: "Move",
    },
    {
        text: "Voice",
        value: "Voice",
    },
    {
        text: "Mind",
        value: "Mind",
    },
    {
        text: "Force",
        value: "Force",
    },
    {
        text: "Heart",
        value: "Heart",
    },
    {
        text: "GS - Joshua Zone",
        value: "GS - Joshua Zone",
    },
    {
        text: "GS - Daniel Yeo Zone",
        value: "GS - Daniel Yeo Zone",
    },
    {
        text: "GS - Ps Jasmine Zone",
        value: "GS - Ps Jasmine Zone",
    },
    {
        text: "GS - Ps Melvin Zone",
        value: "GS - Ps Melvin Zone",
    },
    {
        text: "GS - The Blessing",
        value: "GS - The Blessing",
    },
    {
        text: "Young Professional",
        value: "Young Professional",
    },
    {
        text: "Adult",
        value: "Adult",
    },
    {
        text: "Young Warrior",
        value: "Young Warrior",
    },
    {
        text: "General Service",
        value: "General Service",
    },
    {
        text: "Young Family",
        value: "Young Family",
    }
]

export const attendanceTypeList = [
    {
        text: "CG",
        value: "CG",
    },
    {
        text: "Service",
        value: "Service",
    }
]

export const satellite_pastoralTeam = {
    "Kuchai YW": ["Move", "Voice", "Mind", "Force", "Heart"],
    "Kuchai WK": ["GS - Joshua Zone"],
    "Kuchai GS": ["GS - Daniel Yeo Zone", "GS - Ps Jasmine Zone", "GS - Ps Melvin Zone"],
    // "Klang": ["Young Professional"],
    "Serdang": ["Adult", "Young Warrior", "Young Professional"],
    "Kepong": ["Adult", "Young Warrior", "Young Professional"],
    "USJ": ["Young Warrior", "General Service"],
    "Setapak": ["Young Warrior", "Young Professional", "Adult"],
    "SG Long": ["Young Warrior", "Young Professional", "Young Family"],
    "Seremban": ["Young Warrior"]
}

export const pastoralTeams =[
    "Kuchai YW",
    "Kuchai GS",
    "Serdang",
    "Kepong",
    "USJ",
    "Setapak",
    "SG Long",
    "Seremban",
]

export const kuchaGSPastoralTeams = [
    "GS - Daniel Yeo Zone",
    "GS - Ps Jasmine Zone",
    "GS - Ps Melvin Zone",
]

export const kuchaYWPastoralTeams = satellite_pastoralTeam["Kuchai YW"];


export const satelliteNameList =  Object.keys(satellite_pastoralTeam);


export const CGCategoryList = [
    {
        text: "Secondary Students",
        value: "secondary_students",
    },
    {
        text: "College / University",
        value: "college/university",
    },
    {
        text: "Young Adults",
        value: "young_adults",
    },
    {
        text: "Married",
        value: "married",
    },
    {
        text: "Family",
        value: "family",
    },
    {
        text: "Adult / Golden Age",
        value: "adult/golden_age",
    },
    {
        text: "Entrepreneur",
        value: "entrepreneur",
    }
];

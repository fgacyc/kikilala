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
    },
    {
        text: "Blessing",
        value: "Blessing",
    }
];

export const pastoralTeamList = [
    {
        text:"YW Central (XK)",
        value:"YW Central (XK)"
    },
    {
        text:"YW Central (CS)",
        value:"YW Central (CS)"
    },
    {
        text:"YW North",
        value:"YW North"
    },
    {
        text:"YW South",
        value:"YW South"
    },
    {
        text:"YW East",
        value:"YW East"
    },
    {
        text:"YW West",
        value:"YW West"
    },
    {
        text:"YW Youth",
        value:"YW Youth"
    },
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
        text: "Puchong",
        value: "Puchong",
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
    },
    {
        text: "Cradle Land & Shining Star",
        value: "Cradle Land & Shining Star",
    },
    {
        text: "Super Trooper",
        value: "Super Trooper",
    },
    {
        text: "Wow Life",
        value: "Wow Life",
    },
    {
        text: "WK Warrior",
        value: "WK Warrior",
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
    "Kuchai GS": ["GS - Daniel Yeo Zone", "GS - Joshua Zone", "GS - Ps Jasmine Zone", "GS - Ps Melvin Zone"],
    // "Klang": ["Young Professional"],
    "Serdang": ["Adult", "Young Warrior", "Young Professional"],
    "Kepong": ["Adult", "Young Warrior", "Young Professional"],
    "USJ": ["Young Warrior", "General Service"],
    "Setapak": ["Young Warrior", "Young Professional", "Adult"],
    "SG Long": ["Young Warrior", "Young Professional", "Young Family"],
    "Seremban": ["Young Warrior"],
    "Penang": [],
    "Johor": [],
    "Blessing": ["Puchong"]
}

export const satellite_pastoralTeam_v2 = {
    "Kuchai YW": ["YW Central (XK)", "YW Central (CS)", "YW North", "YW South", "YW East","YW West","YW Youth"],
    "Kuchai WK": ["GS - Joshua Zone"],
    "Kuchai GS": ["GS - Daniel Yeo Zone", "GS - Joshua Zone", "GS - Ps Jasmine Zone", "GS - Ps Melvin Zone"],
    // "Klang": ["Young Professional"],
    "Serdang": ["Adult", "Young Warrior", "Young Professional"],
    "Kepong": ["Adult", "Young Warrior", "Young Professional"],
    "USJ": ["Young Warrior", "General Service"],
    "Setapak": ["Young Warrior", "Young Professional", "Adult"],
    "SG Long": ["Young Warrior", "Young Professional", "Young Family"],
    "Seremban": ["Young Warrior"],
    "Penang": [],
    "Johor": [],
    "Blessing": ["Puchong"]
}

export function getLocation() {
    return Object.keys(satellite_pastoralTeam);
}

export function getPastoralTeam(location) {
    return satellite_pastoralTeam[location];
}

export function getPastoralTeamsV2(location) {
    return satellite_pastoralTeam_v2[location];
}

export const pastoralTeams = [
    "Kuchai YW",
    "Kuchai GS",
    "Serdang",
    "Kepong",
    "USJ",
    "Setapak",
    "SG Long",
    "Seremban",
    "Blessing"
]

export const kuchaGSPastoralTeams = [
    "GS - Daniel Yeo Zone",
    "GS - Joshua Zone",
    "GS - Ps Jasmine Zone",
    "GS - Ps Melvin Zone",
]

export const kuchaYWPastoralTeams = satellite_pastoralTeam["Kuchai YW"];


export const satelliteNameList = getLocation();


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
    },
    {
        text: "Children",
        value: "children"
    }
];

export const downloadOptions = [
    {
        label: "Kuchai YW",
        value: "Kuchai YW",
        children: [
            {
                label: "Move",
                value: "Move"
            },
            {
                label: "Voice",
                value: "Voice"
            },
            {
                label: "Mind",
                value: "Mind"
            },
            {
                label: "Force",
                value: "Force"
            },
            {
                label: "Heart",
                value: "Heart"
            },
            {
                label: "All",
                value: "All"
            }
        ]
    },
    {
        label: "Kuchai GS",
        value: "Kuchai GS",
        children: [
            {
                label: "GS - Daniel Yeo Zone",
                value: "GS - Daniel Yeo Zone"
            },
            {
                label: "GS - Ps Jasmine Zone",
                value: "GS - Ps Jasmine Zone"
            },
            {
                label: "GS - Ps Melvin Zone",
                value: "GS - Ps Melvin Zone"
            },
            {
                label: "GS - Joshua Zone",
                value: "GS - Joshua Zone"
            },
            {
                label: "GS - The Blessing",
                value: "GS - The Blessing"
            },
            {
                label: "All",
                value: "All"
            }
        ]
    },
    {
        label: "Satellites",
        value: "Satellites",
        children: [
            {
                label: "Serdang",
                value: "Serdang"
            },
            {
                label: "Kepong",
                value: "Kepong"
            },
            {
                label: "USJ",
                value: "USJ"
            },
            {
                label: "Setapak",
                value: "Setapak"
            },
            {
                label: "SG Long",
                value: "SG Long"
            },
            {
                label: "Seremban",
                value: "Seremban"
            }
        ]
    },
    {
        label: "Pastoral Teams",
        value: "Pastoral Teams",
        children: [
            {
                label: "Young Professional",
                value: "Young Professional"
            },
            {
                label: "Adult",
                value: "Adult"
            },
            {
                label: "Young Warrior",
                value: "Young Warrior"
            },
            {
                label: "General Service",
                value: "General Service"
            },
            {
                label: "Young Family",
                value: "Young Family"
            }
        ]
    },
    {
        label: "Blessing",
        value: "Blessing",
        children: [
            {
                label: "Puchong",
                value: "Puchong"
            },
        ]
    },
    {
        label: "All",
        value: "All"
    }
];

const satelliteShort = {
    "Kuchai WK": "",
    "Kuchai YW": "",
    "Kuchai GS": "",
    "Klang": "KLG",
    "Serdang": "S",
    "Kepong": "K",
    "USJ": "USJ",
    "Setapak": "STP",
    "SG Long": "SGL",
    "Seremban": "SRB",
    "Blessing": "BLS",
}

export const getShortSatellite = (satellite) => {
    return satelliteShort[satellite];
}

const CGCategoryListShort = {
    "secondary_students": "S",
    "college/university": "T",
    "young_adults": "W",
    "married": "A",
    "family": "A",
    "adult/golden_age": "A",
    "entrepreneur": "A",
    "children": "J"
}

export const getShortCGCategory = (category) => {
    return CGCategoryListShort[category];
}




export const admin_urls = {
    "dashboard": "/nb-dashboard",
    "attendance": "/nb-attendance",
    "headcount": "/nb-headcount",
    "cgl": "/nb-cgl",
    "admin": "/nb-admin",
    "structure": "/nb-structure",
    "report": "/nb-report",
}


export const wonderkids_pastoral_team = [
    "Cradle Land & Shining Star",
    "Super Trooper",
    "Wow Life",
    "WK Warrior",
]
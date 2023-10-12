export function  getAllPastoralTeamNames(satellite,data){
    let teamNames = [];
    for (let item in data){
        if (data[item].satellite === satellite){
            if (!teamNames.includes(data[item].pastoral_team)){
                teamNames.push(data[item].pastoral_team)
            }
        }
    }
    //console.log(teamNames)
    return teamNames;
}

export  function  getAllTeamLeaderNames(satellite,teamName,data){
    let teamLeaderNames = [];
    for (let item in data){
        if (data[item].pastoral_team === teamName && data[item].satellite === satellite){
            if (!teamLeaderNames.includes(data[item].CG_leader)){
                teamLeaderNames.push(data[item].CG_leader)
            }
        }
    }
    //console.log(teamLeaderNames)
    return teamLeaderNames;
}

// function  getAllPastoralTeams(satellite,data){
//     return data.filter((item)=>item.satellite===satellite)
// }

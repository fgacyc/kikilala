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

export  function getWeekDates(num) {
    // 获取当前日期
    const currentDate = new Date();

    // 计算偏移的毫秒数
    const offsetMilliseconds = num * 7 * 24 * 60 * 60 * 1000;

    // 计算目标周的开始日期
    const startDate = new Date(currentDate.getTime() + offsetMilliseconds);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

    // 计算目标周的结束日期
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    // 格式化日期为 "YYYY/MM/DD"
    const formattedStartDate = `${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}`;

    return `${formattedStartDate}-${formattedEndDate}`;
}

export  function getWeekDatesArray(num){
    let dateArray = [];

    for (let i = 0; i < num; i++) {
        dateArray.push(getWeekDates(i));
    }
    return dateArray;
}

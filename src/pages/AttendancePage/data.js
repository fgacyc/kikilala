import attendanceDownloadModalStore from "../../store/attendanceDownloadModalStore.js";

//2024/03/11-2024/03/17
function filterAttendByDateStr(data,duration){
    const dates = duration.split('-');
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    let res = [];
    for (let item of data){
        const itemDate =item.date.split('-');
        const itemStartDate = new Date(itemDate[0]);
        const itemEndDate = new Date(itemDate[1]);
        if (itemStartDate >= startDate && itemEndDate <= endDate){
            res.push(item);
        }
    }
    return res;
}

export default function attendanceDownloadDataFilter(conditionList,dataDuration ){
    if (!conditionList) return [];
    const data = attendanceDownloadModalStore.getState().allData;
    const attendanceDataList = Object.values(data);
    if (conditionList.length === 1 && conditionList[0] === "All") {
        return attendanceDataList;
    }
    else if (conditionList.length === 2 && conditionList[0] === "Kuchai YW") {
        return YWDateFilter(attendanceDataList, conditionList,dataDuration );
    }
    else if (conditionList.length === 2 && conditionList[0] === "Kuchai GS") {
        return GSDateFilter(attendanceDataList, conditionList,dataDuration );
    }
    else if (conditionList.length === 2 && conditionList[0] === "Satellites") {
        return SatelliteDateFilter(attendanceDataList, conditionList,dataDuration );
    }
    else if (conditionList.length === 2 && conditionList[0] === "Pastoral Teams") {
        return PastoralTeamFilter(attendanceDataList, conditionList,dataDuration );
    }
    else {
        return attendanceDataList;
    }
}

function YWDateFilter(data, conditionList,dataDuration ) {
    // ["Kuchai YW", "Move"]， ["Kuchai YW", "All"]
    let filteredData =data.filter(item => item.satellite === "Kuchai YW")
    if (conditionList[1] === "All") {
        return filterAttendByDateStr(filteredData, dataDuration);
    }
    else {
        filteredData =  filteredData.filter(item => item.pastoral_team === conditionList[1]);
        return filterAttendByDateStr(filteredData, dataDuration);
    }
}

function GSDateFilter(data, conditionList,dataDuration ) {
    let filteredData = data.filter(item => item.satellite === "Kuchai GS")
    if (conditionList[1] === "All") {
        return filterAttendByDateStr(filteredData, dataDuration);
    }
    else {
        filteredData =  filteredData.filter(item => item.pastoral_team === conditionList[1]);
        return filterAttendByDateStr(filteredData, dataDuration);
    }
}

function SatelliteDateFilter(data, conditionList,dataDuration ) {
    console.log("SatelliteDateFilter",conditionList)
    let filteredData = data.filter(item => item.satellite === conditionList[1]);
    return filterAttendByDateStr(filteredData, dataDuration);
}

function PastoralTeamFilter(data, conditionList,dataDuration ) {
    let filteredData = data.filter(item => item.pastoral_team === conditionList[1]);
    return filterAttendByDateStr(filteredData, dataDuration);
}

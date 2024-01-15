import {readAllActiveCGLs} from "../../api/CGLs.js";
import {filterCGLByMonth} from "../dataInsight/DataInsight.jsx";

export function culChartData(data){
    let dateGroup = {};
    for (let record of data){
        let date = record.date;
        if (dateGroup.hasOwnProperty(date)){
            dateGroup[date].push(record)
        }else{
            dateGroup[date] = [record]
        }
    }
    const dateList = Object.keys(dateGroup);
    const dateGroupList = Object.values(dateGroup);

    let newData = [];
    for (let i = 0; i < dateGroupList.length; i++){
        let name = dateList[i];
        let records = dateGroupList[i];
        const cgAttendance = records.reduce((acc, cur) => {
            return acc + cur.cg_om_num + cur.cg_nb_num + cur.cg_nf_num + cur.cg_rnf_num + cur.cg_ac_num;
        } ,0)

        const serviceAttendance = records.reduce((acc, cur) => {
            return acc + cur.service_om_num + cur.service_nb_num + cur.service_nf_num + cur.service_rnf_num+ cur.cg_ac_num;
        },0)

        const newFriends = records.reduce((acc, cur) => {
            return acc + cur.cg_nf_num + cur.service_rnf_num;
        },0)

        const acNum = records.reduce((acc, cur) => {
            return acc + cur.cg_ac_num + cur.service_ac_num;
        },0)

        const totalMembers = records.reduce((acc, cur) => {
            return acc + cur.total_members_num;
        },0)

        newData.push({
            name: name.substring(16,21),
            "Attendance Submit": records.length,
            "CG Attendance": cgAttendance,
            "Service Attendance": serviceAttendance,
            "New Friends": newFriends,
            "AC Num": acNum,
            "Total Members": totalMembers,
        })
    }
    return newData
}

export async function getCurrentMonthCGLsNum(CGLSData,currentMonth,location,pastoralTeam){
    if(!CGLSData) return ;

    if(!location || location==="All") location = null;
    if(!pastoralTeam) pastoralTeam = null;

    // console.log(currentMonth,CGLSData)
    const currentMonthCGLs = filterCGLByMonth(currentMonth,CGLSData)

    if(location === null && pastoralTeam === null){
        return currentMonthCGLs.length
    }

    if(location !== null && pastoralTeam === null){
        const filterCGLs = currentMonthCGLs.filter((cgl) => {
            return cgl.satellite === location
        } )
        return filterCGLs.length
    }

    if(location !== null && pastoralTeam !== null){
        const filterCGLs = currentMonthCGLs.filter((cgl) => {
            return cgl.satellite === location && cgl.pastoral_team === pastoralTeam
        } )
        return filterCGLs.length
    }
}

function calculateTrendLine(points) {
    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (const point of points) {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x ** 2;
    }

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const b = (sumY - m * sumX) / n;

    return { m, b };
}



function getYCoordinatesOnTrendLine(points){
    // 计算趋势线的斜率和截距
    const trendLine = calculateTrendLine(points);

// 计算每个点在趋势线上的Y轴坐标
    const yCoordinatesOnTrendLine = points.map(point => {
        const x = point.x;
        const yOnTrendLine = trendLine.m * x + trendLine.b;
        return Math.round(yOnTrendLine);
    });

    return yCoordinatesOnTrendLine
}


export function addTrendLineToPoints(data){
    // const ACNumPoints = data.map((record,index) => {
    //     return {
    //         x:index+1,
    //         y: record["AC Num"]
    //     }
    // })
    // const yOnTrendLine = getYCoordinatesOnTrendLine(ACNumPoints)
    // for (let i = 0; i < data.length; i++){
    //     data[i]["AC Num Trend Line"] = yOnTrendLine[i]
    // }

    const keys = ["AC Num","Attendance Submit","CG Attendance","New Friends","Service Attendance","Total Members"]
    for (let key of keys){
        const points = data.map((record,index) => {
            return {
                x:index+1,
                y: record[key]
            }
        })
        const yOnTrendLine = getYCoordinatesOnTrendLine(points)
        for (let i = 0; i < data.length; i++){
            data[i][key+" Trend Line"] = yOnTrendLine[i]
        }
    }
    // console.log(data)
    return data
}

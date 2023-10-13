import {Message} from "@arco-design/web-react";
import {get} from "idb-keyval";

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
        dateArray.push(getWeekDates(i * -1));
    }
    dateArray.reverse();
    return dateArray;
}

export function validate(data) {
    if (
        data.satellite === "" ||
        data.pastoral_team === "" ||
        data.cgl_name === "" ||
        data.date === ""
    ){
        Message.warning("Please fill in all the fields!")
        return false;
    }

    if (data.total_members_num === 0){
        Message.warning("Total members number cannot be 0!")
        return false;
    }

    if (data.cg_om_num < 0 ||
        data.cg_nb_num < 0 ||
        data.cg_nf_num < 0 ||
        data.cg_rnf_num < 0 ||
        data.cg_abs_num < 0 ||
        data.service_om_num < 0 ||
        data.service_nb_num < 0 ||
        data.service_nf_num < 0 ||
        data.service_rnf_num < 0 ||
        data.service_abs_num < 0
    ){
        Message.warning("The number of members cannot be negative!")
        return false;
    }

    if (data.cg_abs_num >0 && data.cg_absence_reason === ""){
        Message.warning("Please fill in the absence reason!")
        return false;
    }

    if (data.service_abs_num >0 && data.service_absence_reason === ""){
        Message.warning("Please fill in the absence reason!")
        return false;
    }
    return true;
}

// set("kikilala-CGLs-updatedAt", new Date());
export async function ifExpire(){
    const date = await get("kikilala-CGLs-updatedAt")
    console.log(date)
    if(!date) return true;
    // over 7 days
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / (24 * 3600 * 1000));
    return days > 7;
}

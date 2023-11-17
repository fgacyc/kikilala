import {Message} from "@arco-design/web-react";
import {get} from "idb-keyval";
import {readAllActiveCGLs} from "../../api/CGLs.js";

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

export  function getWeekDates1(num) {
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

function getWeekDates(num) {
    const formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    };

    const getMonday = (date) => {
        let day = date.getDay() || 7;
        if (day !== 1)
            date.setHours(-24 * (day - 1));
        return date;
    };

    let currentWeekMonday = getMonday(new Date());
    currentWeekMonday.setDate(currentWeekMonday.getDate() - 7 * num);

    let weekStart = new Date(currentWeekMonday);
    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return formatDate(weekStart) + '-' + formatDate(weekEnd);
}

export  function getWeekDatesArray(num){
    let dateArray = [];

    for (let i = 0; i < num; i++) {
        dateArray.push(getWeekDates(i));
    }
    dateArray.reverse();
    return dateArray;
}

export function validate(data) {
    // console.log(data)

    if (
        data.satellite === "" ||
        data.pastoral_team === "" ||
        data.cgl_name === "" ||
        data.cg_id === "" ||
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
        data.cg_ac_num < 0 ||
        data.cg_abs_num < 0 ||
        data.service_om_num < 0 ||
        data.service_nb_num < 0 ||
        data.service_nf_num < 0 ||
        data.service_rnf_num < 0 ||
        data.service_ac_num < 0 ||
        data.service_abs_num < 0
    ){
        Message.warning("The number of members cannot be negative!")
        return false;
    }

    if (data.cg_om_num === "" ||
        data.cg_nb_num === "" ||
        data.cg_nf_num=== "" ||
        data.cg_rnf_num === "" ||
        data.cg_ac_num === "" ||
        data.cg_abs_num === "" ||
        data.service_om_num === ""||
        data.service_nb_num === "" ||
        data.service_nf_num === "" ||
        data.service_rnf_num === "" ||
        data.service_ac_num === "" ||
        data.service_abs_num === ""
    ){
        Message.warning("Please fill in all the number fields!")
        return false;
    }

    if (
            data.cg_om_num === 0 &&
            data.cg_nb_num === 0 &&
            data.cg_nf_num=== 0 &&
            data.cg_rnf_num === 0 &&
            data.cg_ac_num === 0 &&
            data.cg_abs_num === 0 &&
            data.cg_absence_reason !== "" &&
            data.service_om_num !== "" &&
            data.service_nb_num !== "" &&
            data.service_nf_num !== "" &&
            data.service_rnf_num !== "" &&
            data.service_ac_num !== "" &&
            data.service_abs_num !== "" &&
            data.total_members_num === data.service_om_num + data.service_abs_num
    )
    {
        //Message.warning("If there is no CG, please fill in the absence reason!")
        return true;
    }

    if (data.cg_abs_num >0 && data.cg_absence_reason === ""){
        Message.warning("Please fill in the absence reason!")
        return false;
    }

    if (data.service_abs_num >0 && data.service_absence_reason === ""){
        Message.warning("Please fill in the absence reason!")
        return false;
    }

    // if (data.cg_abs_num ===0 && data.cg_absence_reason !== ""){
    //     Message.warning("Please check the CG absence number")
    //     return false;
    // }
    //
    // if (data.service_abs_num === 0 && data.service_absence_reason !== ""){
    //     Message.warning("Please check the Service absence number")
    //     return false;
    // }

    if (data.total_members_num !== data.cg_om_num + data.cg_abs_num){
        Message.warning("Please check the OM number and CG absence number!")
        return false;
    }

    if (data.total_members_num !== data.service_om_num + data.service_abs_num){
        Message.warning("Please check the OM number and Service absence number!")
        return false;
    }

    return true;
}

// set("kikilala-CGLs-updatedAt", new Date());
export async function ifExpire(){
    const date = await get("kikilala-CGLs-updatedAt")
    // console.log(date)
    if(!date) return true;
    // over 7 days
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / (1 * 3600 * 1000)); //update cache every 1 hour
    return days > 7;
}


export async function getCGInfo(key){
    const  data = await get("CGInfo");
    if(!data) return null;
    return data[key];
}



export function convertTableData(data){
    let CGsList =[]
    for (let key in data){
        const item = data[key];
        item.key = key;
        CGsList.push(item);
    }
    // sort by createdAt
    CGsList.sort((a,b) => {
        return new Date(b.updatedAt.seconds) - new Date(a.updatedAt.seconds);
    });

    return CGsList;
}

export  async  function getCGName(CGLName){
    const  data =await readAllActiveCGLs();
    for (let key in data){
        if (data[key].CG_leader === CGLName){
            // console.log(data[key])
            return {
                cg_name: data[key].CG_name,
                cg_id: data[key].CG_id
            }
        }
    }
    return "";
}


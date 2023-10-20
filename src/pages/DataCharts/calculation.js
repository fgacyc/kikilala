import {get} from "idb-keyval";

export  function  getMonthlyCGNumbering(data, weekNum){
    let monthlyCGNumberingMap = {};
    for (let key in data){
        const item = data[key];
        if(item.cg_name in monthlyCGNumberingMap){
            monthlyCGNumberingMap[item.cg_name] += item.total_members_num;
        }else{
            monthlyCGNumberingMap[item.cg_name] = item.total_members_num;
        }
    }
    // total_members_num / weekNum
    const  monthlyCGNumbering = Object.values(monthlyCGNumberingMap);
    let sum = 0;
    monthlyCGNumbering.forEach(item => {
        sum += item;
    });

    //console.log(monthlyCGNumbering)
    return sum / weekNum;
}

export async function  getNumOfCGs(){
    let data = await get("kikilala-CGLs");
    let num = Object.keys(data).length;
    //console.log(num)
    return num;
}

export  function  getServiceAttend(data, weekNum){
    let sum = 0;
    for (let key in data){
        const item = data[key];
        sum += item.service_om_num
            + item.service_nb_num
            + item.service_nf_num
            + item.service_rnf_num
            + item.service_ac_num;
    }
    //console.log(sum)
    return sum / weekNum;
}


export  function  getWeeklyServiceAttend(data){
    let sum = 0;
    for (let key in data){
        const item = data[key];
        if(item.date==="2023/10/02-2023/10/08"){
            sum += item.service_om_num
                + item.service_nb_num
                + item.service_nf_num
                + item.service_rnf_num
                + item.service_ac_num;
        }
    }
    return sum;
}


export  function  getMonthlyNewFriends(data, weekNum){
    let sum = 0;
    for (let key in data){
        const item = data[key];
        sum += item.cg_nf_num + item.service_nf_num;
    }
    return sum;
}


export  function  getMonthlySalvation(data, weekNum){
    let sum = 0;
    for (let key in data){
        const item = data[key];
        sum += item.cg_ac_num + item.service_ac_num;
    }
    return sum;
}

export function getSundayDates() {
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0表示周日，1表示周一，以此类推

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 将当前日期的时间部分设为0，以确保不会影响计算

    let lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - todayDayOfWeek + 1); // 计算本周的周日

    const sundayDates = [lastSunday.toISOString().split('T')[0]];

    if (todayDayOfWeek === 0) {
        // 如果今天是周日，返回本周日和前三周的周日
        for (let i = 0; i < 3; i++) {
            lastSunday.setDate(lastSunday.getDate() - 7); // 向前推进一周
            sundayDates.push(lastSunday.toISOString().split('T')[0]);
        }
    } else {
        // 如果今天不是周日，返回前四周的周日
        for (let i = 0; i < 4; i++) {
            lastSunday.setDate(lastSunday.getDate() - 7); // 向前推进一周
            sundayDates.push(lastSunday.toISOString().split('T')[0]);
        }
    }
    sundayDates.reverse();
    return sundayDates;
}

export function getSundayDate(){
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0表示周日，1表示周一，以此类推

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 将当前日期的时间部分设为0，以确保不会影响计算

    let lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - todayDayOfWeek + 1); // 计算本周的周日

    return lastSunday.toISOString().split('T')[0];
}

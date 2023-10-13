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
    console.log(num)
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
    console.log(sum)
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

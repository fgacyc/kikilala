// Some dummy data for user details.
// let data = [
//     [ 'Id', 'FirstName', 'LastName', 'Mobile', 'Address' ], // This is your header.
//     [ 1, 'Richard', 'Roe', '9874563210', 'Address' ],
//     [ 2, 'Joe', 'Doakes', '7896541230', 'Address' ],
//     [ 3, 'John', 'Smith', '8745632109', 'Address' ],
//     [ 4, 'Joe', 'Sixpack', '9875647890', 'Address' ],
//     [ 5, 'Richard', 'Thomson', '8632547890', 'Address' ]
// ];
//import {almostWhole} from "chart.js/helpers";
//import {readAllCGLs} from "./api/CGLs.js";

import {useDataCheckStore} from "./store/dataCheckStore.js";
import {queryAdminEmail} from "./api/admin.js";

export async function downloadCGLsData(data) {
    let csv = []
    for (let key in data){
        const item = data[key];
        csv.push({
            "CGL Name": `"${item.CG_leader}"`,
            "CGL Nickname": `"${item.nickname}"`,
            "CG name": `"${item.CG_name}"`,
            "CG Status": `"${item.CG_status}"`,
            "Pastoral team": `"${item.pastoral_team}"`,
            "Satellite": `"${item.satellite}"`,
        })
    }
    return csv
}

export function downloadCGLAttendanceData(data) {
    // console.log(data)
    let csv = [];
    for (let item of data) {
        csv.push({
            "Date": `"${item.date}"`,
            "Type": `"${item.type}"`,
            "OM": item.om_num,
            "NB": item.nb_num,
            "NF": item.nf_num,
            "RNF": item.rnf_num,
            "AC": item.ac_num,
            "ABS": item.abs_num,
            "Total": item.om_num + item.nb_num + item.nf_num + item.rnf_num + item.ac_num,
            "Absence Reason": `"${item.absence_reason}"`,
        })
    }
    return csv
}

export function getTodayDateStr() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    return date + '_' + time
}

export function downloadXLSX(data) {

    let excelData = '';

    // Prepare data for excel.You can also use html tag for create table for excel.
    data.forEach((rowItem, rowIndex) => {

        if (0 === rowIndex) {
            // This is for header.
            rowItem.forEach((colItem, colIndex) => {
                excelData += colItem + ',';
            });
            excelData += "\r\n";

        } else {
            // This is data.
            rowItem.forEach((colItem, colIndex) => {
                excelData += colItem + ',';
            })
            excelData += "\r\n";
        }
    });

    // Create the blob url for the file.
    //excelData = "data:text/xlsx," + encodeURI(excelData);

    //get datetime YYYYMMDDHHMMSS


    const csvData = excelData; // 用你的实际数据替换
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(csvData);
    const csvBlob = new Blob([utf8Bytes], { type: "text/csv;charset=utf-8" });

    // 2. 创建一个 Blob URL
    const csvUrl = URL.createObjectURL(csvBlob);

    // 3. 创建一个链接并下载 CSV 文件
    let a = document.createElement("a");
    a.setAttribute("href", csvUrl);
    a.setAttribute("download", `CGLs_${dateTime}.csv`);
    document.body.appendChild(a);
    a.click();
}


export function checkWeek(inputRange) {
    const parseDate = (str) => {
        const parts = str.split('/');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const getMonday = (date) => {
        date = new Date(date);
        const day = date.getDay() || 7;
        if (day !== 1)
            date.setHours(-24 * (day - 1));
        return date;
    };

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

    const getWeekRange = (date) => {
        const start = getMonday(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return formatDate(start) + '-' + formatDate(end);
    };

    const [inputStart, inputEnd] = inputRange.split('-').map(parseDate);

    const currentWeek = getWeekRange(new Date());
    const lastWeek = getWeekRange(new Date(new Date().setDate(new Date().getDate() - 7)));

    if (inputRange === currentWeek) {
        return 'This week';
    } else if (inputRange === lastWeek) {
        return 'Last week';
    } else {
        return null;
    }
}

/*
* // cg activity attendance
    cg_om_num: 0,
    cg_nb_num: 0,
    cg_nf_num: 0,
    cg_rnf_num: 0,
    cg_ac_num: 0,
    cg_abs_num: 0,
    cg_absence_reason: "",

    // service attendance
    service_om_num: 0,
    service_nb_num: 0,
    service_nf_num: 0,
    service_rnf_num: 0,
    service_ac_num: 0,
    service_abs_num: 0,
    service_absence_reason: "",
*
*
* */

export function getTotal(data){
    return data.cg_om_num + data.cg_nb_num + data.cg_nf_num + data.cg_rnf_num + data.cg_ac_num + data.cg_abs_num
        + data.service_om_num + data.service_nb_num + data.service_nf_num
        + data.service_rnf_num + data.service_ac_num + data.service_abs_num;
}


export function attendObjToCSV(data){
    let csvData = []
    for (let item of data){
        csvData.push({
            "Location": `"${item.satellite}"`,
            "Pastoral Team": `"${item.pastoral_team}"`,
            "CG Name": `"${item.cg_name}"`,
            "CGL Name": `"${item.cgl_name}"`,
            "CG OM": item.cg_om_num,
            "CG NB": item.cg_nb_num,
            "CG NF": item.cg_nf_num,
            "CG RNF": item.cg_rnf_num,
            "CG AC": item.cg_ac_num,
            "CG ABS": item.cg_abs_num,
            "CG Remarks": `"${item.cg_absence_reason}"`,
            "Service OM": item.service_om_num,
            "Service NB": item.service_nb_num,
            "Service NF": item.service_nf_num,
            "Service RNF": item.service_rnf_num,
            "Service AC": item.service_ac_num,
            "Service ABS": item.service_abs_num,
            "Service Remarks": `"${item.service_absence_reason}"`,
            "Numbering": item.total_members_num,
            "Total": getTotal(item),
            "created_at": `"${new Date(item.createdAt.seconds * 1000).toLocaleString()}"`,
            "updated_at": `"${new Date(item.updatedAt.seconds * 1000).toLocaleString()}"`,
        })
    }

    return csvData
}

export function dataCheck(data){
    // console.log(data)
    //integrityChecking(data)
    duplicateChecking(data)
}

function integrityChecking(data){
    for (let item of data){
        if(!data.cg_id || !data.cgl_name || !data.cg_name || !data.pastoral_team || !data.satellite || !data.user_sub){
            useDataCheckStore.getState().addIncompleteRecord(item)
        }
    }
}

function duplicateChecking(data){
    let duplicate = []
    let duplicateRecord = []
    for (let item of data){
        if(!duplicate.includes(item.cg_id)){
            duplicate.push(item.cg_id)
        }else{
            duplicateRecord.push(item)
        }
    }
    useDataCheckStore.getState().setDuplicateRecordsList(duplicateRecord)
}

// createAtObj can early than endDate in weekDurationStr("2021/08/01-2021/08/07") 2 days
export function timeDetect(weekDurationStr, createAtObj){
    const sunday = new Date(weekDurationStr.split("-")[1]+ " 12:59:59");
    const saturday = sunday.getTime() -24 * 60 * 60 * 1000;
    const saturdayObj = new Date(saturday);

    saturdayObj.setHours(12, 59, 59, 999);
    // console.log(saturdayObj.toLocaleString())
    // console.log(createAtObj.toLocaleString())
    return createAtObj >= saturdayObj;
}


function ifTimeCorrect(weekDurationStr, createAtObj){
    for (let item of data){
        const dateStr = item.date;
        const timeStr = item.time;
        const time = new Date(`${dateStr} ${timeStr}`);
        const now = new Date();
        if (time > now){
            return true
        }
    }
    return false
}

function timeChecking(data){
    for (let item of data){
        const dateStr = item.date;

    }
}


export  function isDateInRange(targetDate,dateRange) {
    const [rangeStart, rangeEnd] = dateRange.split('-');
    // 将输入的日期字符串转换为日期对象
    const targetDateTime = new Date(targetDate);
    const startDateTime = new Date(rangeStart + ' 00:00:00');
    const endDateTime = new Date(rangeEnd + ' 23:59:59');

    // 判断目标日期是否在范围内
    return targetDateTime >= startDateTime && targetDateTime <= endDateTime;
}

export async function isAdmin(user){
    // console.log(user)
    const email = user.email;
    const res =await queryAdminEmail(email);
    return res.length > 0;
}

export  function generateAllWeeklyRanges() {
    const startDate = new Date('2023-10-16'); // 固定起始日期
    const oneDayMs = 24 * 60 * 60 * 1000;
    const ranges = [];

    // 函数：获取指定日期所在周的周一和周日
    function getWeekRange(date) {
        const dayOfWeek = date.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日特殊处理
        const sundayOffset = 7 - dayOfWeek;

        const monday = new Date(date.getTime() + mondayOffset * oneDayMs);
        const sunday = new Date(date.getTime() + sundayOffset * oneDayMs);

        return {
            start: monday,
            end: sunday
        };
    }

    // 函数：格式化日期为 YYYY/MM/DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    let currentWeek = getWeekRange(startDate);

    while (true) {
        const rangeStr = `${formatDate(currentWeek.start)}-${formatDate(currentWeek.end)}`;
        ranges.push(rangeStr);

        // 检查是否到达当前周
        if (currentWeek.end >= new Date()) {
            break;
        }

        // 移动到下一周
        currentWeek = getWeekRange(new Date(currentWeek.start.getTime() + 7 * oneDayMs));
    }

    return ranges.reverse();
}

export function generateMonthlyRanges() {
    const startYear = 2023;
    const startMonth = 11; // 10 表示 10 月
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回 0-11 表示 1-12 月

    let year = startYear;
    let month = startMonth;
    const ranges = [];

    // 函数：格式化月份为 YYYY/MM
    function formatMonth(year, month) {
        const monthStr = month.toString().padStart(2, '0');
        return `${year}/${monthStr}`;
    }

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        ranges.push(formatMonth(year, month));

        // 更新年和月
        if (month === 12) {
            month = 1;
            year++;
        } else {
            month++;
        }
    }

    return ranges.reverse();
}

export function  getCoachOptions(data){
    let coachOptions = [];
    for (let item of data){
        coachOptions.push(item.coach_name)
    }
    return coachOptions
}

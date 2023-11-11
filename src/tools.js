// Some dummy data for user details.
// let data = [
//     [ 'Id', 'FirstName', 'LastName', 'Mobile', 'Address' ], // This is your header.
//     [ 1, 'Richard', 'Roe', '9874563210', 'Address' ],
//     [ 2, 'Joe', 'Doakes', '7896541230', 'Address' ],
//     [ 3, 'John', 'Smith', '8745632109', 'Address' ],
//     [ 4, 'Joe', 'Sixpack', '9875647890', 'Address' ],
//     [ 5, 'Richard', 'Thomson', '8632547890', 'Address' ]
// ];
import {almostWhole} from "chart.js/helpers";
import {readAllCGLs} from "./api/CGLs.js";

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
    let csv = [
        ['Date', 'Type', 'OM', 'NB', 'NF', 'RNF', 'AC', 'ABS', 'Total', 'Absence Reason'],
    ]

    for (let item of data) {

        csv.push([item.date, item.type, item.om_num, item.nb_num, item.nf_num, item.rnf_num,
        item.ac_num, item.abs_num, item.total_num, item.absence_reason])
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

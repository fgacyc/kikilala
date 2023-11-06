// Some dummy data for user details.
// let data = [
//     [ 'Id', 'FirstName', 'LastName', 'Mobile', 'Address' ], // This is your header.
//     [ 1, 'Richard', 'Roe', '9874563210', 'Address' ],
//     [ 2, 'Joe', 'Doakes', '7896541230', 'Address' ],
//     [ 3, 'John', 'Smith', '8745632109', 'Address' ],
//     [ 4, 'Joe', 'Sixpack', '9875647890', 'Address' ],
//     [ 5, 'Richard', 'Thomson', '8632547890', 'Address' ]
// ];
export function downloadCGLsData(data) {
    let csv = [
        ['CG leader', 'CG_name', 'pastoral_team', 'satellite'], // table header.
    ]

    for (let item of data) {
        csv.push([item.CG_leader, item.CG_name, item.pastoral_team, item.satellite])
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

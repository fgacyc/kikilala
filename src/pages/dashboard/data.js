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

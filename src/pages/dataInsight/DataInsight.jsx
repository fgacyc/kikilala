import {Modal, Progress, Select} from "@arco-design/web-react";
import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {useDataInsightStore} from "../../store/dataInsightStore.js";
import {useNavigate, useParams} from "react-router-dom";
import {readAllAttends} from "../../api/attendance.js";
import {readAllActiveCGLs} from "../../api/CGLs.js";
import {distanceBetweenPoints} from "chart.js/helpers";
import Header from "../Header/Header.jsx";

function filterAttendanceByMonth(currentMonth,attendanceData){
    if (!attendanceData) return;
    attendanceData = Object.values(attendanceData)
    return attendanceData.filter((item) => {
        let dateList = item.date.split('-')
        if (dateList[0].includes(currentMonth) || dateList[1].includes(currentMonth)) {
            return true
        }
    })
}

function isBeforeLastDayOfMonth(month, seconds) {
    // 将提供的月份字符串转换为日期对象（月份的第一天）
    const [year, monthStr] = month.split('/');
    const firstDayOfMonth = new Date(year, monthStr - 1, 1);

    // 获取下个月的第一天
    const firstDayOfNextMonth = new Date(year, monthStr, 1);

    // 获取本月的最后一天（下个月第一天的前一天）
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);

    // 将秒数转换为日期对象
    const dateFromTimestamp = new Date(seconds * 1000);

    // 比较日期，检查是否在本月最后一天之前
    const res =  dateFromTimestamp < lastDayOfMonth;
    // console.log(res)
    return res;
}

function filterCGLByMonth(currentMonth,connectGroupData){
    // console.log(currentMonth, connectGroupData)
    if(!connectGroupData) return;
    let connectGroupDataList = [];
    for (let item of connectGroupData){
        if (item.hasOwnProperty("createdAt")){
            isBeforeLastDayOfMonth(currentMonth, item.createdAt.seconds) && connectGroupDataList.push(item)
        }else{
            isBeforeLastDayOfMonth(currentMonth, item.updatedAt.seconds) && connectGroupDataList.push(item)
        }
    }
    return connectGroupDataList;
}

function AttendanceRateCard({team,data,submitTimes}){
    let submittedTimes = 0;
    for (let item of data){
        submittedTimes += item.attendance.length
    }
    const percent = submittedTimes/(submitTimes * data.length) *100;
    const percentFixed = percent.toFixed(2)

    // sort by attendance length
    data.sort((a,b) => {
        return a.attendance.length - b.attendance.length
    })

    return(
        <div className={"bg-white  min-w-[200px] m-3 rounded p-2"}>
            <div className={"flex flex-row w-full justify-between items-center mb-2"}>
                <div className={"font-bold"}>{team} </div>
                <Progress percent={percentFixed} width='60%'   />
            </div>
            <div>
                {
                    data.map((item, index) => (
                        <div key={index} className={"flex flex-row justify-between"}>
                            <div className={"truncate w-[80%]"}>{item.CG_leader}</div>
                            <div>{item.attendance.length} / {submitTimes}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default function DataInsight(){
    const {year,month} = useParams();
    const currentMonth = `${year}/${month}`;

    const [attendanceData, setAttendanceData,connectGroupData, setConnectGroupData] =
        useDataInsightStore(state =>
            [state.attendanceData, state.setAttendanceData,
                state.connectGroupData, state.setConnectGroupData
            ]);
    const [currentMonthAttendanceData, setCurrentMonthAttendanceData] = useState([])
    const [currentMonthCGLData, setCurrentMonthCGLData] = useState([])
    const [submitTimes, setSubmitTimes] = useState(0)
    const [pastoralTeamAttendMap, setPastoralTeamAttendMap] = useState(null)

    useEffect(() => {
        readAllAttends().then((res) => {
            // console.log(res)
            setAttendanceData(res);
        });
        readAllActiveCGLs().then((res) => {
            // console.log(res)
            setConnectGroupData(res);
        });


    }, []);

    useEffect(() => {
        setCurrentMonthAttendanceData(filterAttendanceByMonth(currentMonth,attendanceData))
        setCurrentMonthCGLData(filterCGLByMonth(currentMonth,connectGroupData))
    }, [attendanceData,connectGroupData]);

    useEffect(() => {
        if(!currentMonthAttendanceData || !currentMonthCGLData) return;
        // if (currentMonthAttendanceData.length === 0 || currentMonthCGLData.length === 0) return;
        // get how many times each cgl has been attended
        let timeDateList = [];
        for (let item of currentMonthAttendanceData){
            if (timeDateList.includes(item.date)) continue;
            timeDateList.push(item.date)
        }
        //console.log(timeDateList)
        setSubmitTimes(timeDateList.length)

        // group by pastoral_team use map
        let pastoralTeamMap = new Map();
        for (let item of currentMonthCGLData){
            if (pastoralTeamMap.has(item.pastoral_team)){
                pastoralTeamMap.get(item.pastoral_team).push(item)
            }else{
                pastoralTeamMap.set(item.pastoral_team, [item])
            }
        }
        // console.log(pastoralTeamMap)

        // bind attendance data to each cgl
        const cglAttendanceData = Object.values(currentMonthAttendanceData);
        for (let [key, value] of pastoralTeamMap){
            for (let item of value){
                item.attendance = cglAttendanceData.filter((attendance) => {
                    return attendance.cg_id=== item.CG_id
                })
            }
        }
        console.log(pastoralTeamMap)
        setPastoralTeamAttendMap(pastoralTeamMap)
    }, [currentMonthCGLData]);

    return(
        <div>
            {/*<Header />*/}
            <div className={"mx-6"}>
                <div className={"grid grid-cols-3 gap-2"}>
                    {
                        submitTimes !== 0 && pastoralTeamAttendMap !== null && Array.from(pastoralTeamAttendMap).map(([key, value], index) => (
                            <AttendanceRateCard key={index} team={key} data={value} submitTimes={submitTimes}/>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}



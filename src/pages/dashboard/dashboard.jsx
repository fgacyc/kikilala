import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {readAllAttends} from "../../api/attendance.js";
import {Button, Select, Spin} from "@arco-design/web-react";
import {kuchaGSPastoralTeams, kuchaYWPastoralTeams, pastoralTeams} from "../../config.js";
import DashboardAttendLineChart from "./dashboardAttendLineChart.jsx";
import {culChartData, getCurrentMonthCGLsNum} from "./data.js";
import {readAllActiveCGLs} from "../../api/CGLs.js";
import {IconClose} from "@arco-design/web-react/icon";
const Option = Select.Option;

function AttendanceSubmitSum({num, num1}){
    const percent = Math.round(num / num1 * 100)

    return (
        <div className={"flex flex-row items-end relative"}>
            <div className={"text-4xl font-bold mr-2"}>{num}</div>
            <div title={" Submission Rate"} className={"absolute right-[-30px]"} >
                {
                    percent >= 100 && <div className={"text-[12px] font-bold text-green-500"}>100%</div>
                }
                {
                    percent< 100 && percent >= 80 && <div className={"text-[12px] font-bold text-green-500"}>{percent}%</div>
                }
                {
                    percent< 80 &&percent >= 60 && <div className={"text-[12px] font-bold text-orange-500"}>{percent}%</div>
                }
                {
                    percent < 60 && <div className={"text-[12px] font-bold text-red-500"}>{percent}%</div>
                }
            </div>
        </div>
    )
}

function Statistic({type, num, num1}) {

    return (
        <div className={"text-center"}>
            {type === "Attendance Submit Sum"
                ? <div className={"shadow h-[100px] sm:m-5 m-2 rounded flex flex-col justify-center items-center"}>
                    {
                        (num || num===0) && num1 ? <AttendanceSubmitSum num={num} num1={num1}/>
                            : <Spin/>
                    }
                    <div className={"mt-2 font-semibold"}>{type}</div>
                </div>
                : <div className={"shadow h-[100px] sm:m-5 m-2 rounded flex flex-col justify-center items-center"}>
                    {
                        (num || num===0) ? <div className={"text-4xl font-bold"}>{num}</div>
                            : <Spin/>
                    }
                    <div className={"mt-2 font-semibold"}>{type}</div>
                </div>
            }
        </div>
)
}

export default function Dashboard() {
    const [allAttendanceData, setAllAttendanceData] = useState(null);
    const [filteredAttendanceData, setFilteredAttendanceData] = useState(null);
    const monthRanges = generateMonthlyRanges();
    pastoralTeams.unshift("All")
    const [currentMonth, setCurrentMonth] = useState(monthRanges[0])
    const [currentPastoralTeam, setCurrentPastoralTeam] = useState("All")
    const [currentKuchaiGSPastoralTeam, setCurrentKuchaiGSPastoralTeam] = useState("")
    const [chartData, setChartData] = useState(null)
    const [currentCGLNum, setCurrentCGLNum] = useState(0)
    const [allActiveCGLs, setAllActiveCGLs] = useState(null)
    const [dateNum, setDateNum] = useState(0)

    useEffect(() => {
        async  function fetchData() {
            const res = await readAllAttends();
            setAllAttendanceData(res);
            const currentMonthData = Object.values(res).filter((item) => item.date.includes(currentMonth));
            setFilteredAttendanceData(currentMonthData)
            // console.log(currentMonthData)

            setAllActiveCGLs(await readAllActiveCGLs())

            setCurrentCGLNum(await  getCurrentMonthCGLsNum(allActiveCGLs,currentMonth,currentPastoralTeam,currentKuchaiGSPastoralTeam))

            setDateNum(findDateNum(currentMonthData))
        }


        readAllAttends().then((res) => {
            setAllAttendanceData(res);
            const currentMonthData = Object.values(res).filter((item) => item.date.includes(currentMonth));
            setFilteredAttendanceData(currentMonthData)
            // console.log(currentMonthData)
        });

        readAllActiveCGLs().then((res) => {
            setAllActiveCGLs(res);
        })

        getCurrentMonthCGLsNum(allActiveCGLs,currentMonth,currentPastoralTeam,currentKuchaiGSPastoralTeam)
            .then((res) => {
                setCurrentCGLNum(res)
            })
    }, []);


    useEffect(() => {
        if (!allAttendanceData) return;
        if(currentPastoralTeam !== "Kuchai GS" &&  currentPastoralTeam !== "Kuchai YW")  setCurrentKuchaiGSPastoralTeam("")

        const records = Object.values(allAttendanceData);
        if (currentPastoralTeam === "All"){
            const currentMonthData = records.filter((item) => item.date.includes(currentMonth));
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }
        else if (currentPastoralTeam === "Kuchai GS" && currentKuchaiGSPastoralTeam !== ""){
            const currentMonthData =records.filter((item) =>
                item.date.includes(currentMonth) && item.pastoral_team === currentKuchaiGSPastoralTeam);
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }
        else if (currentPastoralTeam === "Kuchai YW" && currentKuchaiGSPastoralTeam !== ""){
            const currentMonthData =records.filter((item) =>
                item.date.includes(currentMonth) && item.pastoral_team === currentKuchaiGSPastoralTeam);
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }
        else{
            const currentMonthData = records.filter((item) => item.date.includes(currentMonth) && item.satellite === currentPastoralTeam);
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }

    }, [currentMonth, currentPastoralTeam,
        currentKuchaiGSPastoralTeam]);

    const cardType = [
        "Attendance Submit Sum",
        "CG Attendance Ave",
        "Service Attendance Ave",
        "NF Sum",
        "AC Sum",
        "Total Members Ave",
    ]

    const [cardData,setCardData] = useState([0,0,0,0,0,0] )




    useEffect(() => {
        if (!filteredAttendanceData) return;
        // cal card data
        setCardData(calculateData(filteredAttendanceData))
        // cal chart data
        setChartData(culChartData(filteredAttendanceData))



        getCurrentMonthCGLsNum(allActiveCGLs,currentMonth,currentPastoralTeam,currentKuchaiGSPastoralTeam)
            .then((res) => {
            setCurrentCGLNum(res)
        })

        setDateNum(findDateNum(filteredAttendanceData))

    }, [filteredAttendanceData]);

    function findDateNum(data){
        let dateList = [];
        for (let record of data){
            if (!dateList.includes(record.date)){
                dateList.push(record.date)
            }
        }
        return dateList.length;
    }


    function calculateData(data){
        const attendanceSubmit = data.length;
        const dateNum = findDateNum(data)

        const cgAttendance = data.reduce((acc, cur) => {
            return acc + cur.cg_om_num + cur.cg_nb_num + cur.cg_nf_num + cur.cg_rnf_num + cur.cg_ac_num;
        } ,0)
        const cgAttendanceAve = Math.round(cgAttendance/dateNum)

        const serviceAttendance = data.reduce((acc, cur) => {
            return acc + cur.service_om_num + cur.service_nb_num + cur.service_nf_num + cur.service_rnf_num+ cur.cg_ac_num;
        },0)
        const serviceAttendanceAve = Math.round(serviceAttendance/dateNum)

        const newFriends = data.reduce((acc, cur) => {
            return acc + cur.cg_nf_num + cur.service_rnf_num;
        },0)

        const acNum = data.reduce((acc, cur) => {
            return acc + cur.cg_ac_num + cur.service_ac_num;
        },0)

        const totalMembers = data.reduce((acc, cur) => {
            return acc + cur.total_members_num;
        },0)
        const totalMembersAve = Math.round(totalMembers/dateNum)


        return [attendanceSubmit,cgAttendanceAve,serviceAttendanceAve,newFriends,acNum,totalMembersAve]
    }

    // useEffect(() => {
    //     console.log(dateNum)
    // }, [dateNum]);

    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4 rounded"}>
            <div className={"flex flex-row  bg-white py-2 rounded-t"}>
                <Select placeholder='Please select month' className={"w-[150px] mr-2"}
                        value={currentMonth}
                        onChange={(value) => {
                            setCurrentMonth(value);
                        }}
                >
                    {monthRanges.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>

                <Select placeholder='Please select pastoral team' className={"w-[150px] mr-2"}
                        value={currentPastoralTeam}
                        onChange={(value) => {
                            setCurrentPastoralTeam(value);
                        }}
                >
                    {pastoralTeams.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>

                {
                    currentPastoralTeam === "Kuchai GS" &&
                   <div>
                       <Select placeholder='Please select pastoral team' className={"w-[200px] mr-2"}
                               value={currentKuchaiGSPastoralTeam}
                               onChange={(value) => {
                                   setCurrentKuchaiGSPastoralTeam(value);
                               }}
                       >
                           {kuchaGSPastoralTeams.map((option, index) => (
                               <Option key={index} value={option}>
                                   {option}
                               </Option>
                           ))}
                       </Select>
                       <Button shape='circle' type='secondary' icon={<IconClose />}
                         onClick={() => {
                             setCurrentKuchaiGSPastoralTeam("")
                         }}
                       />
                   </div>
                }

                {
                    currentPastoralTeam === "Kuchai YW" &&
                    <div>
                        <Select placeholder='Please select pastoral team' className={"w-[200px] mr-2"}
                                value={currentKuchaiGSPastoralTeam}
                                onChange={(value) => {
                                    setCurrentKuchaiGSPastoralTeam(value);
                                }}
                        >
                            {kuchaYWPastoralTeams.map((option, index) => (
                                <Option key={index} value={option}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                        <Button shape='circle' type='secondary' icon={<IconClose />}
                                onClick={() => {
                                    setCurrentKuchaiGSPastoralTeam("")
                                }}
                        />
                    </div>
                }

            </div>
            <div className={"bg-white p-2 rounded pb-2"}>
                <div className={"shadow-xl sm:m-2 m-1 bg-white"}>
                    <div className={"text-center text-2xl font-bold bg-white py-2 rounded-b"}>
                        Overall Statistics
                    </div>
                    <div className={"grid sm:grid-cols-3 sm:gap-4 grid-cols-2 gap-0 bg-white"}>
                        {
                            cardData.map((item, index) => (
                                <Statistic key={index} type={cardType[index]} num={cardData[index]} num1={currentCGLNum * dateNum } />
                            ))
                        }
                    </div>
                </div>
            </div>

            {/*<div className={"bg-white text-center pb-10"}>*/}
            {/*    <Select placeholder='Please select month' className={"w-[200px] mr-2"}*/}
            {/*            value={currentMonth}*/}
            {/*            onChange={(value) => {*/}
            {/*                setCurrentMonth(value);*/}
            {/*            }}*/}
            {/*    >*/}
            {/*        {monthRanges.map((option, index) => (*/}
            {/*            <Option key={index} value={option}>*/}
            {/*                {option}*/}
            {/*            </Option>*/}
            {/*        ))}*/}
            {/*    </Select>*/}
            {/*</div>*/}

            <div className={"bg-white p-2"}>
                <div className={"text-center text-2xl font-bold bg-white py-2 rounded-b"}>
                    Charts
                </div>
                <div className={"bg-white m-2"}>
                    <div className={"h-[300px] bg-white mb-10"}>
                        {
                            filteredAttendanceData && <DashboardAttendLineChart data={chartData} type={"Submit Num"}/>
                        }
                    </div>
                    <div className={"h-[300px] bg-white mb-10"}>
                        {
                            filteredAttendanceData && <DashboardAttendLineChart data={chartData} type={"Attend Num"}/>
                        }
                    </div>
                    <div className={"h-[300px] bg-white mb-10"}>
                        {
                            filteredAttendanceData && <DashboardAttendLineChart data={chartData} type={"Members Num"}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {readAllAttends} from "../../api/attendance.js";
import {Select} from "@arco-design/web-react";
import {kuchaGSPastoralTeams, pastoralTeams} from "../../config.js";
import DashboardAttendLineChart from "./dashboardAttendLineChart.jsx";
import {culChartData} from "./data.js";
const Option = Select.Option;


function Statistic({type,num}){
    return (
        <div className={"shadow h-[100px] m-5 rounded flex flex-col justify-center items-center"}>
            <div className={"text-4xl font-bold"}>{num}</div>
            <div className={"mt-2 font-semibold"}>{type}</div>
        </div>
    )
}

export default function Dashboard() {
    const [allAttendanceData, setAllAttendanceData] = useState(null);
    const [filteredAttendanceData, setFilteredAttendanceData] = useState(null);
    const monthRanges =generateMonthlyRanges();
    pastoralTeams.unshift("All")
    const [currentMonth, setCurrentMonth] = useState(monthRanges[0])
    const [currentPastoralTeam, setCurrentPastoralTeam] = useState("All")
    const [chartData, setChartData] = useState(null)


    useEffect(() => {
        readAllAttends().then((res) => {
            setAllAttendanceData(res);
            const currentMonthData = Object.values(res).filter((item) => item.date.includes(currentMonth));
            setFilteredAttendanceData(currentMonthData)
            // console.log(currentMonthData)
        });
    }, []);


    useEffect(() => {
        if (!allAttendanceData) return;
        if (currentPastoralTeam === "All"){
            const currentMonthData = Object.values(allAttendanceData).filter((item) => item.date.includes(currentMonth));
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }else{
            const currentMonthData = Object.values(allAttendanceData).filter((item) => item.date.includes(currentMonth) && item.satellite === currentPastoralTeam);
            //console.log(currentMonthData)
            setFilteredAttendanceData(currentMonthData)
        }
        //console.log(filteredAttendanceData)
    }, [currentMonth, currentPastoralTeam]);

    const cardType = [
        "Attendance Submit",
        "CG Attendance",
        "Service Attendance",
        "New Friends",
        "AC Num",
        "Total Members",
    ]

    const [cardData,setCardData] = useState([0,0,0,0,0,0] )


    useEffect(() => {
        if (!filteredAttendanceData) return;
        const calData = calculateData(filteredAttendanceData);
        setCardData(calData)
        setChartData(culChartData(filteredAttendanceData))
    }, [filteredAttendanceData]);



    function calculateData(data){
        const attendanceSubmit = data.length;
        const cgAttendance = data.reduce((acc, cur) => {
            return acc + cur.cg_om_num + cur.cg_nb_num + cur.cg_nf_num + cur.cg_rnf_num + cur.cg_ac_num;
        } ,0)

        const serviceAttendance = data.reduce((acc, cur) => {
            return acc + cur.service_om_num + cur.service_nb_num + cur.service_nf_num + cur.service_rnf_num+ cur.cg_ac_num;
        },0)

        const newFriends = data.reduce((acc, cur) => {
            return acc + cur.cg_nf_num + cur.service_rnf_num;
        },0)

        const acNum = data.reduce((acc, cur) => {
            return acc + cur.cg_ac_num + cur.service_ac_num;
        },0)

        const totalMembers = data.reduce((acc, cur) => {
            return acc + cur.total_members_num;
        },0)

        return [attendanceSubmit,cgAttendance,serviceAttendance,newFriends,acNum,totalMembers]
    }


    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4 "}>
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
                    <Select placeholder='Please select pastoral team' className={"w-[200px] mr-2"}
                            value={currentPastoralTeam}
                            onChange={(value) => {
                                setCurrentPastoralTeam(value);
                            }}
                    >
                        {kuchaGSPastoralTeams.map((option, index) => (
                            <Option key={index} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                }

            </div>
            <div className={"grid grid-cols-3 gap-4 bg-white"}>
                {
                    cardData.map((item, index) => (
                        <Statistic key={index} type={cardType[index]} num={cardData[index]}/>
                    ))
                }
            </div>
            <div className={"bg-white text-center pb-10"}>
                <Select placeholder='Please select month' className={"w-[200px] mr-2"}
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
            </div>
            <div className={"bg-white"}>
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
    )
}

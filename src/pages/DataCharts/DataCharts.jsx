import StatisticCard from "./StatisticCard.jsx";
import {useEffect, useState} from "react";
import {get} from "idb-keyval";
import {readAllAttends} from "../../api/attendance.js";
import {
    getMonthlyCGNumbering,
    getMonthlyNewFriends, getMonthlySalvation,
    getNumOfCGs,
    getServiceAttend, getSundayDate, getSundayDates,
    getWeeklyServiceAttend
} from "./calculation.js";
import SummaryLineChart from "./charts/SummaryLineChart.jsx";
import {PieChart} from "./charts/PieChart.jsx";

export  default  function DataCharts(){
    const [attendance,setAttendance] = useState([])
    const [monthlyCGNumbering,setMonthlyCGNumbering] = useState(0)
    const [monthlyNumOfCG,setMonthlyNumOfCG] = useState(0)
    const [monthlyServiceAttend,setMonthlyServiceAttend] = useState(0)
    const [weeklyServiceAttend,setWeeklyServiceAttend] = useState(0)
    const [monthlyNewFriends,setMonthlyNewFriends] = useState(0)
    const [monthlySalvation,setMonthlySalvation] = useState(0)

    useEffect(() => {
        async function getData(){
            const data  = await  get("kikilala-attendance");
            if(!data){
                const attendData =await readAllAttends();
                setAttendance(attendData);
            }else{
                setAttendance(data);
            }
        }
        getData();


        console.log( getSundayDate())
    }, []);

    useEffect(() => {
        if(!attendance) return;
        async function culData(){
            setMonthlyCGNumbering(getMonthlyCGNumbering(attendance,4))
            setMonthlyNumOfCG(await getNumOfCGs())
            setMonthlyServiceAttend(getServiceAttend(attendance,4));
            setWeeklyServiceAttend(getWeeklyServiceAttend(attendance));
            setMonthlyNewFriends(getMonthlyNewFriends(attendance,4));
            setMonthlySalvation(getMonthlySalvation(attendance,4   ));
            // getNumOfCGs()
        }
        culData();
    }, [attendance]);

    return (
        <div className={"w-full h-full bg-white"}>
            <div className={"w-full grid grid-cols-3 gap-4"}>
                <StatisticCard  title='Monthly CG Numbering ' value={monthlyCGNumbering}/>
                <StatisticCard  title='Monthly Num of CG' value={monthlyNumOfCG}/>
                <StatisticCard  title='Monthly Service Attend' value={monthlyServiceAttend}/>
                <StatisticCard  title='Weekly Service Attend' value={weeklyServiceAttend}/>
                <StatisticCard  title='Monthly New Friends' value={monthlyNewFriends}/>
                <StatisticCard  title='Monthly Salvation' value={monthlySalvation}/>
            </div>
           <div className={"m-4 shadow-xl"}>
               <SummaryLineChart />
           </div>
            <div className={"flex flex-row justify-between flex-wrap"}>
                <div className={"m-4 shadow-xl"}>
                    <PieChart title={"Weekly CG Numbering"} />
                </div>
                <div className={"m-4 shadow-xl"}>
                    <PieChart title={"Weekly Service Attend"} />
                </div>
                <div className={"m-4 shadow-xl"}>
                    <PieChart title={"Weekly New Friends"} />
                </div>
                <div className={"m-4 shadow-xl"}>
                    <PieChart title={"Weekly Salvation"} />
                </div>
            </div>
        </div>
    )
}

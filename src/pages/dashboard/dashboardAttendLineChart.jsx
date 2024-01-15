import React, { PureComponent } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import {Title} from "chart.js";

export default function DashboardAttendLineChart({data,type}) {

    // sort data by date
    if(data){
        data.sort((a,b) => {
            return a.name < b.name ? -1 : 1;
        })
    }
    // console.log(data)


    return (
        //<div>111</div>
        <ResponsiveContainer width="100%" height="100%">
            <div className={"text-center relative bottom-[-10px]"}>{type}</div>
            <LineChart
                layout="horizontal"
                // width={500}
                // height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis type="number" />
                <Tooltip />
                <Legend />
                <XAxis dataKey="name" type="category"  angle={0} textAnchor="end" />

                {
                    type === "Submit Num" &&  <Line dataKey="Attendance Submit" stroke="#33CC99" strokeWidth={2} />
                }
                {
                    type === "Attend Num" &&   <Line dataKey="CG Attendance" stroke="#3399CC" strokeWidth={2} />
                }
                {
                    type === "Attend Num" && <Line dataKey="Service Attendance" stroke="#33CC66" strokeWidth={2} />
                }
                {
                    type === "Members Num" &&  <Line dataKey="New Friends" stroke="#CC3399" strokeWidth={2} />
                }
                {
                    type === "Members Num" &&  <Line dataKey="AC Num" stroke="#CC9933" strokeWidth={2} />
                }
                {
                    type === "Attend Num" &&  <Line dataKey="Total Members" stroke="#9966CC" strokeWidth={2} />
                }
            </LineChart>
        </ResponsiveContainer>
    );
}

import React, { PureComponent } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import createTrend from "trendline";
import {addTrendLineToPoints} from "./data.js";

// function culTrend(data){
//
// }

export default function DashboardAttendLineChart({data,type}) {

    // sort data by date
    if(data){
        data.sort((a,b) => {
            return a.name < b.name ? -1 : 1;
        })
        data = addTrendLineToPoints(data);
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
                {/*<Legend*/}
                {/*    payload={[*/}
                {/*        {*/}
                {/*            value: "Attendance Submit",*/}
                {/*            type: "line",*/}
                {/*            id: "ID01",*/}
                {/*            color: "#33CC99",*/}
                {/*            hidden: true,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            value: "CG Attendance",*/}
                {/*            type: "line",*/}
                {/*            id: "ID02",*/}
                {/*            color: "#3399CC",*/}
                {/*            hidden: true,*/}
                {/*        },*/}
                {/*        {*/}
                {/*            value: "Service Attendance",*/}
                {/*            type: "line",*/}
                {/*            id: "ID03",*/}
                {/*            color: "#33CC66",*/}
                {/*            inactive: true,*/}
                {/*        }*/}
                {/*    ]}*/}
                {/*/>*/}
                <XAxis dataKey="name" type="category"  angle={0} textAnchor="end" />

                {
                    type === "Submit Num" &&  <Line dataKey="Attendance Submit" stroke="#33CC99" strokeWidth={2}  type="monotone"  />
                }

                {
                    type === "Attend Num" &&   <Line dataKey="CG Attendance" stroke="#CC9933" strokeWidth={2}  type="monotone" />
                }
                {
                    type === "Attend Num" &&   <Line dataKey="CG Attendance Trend Line" stroke="#CC9933" strokeWidth={2}
                                                     strokeDasharray="5 5" // 设置虚线样式
                                                     dot={{ stroke: '#CC9933', strokeWidth: 2, r: 0 }} // 添加点
                    />
                }

                {
                    type === "Attend Num" && <Line dataKey="Service Attendance" stroke="#33CC66" strokeWidth={2}  type="monotone" />
                }
                {
                    type === "Attend Num" && <Line dataKey="Service Attendance Trend Line" stroke="#33CC66" strokeWidth={2}
                                                   strokeDasharray="5 5" // 设置虚线样式
                                                   dot={{ stroke: '#33CC66', strokeWidth: 2, r: 0 }} // 添加点
                    />
                }
                {
                    type === "Attend Num" &&  <Line dataKey="Total Members" stroke="#fa5252" strokeWidth={2} type="monotone"  />
                }
                {
                    type === "Attend Num" &&  <Line dataKey="Total Members Trend Line" stroke="#fa5252" strokeWidth={2}
                                                    strokeDasharray="5 5" // 设置虚线样式
                                                    dot={{ stroke: '#fa5252', strokeWidth: 2, r: 0 }} // 添加点
                    />
                }


                {
                    type === "Members Num" &&  <Line dataKey="New Friends" stroke="#CC3399" strokeWidth={2} type="monotone"  />
                }
                {
                    type === "Members Num" &&  <Line dataKey="New Friends Trend Line" stroke="#CC3399" strokeWidth={2}
                                                     strokeDasharray="5 5" // 设置虚线样式
                                                     dot={{ stroke: '#CC3399', strokeWidth: 2, r: 0 }} // 添加点
                    />
                }
                {
                    type === "Members Num" &&  <Line dataKey="AC Num" stroke="#CC9933" strokeWidth={2} type="monotone"  />
                }
                {
                    type === "Members Num" &&  <Line dataKey="AC Num Trend Line" stroke="#CC9933" strokeWidth={2}
                                                     strokeDasharray="5 5" // 设置虚线样式
                                                     dot={{ stroke: '#CC3399', strokeWidth: 2, r: 0 }} // 添加点
                    />
                }

            </LineChart>
        </ResponsiveContainer>
    );
}

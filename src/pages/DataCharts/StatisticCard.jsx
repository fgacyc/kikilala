import {Statistic} from "@arco-design/web-react";

export  default function StatisticCard({title,value}){
    return (
        <div className={"shadow m-3 bg-white p-2"}>
            <Statistic title={title} value={value} groupSeparator style={{ marginRight: 60 }} />
        </div>
    )
}

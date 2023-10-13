import StatisticCard from "./StatisticCard.jsx";

export  default  function DataCharts(){
    return (
        <div className={"w-full h-full bg-white"}>
            <div className={"flex flex-row w-full justify-between"}>
                <StatisticCard  title='Downloads' value={100}/>
                <StatisticCard  title='Downloads' value={200}/>
                <StatisticCard  title='Downloads' value={300}/>
                <StatisticCard  title='Downloads' value={100}/>
                <StatisticCard  title='Downloads' value={200}/>
                <StatisticCard  title='Downloads' value={300}/>
            </div>
        </div>
    )
}

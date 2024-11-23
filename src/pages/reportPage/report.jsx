import { Button, Select, Statistic, Table } from "@arco-design/web-react";
import { generateMonthlyRanges, getReportDataTotal } from "../../tools.js";
import { useEffect, useState } from "react";
import { getAnylisisData } from "../../api/anylisisData.js";
import { IconRefresh } from "@arco-design/web-react/icon";
import { get, set } from "idb-keyval";
const Option = Select.Option;

function StatisticArea({ data }) {
    return (
        <>
            {data &&
                <div className={"grid sm:grid-cols-4 grid-cols-2 gap-4 px-4"}>
                    <Statistic title='Total CG' value={data.total_cg} groupSeparator />
                    <Statistic title='Total Numbering' value={data.total_numbering} groupSeparator />
                    <Statistic title='CG Avg Attn' value={data.CG_Avg} groupSeparator />
                    <Statistic title='Service Avg Attn' value={data.Service_Avg} groupSeparator />
                    <Statistic title='Total NF' value={data.total_nf} groupSeparator />
                    <Statistic title='Total AC' value={data.total_ac} groupSeparator />
                    <Statistic title='Submission Rate' value={data.submission_rate + "%"} groupSeparator />
                </div>
            }
        </>
    )
}


export default function Report() {
    const months = generateMonthlyRanges();
    const [currentMonth, setCurrentMonth] = useState(() => {
        // Initialize `currentMonth` with localStorage value or first month
        return localStorage.getItem("analyse-currentMonth") || months[0];
    });
    const [analyseData, setAnalyseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState(0);
    const [statisticData, setStatisticData] = useState(null);

    useEffect(() => {
        const fetchData = async (month) => {
            try {
                setIsLoading(true);
                const localData = await get(`analyseData-${month}`);
                const fetchedUpdateTime = await get(`analyseData-${month}-time`);
                console.log("localData", localData);
                if (localData) {
                    setAnalyseData(localData);
                    setIsLoading(false);
                    setUpdateTime(fetchedUpdateTime);
                    setStatisticData(getReportDataTotal(localData));
                } else {
                    updateData();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData(currentMonth);
    }, [currentMonth]);

    function updateData() {
        setIsLoading(true);
        getAnylisisData(currentMonth).then((data) => {
            console.log(data)
            if (data.status === true) {
                setAnalyseData(data.data);
                const updateTime = new Date().getTime();
                setUpdateTime(updateTime);
                set(`analyseData-${currentMonth}`, data.data)
                set(`analyseData-${currentMonth}-time`, updateTime)
                setStatisticData(getReportDataTotal(data.data));
            }
            setIsLoading(false);
        })
    }

    const columns = [
        {
            title: "Pastoral Team",
            dataIndex: "satellite_pastoral_team"
        },
        {
            title: 'Total CG',
            dataIndex: 'total_cg',
            sorter: (a, b) => a.total_cg - b.total_cg,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'Total Numbering',
            dataIndex: 'total_numbering',
            sorter: (a, b) => a.total_numbering - b.total_numbering,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'CG Avg Attn',
            dataIndex: 'CG_Avg',
            sorter: (a, b) => a.CG_Avg - b.CG_Avg,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'Service Avg Attn',
            dataIndex: 'Service_Avg',
            sorter: (a, b) => a.Service_Avg - b.Service_Avg,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'Total NF',
            dataIndex: 'total_nf',
            sorter: (a, b) => a.total_nf - b.total_nf,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'Total AC',
            dataIndex: 'total_ac',
            sorter: (a, b) => a.total_ac - b.total_ac,
            render: (text) => {
                return <div className={"text-center"}>{text}</div>
            }
        },
        {
            title: 'Submission Rate',
            dataIndex: 'submission_rate',
            sorter: (a, b) => a.submission_rate - b.submission_rate,
            render: (text) => {
                return <div className={"text-center"}>{`${text * 100}%`}</div>
            }
        }
    ];

    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: 96,
        pageSize: 20,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });

    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4 "}>
            <div className={"justify-between bg-white py-2 rounded-t flex flex-col"}>
                <div className={"flex justify-between"}>
                    <Select placeholder='Please select month' style={{ width: 250, marginBottom: 8 }}
                        value={currentMonth}
                        onChange={(value) => {
                            // window.open(`/nb-data-insight/${value}`, "_self")
                            setCurrentMonth(value);
                            localStorage.setItem("analyse-currentMonth", value);
                        }}
                    >
                        {months.map((option, index) => (
                            <Option key={index} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                    <div className={"flex items-center"}>
                        <div className={"text-gray-400"}>{
                            updateTime === 0 ? "" : `Update at: ${new Date(updateTime).toLocaleString()}`
                        }</div>
                        <Button type='secondary'
                            icon={<IconRefresh />}
                            className={"mx-2"}
                            onClick={updateData}
                        />
                    </div>
                </div>
                <div>
                    <Table columns={columns}
                        data={analyseData}
                        rowKey="satellite_pastoral_team"
                        loading={isLoading}
                        className={"w-full"}
                        pagination={pagination}
                        renderPagination={() => (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 10,
                                }}
                            >
                                {/*{paginationNode}*/}
                            </div>
                        )}
                    />
                </div>
                <StatisticArea data={statisticData} />
            </div>
        </div>
    )
}
import {Button, Select, Space, Table} from "@arco-design/web-react";
import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {getAnylisisData} from "../../api/anylisisData.js";
import {IconRefresh} from "@arco-design/web-react/icon";
import {get, set} from "idb-keyval";
const Option = Select.Option;

const satellite_pastoral_team = [
    "Kuchai_YW",
    "Kuchai_GS",
    "Serdang_YW",
    "Serdang_GS",
    "Kepong_YW",
    "Kepong_GS",
    "USJ_YW",
    "USJ_GS",
    "Setapak_YW",
    "Setapak_GS",
    "SGLong_YW",
    "SGLong_GS",
    "Seremban_YW"]


export default function Report() {
    const months = generateMonthlyRanges();
    const [currentMonth, setCurrentMonth] = useState("");
    const [analyseData, setAnalyseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const month = localStorage.getItem("analyse-currentMonth") || months[0];
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const localData = await get(`analyseData-${currentMonth}`);
            console.log("localData",localData)
            if (localData) {
                setAnalyseData(localData);
                setIsLoading(false);
                return;
            }

            updateData();
        }
        void fetchData();
    }, [currentMonth]);

    function updateData() {
        setIsLoading(true);
        getAnylisisData(currentMonth).then((data) => {
            console.log(data)
            if (data.status === true) {
                setAnalyseData(data.data);
                set(`analyseData-${currentMonth}`, data.data)
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
        },
        {
            title: 'Total Service',
            dataIndex: 'total_numbering',
            sorter: (a, b) => a.total_numbering - b.total_numbering,
        },
        {
            title: 'CG Avg',
            dataIndex: 'CG_Avg',
            sorter: (a, b) => a.CG_Avg - b.CG_Avg,
        },
        {
            title: 'Service Avg',
            dataIndex: 'Service_Avg',
            sorter: (a, b) => a.Service_Avg - b.Service_Avg,
        },
        {
            title: 'Total NF',
            dataIndex: 'total_nf',
            sorter: (a, b) => a.total_nf - b.total_nf,
        },
        {
            title: 'Total AC',
            dataIndex: 'total_ac',
            sorter: (a, b) => a.total_ac - b.total_ac,
        },
        {
            title: 'Submission Rate',
            dataIndex: 'submission_rate',
            sorter: (a, b) => a.submission_rate - b.submission_rate,
            render: (text) => {
                const percent = (text * 100).toFixed(2)
                return `${percent}%`
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
                    <Select placeholder='Please select month' style={{width: 250, marginBottom: 8}}
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
                    <Button type='secondary'
                            icon={<IconRefresh />}
                            className={"mr-2"}
                            onClick={updateData}
                    />
                </div>
                <div>
                    <Table columns={columns}
                           data={analyseData}
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
            </div>
        </div>
    )
}
import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { addRecord } from "../../api/records.js";
import {Button, Input, Popconfirm, Select, Space, Table} from "@arco-design/web-react";
import { deleteHeadcount, readAllHeadcounts } from "../../api/headcount.js";
import { satelliteList } from "../../config.js";
import { serviceTypeOptions } from "./headcountForm.jsx";
import {
    IconClockCircle,
    IconDelete,
    IconDownload,
    IconEdit,
    IconHome,
    IconNotification,
    IconSearch
} from "@arco-design/web-react/icon";
import PubSub from "pubsub-js";
import HeadCountDrawer from "./HeadcountDrawer.jsx";
import { useHeadCountStore } from "../../store/headcountStore.js";
import { useFormStore } from "../../store/formStore.js";
import WeekSelect from "../components/WeekSelect.jsx";
import {filterHeadcountByDate} from "../../api/attendance.js";
import {getWeekDatesArray} from "../formPage/data.js";
import HeadCountSummary from "./HeadcountSummary.jsx";
import HeadcountReminderModal from "./headcountReminderModal.jsx";
import HeadcountDownloadModal from "./HeadcountDownloadModal.jsx";

function NumCard({title, num}) {
    return (
        <div className={"flex flex-col items-center border p-2 rounded w-[70px]"}>
            <div className={"text-lg font-bold"}>{num}</div>
            <div>{title}</div>
        </div>
    )
}

function HeadCountCard({data}) {
    return (
        <div className={"border rounded p-2 relative"}>
            <div className={"flex justify-between mb-2"}>
                <div className={"text-lg font-bold"}>{data.satellite}</div>
                <div className={"text-lg "}>{data.headCount}</div>
            </div>

            <div className={"grid grid-cols-5 gap-2"}>
                {data.yw_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"YW"} num={data.yw_num} />
                </div>}
                {data.gs_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"GS"} num={data.gs_num} />
                </div>}
                {data.kids_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"Kids"} num={data.kids_num} />
                </div>}
                {data.cm_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"CM"} num={data.cm_num} />
                </div>}
                {data.parents_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"Parents"} num={data.parents_num} />
                </div>}
                {data.ac_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"AC"} num={data.ac_num} />
                </div>}
                {data.nf_num > 0 && <div className={"flex justify-between"}>
                    <NumCard title={"NF"} num={data.nf_num} />
                </div>}
            </div>
            <div className={"h-6"}></div>
            <div className={"flex w-full justify-between absolute bottom-1 text-gray-400"}>
                <div className={""}>{data.serviceType}</div>
                <div className={"mr-4"}><IconClockCircle />{data.dateTime}</div>
            </div>
        </div>
    )
}

function HeadCountTable() {
    const [headcountTableData, setHeadcountTableData] = useState(null);
            const [currentTableData, setCurrentTableData] = useState(null);
            const inputRef = useRef(null);
            const [headCountDrawerVisible, setHeadCountDrawerVisible] = useState(false);
            const [scrollX, setScrollX] = useState(window.innerWidth * 0.9);
            const setHeadCountDataStore = useHeadCountStore(state => state.setHeadCountData)
            const [currentWeek, setCurrentWeek] = useState(getWeekDatesArray(4)[3]);
            const [allHeadcountData, setAllHeadcountData] = useState(null);
            const [reminderModalVisible, setReminderModalVisible] = useState(false);
            const setCurrentHeadCountTableData = useHeadCountStore(state => state.setCurrentHeadCountTableData);
            const [downloadModalVisible, setDownloadModalVisible] = useState(false);
            const setHeadCountData = useHeadCountStore(state => state.setHeadCountData);

            useEffect(() => {
            void setHeadcountData();
            if (window.innerWidth < 768) {
            setScrollX(window.innerWidth * 3);
        }
            const subscription = PubSub.subscribe('REFRESH_HEADCOUNT_TABLE', () => {
            void setHeadcountData();
        });
            return () => {
            PubSub.unsubscribe(subscription);
        };
        }, []);

            function formatData(data) {
            // object to array
            let res = Object.values(data);
            for (let item of res) {
            item.createdAt = new Date(item.createdAt.seconds * 1000).toLocaleString();
            item.updatedAt = new Date(item.updatedAt.seconds * 1000).toLocaleString();
        }
            // console.log(res)
            return res;
        }

            async function setHeadcountData() {
            let res = await readAllHeadcounts();
            setAllHeadcountData(formatData(res));
            let headData = [];
            for (let key in res) {
            res[key].key = key;
            headData.push(res[key]);
        }
            setHeadcountTableData(headData);
            let localCurrentWeek = localStorage.getItem("headcount-current-week")
            if(!localCurrentWeek) // if no local cache
        {
            localCurrentWeek = currentWeek
        }else{ // have local cache
            setCurrentWeek(localCurrentWeek) // change selected value
        }

            headData = filterHeadcountByDate(headData,localCurrentWeek);
            console.log("filtered data",headData)
            setCurrentTableData(headData);
            if(headData){
            setHeadCountDataStore(headData);
        }

        }
            const columns = [
        {
            title: 'Service Location',
            width: 100,
            dataIndex: "satellite",
            sorter: (a, b) => a.satellite.localeCompare(b.satellite),
            filters: satelliteList,
            onFilter: (value, row) => {
            return row.satellite === value;
        },
            filterMultiple: false,
        },
        {
            title: 'Type',
            width: 100,
            dataIndex: 'serviceType',
            sorter: (a, b) => a.serviceType.localeCompare(b.serviceType),
            filters: serviceTypeOptions,
            onFilter: (value, row) => {
            return row.serviceType.toLowerCase() === value.toLowerCase();
        },
            filterMultiple: false,
        },
        {
            title: 'Date time',
            width: 150,
            dataIndex: 'dateTime',
            sorter: (a, b) => a.dateTime.localeCompare(b.dateTime),
            filterIcon: <IconSearch />,
            filterDropdown: ({filterKeys, setFilterKeys, confirm}) => {
            return (
            <div className='arco-table-custom-filter'>
            <Input.Search
            allowClear={true}
             ref={inputRef}
             searchButton
             placeholder='Please enter datetime'
             value={filterKeys[0] || ''}
             onChange={(value) => {
                 setFilterKeys(value ? [value] : []);
             }}
             onSearch={() => {
                 confirm();
             }}
        />
</div>
)
    ;
},
            onFilter: (value, row) => {
                return row.dateTime.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'YW',
            render: (_, record) => {
                return (
                    <div>
                        {record.yw_num === 0 ? "" : record.yw_num}
                    </div>
                );
            },
            width: 80,
            sorter: (a, b) => a.yw_num - b.yw_num,
        },
        {
            title: 'GS',
            render: (_, record) => {
                return (
                    <div>
                        {record.gs_num === 0 ? "" : record.gs_num}
                    </div>
                );
            },
            width: 80,
            sorter: (a, b) => a.gs_num - b.gs_num,
        },

        {
            title: 'Kids',
            render: (_, record) => {
                return (
                    <div>
                        {record.kids_num === 0 ? "" : record.kids_num}
                    </div>
                );
            },
            width: 90,
            sorter: (a, b) => a.kids_num - b.kids_num,
        },
        {
            title: 'CM',
            render: (_, record) => {
                return (
                    <div>
                        {record.cm_num === 0 ? "" : record.cm_num}
                    </div>
                );
            },
            width: 80,
            sorter: (a, b) => a.cm_num - b.cm_num,
        },
        {
            title: 'Parents',
            render: (_, record) => {
                return (
                    <div>
                        {record.parents_num === 0 ? "" : record.parents_num}
                    </div>
                );
            },
            width: 110,
            sorter: (a, b) => a.cm_num - b.cm_num,
        },
        {
            title: 'AC',
            render: (_, record) => {
                return (
                    <div>
                        {record.ac_num === 0 ? "" : record.ac_num}
                    </div>
                );
            },
            width: 80,
            sorter: (a, b) => a.yp_num - b.yp_num,
        },
        {
            title: 'NF',
            render: (_, record) => {
                return (
                    <div>
                        {record.nf_num === 0 ? "" : record.nf_num}
                    </div>
                );
            },
            width: 80,
            sorter: (a, b) => a.yp_num - b.yp_num,
        },
        {
            title: "Total",
            render: (_, record) => {
                return (
                    <div>
                        {record.headCount === 0 ? "" : record.headCount}
                    </div>
                );
            },
            width: 100,
            sorter: (a, b) => a.headCount - b.headCount,
        },
        {
            title: "Operation",
            fixed: "right",
            dataIndex: "op",
            render: (_, record) => (
                <div className={"flex flex-row"}>
                    <Button icon={<IconEdit />}
                        className={"mr-2"}
                        onClick={() => {
                            setHeadCountData(record);
                            setHeadCountDrawerVisible(true);
                        }}
                        type="secondary"
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete?'
                        onOk={() => {
                            //console.log(record);
                            deleteHeadcount(record.key).then((res) => {
                                setHeadcountData();
                            })
                        }}
                    >
                        <Button icon={<IconDelete />}
                            type="secondary"
                        ></Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    useEffect(() => {
        if(!currentWeek || !currentTableData) return;
        // console.log(currentWeek)
        // return;
        const currentData = filterHeadcountByDate(headcountTableData,currentWeek);
        setCurrentTableData(currentData);
        setCurrentHeadCountTableData(currentData);
    }, [currentWeek]);

    return <div className={"py-2"}>
        <div className={"mb-2 flex flex-row "}>
            <WeekSelect
                currentWeek={currentWeek}
                setCurrentWeek={(week)=>{
                    setCurrentWeek(week)
                    localStorage.setItem("headcount-current-week",week)
                }}
            />
            <div className={"flex flex-row"}>
                <Button type='secondary' icon={<IconDownload />} className={"ml-2"}
                        onClick={() => {
                            // setReminderModalVisible(true);
                            setDownloadModalVisible(true);
                        }}
                />
                <Button type='secondary' icon={<IconNotification />} className={"ml-2"}
                        onClick={() => {
                            // setReminderModalVisible(true);
                            setReminderModalVisible(true);
                        }}
                />
                <Button type='secondary' icon={<IconHome />} className={"ml-2"}
                        onClick={() => {
                            window.open("/headcount", "_self");
                        }}
                />
                {/*<Button type='secondary' className={"ml-2"}*/}
                {/*        onClick={() => {*/}
                {/*            // setReminderModalVisible(true);*/}
                {/*            check();*/}
                {/*        }}*/}
                {/*>Click</Button>*/}
            </div>
        </div>
        <div className={` grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 px-2`}>
            {
                currentTableData && currentTableData.length > 0 && currentTableData.map((item, index) => {
                    return <HeadCountCard data={item} key={index} />
                })
            }
        </div>
        {
            currentTableData && <Table columns={columns}
                data={currentTableData}
                renderPagination={(paginationNode) => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}
                    >
                        <Space>
                            <span className={"ml-4"}>Items: {currentTableData.length}</span>
                        </Space>
                        {paginationNode}
                    </div>
                )}
                scroll={{
                    x: scrollX,
                    y: window.innerHeight,
                }}
            />
        }
        <HeadCountSummary data={currentTableData} />
        <HeadCountDrawer setVisible={setHeadCountDrawerVisible} visible={headCountDrawerVisible} />
        {
            currentTableData&& currentTableData.length>0 && <HeadcountReminderModal  visible={reminderModalVisible} setVisible={setReminderModalVisible} />
        }
        <HeadcountDownloadModal  visible={downloadModalVisible} setVisible={setDownloadModalVisible} />
    </div>
}


export default function HeadCountManagement() {
    const { loginWithRedirect, user, isLoading } = useAuth0();

    useEffect(() => {
        if (isLoading) return;
        if (user) {
            addRecord({
                page: "HeadcountManagement",
                user_id: user.sub,
            });
            useFormStore.getState().setUserEmail(user.email);
            useFormStore.getState().setUserSub(user.sub);
            return;
        }
        loginWithRedirect();
    }, [isLoading])


    return (
        <div className={`h-full w-full sm:px-8 px-2  py-4`}>
            <div className={"bg-white rounded-lg pb-2"}>
                <HeadCountTable />
            </div>
        </div>
    )
}

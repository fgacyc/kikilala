import React, {useEffect, useRef, useState} from "react";
import {IconSearch} from "@arco-design/web-react/icon";
import {Input, Space, Table} from "@arco-design/web-react";
import {pastoralTeamList, satelliteList} from "../../config.js";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {absentCGLs} from "../../api/CGLs.js";

export  function AbsentCGLsTable({ className }) {
    const inputRef = useRef(null);
    const columns = [
        {
            title: 'CG leader',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.CG_leader
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.CG_leader.localeCompare(b.CG_leader),
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                return (
                    <div className='arco-table-custom-filter'>
                        <Input.Search
                            allowClear={true}
                            ref={inputRef}
                            searchButton
                            placeholder='Please enter name'
                            value={filterKeys[0] || ''}
                            onChange={(value) => {
                                setFilterKeys(value ? [value] : []);
                            }}
                            onSearch={() => {
                                confirm();
                            }}
                        />
                    </div>
                );
            },
            onFilter: (value, row) => {
                return row.CG_leader.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'CG Name',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.CG_name
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.CG_name.localeCompare(b.CG_name),
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                return (
                    <div className='arco-table-custom-filter'>
                        <Input.Search
                            allowClear={true}
                            ref={inputRef}
                            searchButton
                            placeholder='Please enter name'
                            value={filterKeys[0] || ''}
                            onChange={(value) => {
                                setFilterKeys(value ? [value] : []);
                            }}
                            onSearch={() => {
                                confirm();
                            }}
                        />
                    </div>
                );
            },
            onFilter: (value, row) => {
                return row.CG_name.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        // {
        //     title: "CG ID",
        //     dataIndex: 'key',
        //     filterIcon: <IconSearch />,
        //     filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
        //         return (
        //             <div className='arco-table-custom-filter'>
        //                 <Input.Search
        //                     allowClear={true}
        //                     ref={inputRef}
        //                     searchButton
        //                     placeholder='Please enter name'
        //                     value={filterKeys[0] || ''}
        //                     onChange={(value) => {
        //                         setFilterKeys(value ? [value] : []);
        //                     }}
        //                     onSearch={() => {
        //                         confirm();
        //                     }}
        //                 />
        //             </div>
        //         );
        //     },
        //     sorter: (a, b) => a.key.localeCompare(b.key),
        //     onFilter: (value, row) => {
        //         return row.key.toLowerCase().includes(value.toLowerCase());
        //     },
        //     onFilterDropdownVisibleChange: (visible) => {
        //         if (visible) {
        //             setTimeout(() => inputRef.current.focus(), 150);
        //         }
        //     }
        // },
        {
            title: 'Pastoral Team',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.pastoral_team
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.pastoral_team.localeCompare(b.pastoral_team),
            filters: pastoralTeamList,
            onFilter: (value, row) => {
                return row.pastoral_team.toLowerCase().includes(value.toLowerCase());
            },
            filterMultiple: false,
        },
        {
            title: 'Service Location',
            width: 180,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.satellite
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.satellite.localeCompare(b.satellite),
            filters: satelliteList,
            onFilter: (value, row) => {
                return row.satellite === value;
            },
            filterMultiple: false,
        }
    ];
    const currentSubmitData = useAttendanceStore(state => state.currentSubmitData);
    const [currentPendingData,setCurrentPendingData] = useAttendanceStore(state => [
        state.currentPendingData, state.setCurrentPendingData
    ]);
    const currentCGNumber  = useAttendanceStore(state => state.currentCGNumber);
    const currentWeek= useAttendanceStore(state => state.currentWeek);



    async function findAbsentMembers() {
        // console.log(currentSubmitData)
        // return;
        if (!currentSubmitData) return;
        if (currentSubmitData.length===0){
            setCurrentPendingData(null);
            return;
        }
        setCurrentPendingData(await absentCGLs(currentSubmitData));
    }

    useEffect(() => {
        findAbsentMembers();
    }, [currentSubmitData, currentWeek]);




    return (
        <>
            {
                currentPendingData && <Table columns={columns} data={currentPendingData} className={className}
                                    renderPagination={(paginationNode) => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: 10,
                                            }}
                                        >
                                            <Space>
                                                <span className={"mx-4 text-end truncate"}>
                                                    Items: {currentPendingData.length} / {currentCGNumber}
                                                </span>
                                            </Space>
                                            {paginationNode}
                                        </div>
                                    )}
                                    scroll={{
                                        x: window.innerWidth * 0.9,
                                        y: window.innerHeight,
                                    }}
                />
            }
        </>
    )
}


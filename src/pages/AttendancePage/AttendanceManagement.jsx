import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Popconfirm, Select, Space, Switch, Table } from '@arco-design/web-react';
import { deleteAttend, queryAttends, readAllAttends } from '../../api/attendance';
import { convertTableData, getWeekDatesArray } from '../formPage/data';
import {IconDelete, IconDownload, IconEdit, IconNotification, IconSearch} from '@arco-design/web-react/icon';
import { pastoralTeamList, satelliteList } from '../../config';
import AttendanceInfoEditModal from './AttendanceInfoEditModal';
import { useAuth0 } from "@auth0/auth0-react";
import { addRecord } from "../../api/records.js";
import { getCGLNum } from "../../api/CGLs.js";
import { useAttendanceStore } from "../../store/attendanceStore.js";
import { get } from "idb-keyval";
import useSelectedRowStore from '../../store/attendanceRecordStore.js';
import AttendanceDownloadModal from "./AttendanceDownloadModal.jsx";
import AttendanceReminder from "./AttendanceReminder.jsx";


const Option = Select.Option;

function AbsentCGLsTable({ currentWeek, currentCGNum, className }) {
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
    const [tableData, setTableData] = useState([])

    async function findAbsentMembers() {
        if (!currentSubmitData) return;

        let submitCGLs = currentSubmitData.map((item) => item.cg_id);
        let absentCGLs = [];
        const allCGLs = await get("kikilala-CGLs")
        for (let key in allCGLs) {
            allCGLs[key].key = key;
            if (!submitCGLs.includes(key)) {

                absentCGLs.push(allCGLs[key]);
            }
        }
        setTableData(absentCGLs);
    }

    useEffect(() => {
        findAbsentMembers()
    }, [currentSubmitData, currentWeek]);



    return (
        <>
            {
                tableData && <Table columns={columns} data={tableData} className={className}
                    renderPagination={(paginationNode) => (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 10,
                            }}
                        >
                            <Space>
                                <span className={"mx-4 text-end truncate"}>Items: {tableData.length} / {currentCGNum}</span>
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

const AttendanceTable = ({ onOpenModal, setAttendanceData, currentWeek, currentCGNum, className }) => {
    const inputRef = useRef(null);
    const [setSelectedRow] = useSelectedRowStore((state) => [state.setSelectedRow]);
    const columns = [
        {
            title: 'Date',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={'truncate'}>
                        {
                            record.date
                        }
                    </div>
                )
            },
            sorter: (a, b) => new Date(a.date.split('-')[0]) - new Date(b.date.split('-')[0]),
        },
        {
            title: 'CG Leader',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={'truncate'}>
                        {
                            record.cgl_name
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.cgl_name.localeCompare(b.cgl_name),
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
                return row.cgl_name.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            }
        },
        {
            title: 'Pastoral Team',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={'truncate'}>
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
                    <div className={'truncate'}>
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
        },

        {
            title: 'Numbering',
            width: 180,
            render: (_, record) => {
                return (
                    <div className={'truncate'}>
                        {
                            record.total_members_num
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.total_members_num - b.total_members_num,
            filters: [
                {
                    text: '> 10',
                    value: '10',
                },
                {
                    text: '> 20',
                    value: '20',
                },
                {
                    text: '> 30',
                    value: '30',
                },
                {
                    text: '> 40',
                    value: '40',
                },
                {
                    text: '> 50',
                    value: '50',
                }
            ],
            onFilter: (value, row) => row.total_members_num >= value,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Operation',
            width: 110,
            fixed: 'right',
            render: (_, record) => (
                <div>
                    <Button
                        icon={<IconEdit />}
                        className={'mr-2'}
                        onClick={() => {
                            onOpenModal();
                            setAttendanceData(record);
                            setSelectedRow(record);
                        }}
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='confirm'
                        content='Are you sure to delete this record?'
                        onOk={() => {
                            deleteAttend(record.id);
                            setAttendance(attendance.filter((item) => item.key !== record.key));
                        }}
                    >
                        <Button
                            icon={<IconDelete />}
                            type='secondary'
                        ></Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];
    const [attendance, setAttendance] = useState([])
    const setCurrentSubmitData = useAttendanceStore(state => state.setCurrentSubmitData);
    const selectedRow = useSelectedRowStore(state => state.selectedRow);

    useEffect(() => {
        async function getAttendance() {
            const attendance_data = await queryAttends(currentWeek);
            const updateattendanceData = convertTableData(attendance_data).map((item) => {
                if (selectedRow) {
                    if (item.id === selectedRow.id) {
                        return selectedRow;
                    }
                }
                return item;
            })
            setAttendance(updateattendanceData);
            setCurrentSubmitData(updateattendanceData);
        }
        getAttendance();
    }, [currentWeek, selectedRow])

    return (
        <div className={className}>
            {
                attendance &&
                <Table
                    columns={columns}
                    data={attendance}
                    renderPagination={(paginationNode) => (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 10,
                            }}
                        >
                            <Space>
                                <span className={"mx-4 text-end truncate"}>Items: {attendance.length} / {currentCGNum}</span>
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
        </div>
    )
}



const AttendanceManagement = () => {
    const [visible, setVisible] = useState(false);
    const [attendanceRecord, setAttendanceRecord] = useState({});
    const [dateArray, setDateArray] = useState([])
    const buttonsNumber = 4
    const [currentCGNum, setCurrentCGNum] = useState(0)
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const [initAttendData, currentWeek, setCurrentWeek, showSubmitted, setShowSubmitted] = useAttendanceStore(state => [
        state.initAttendData, state.currentWeek, state.setCurrentWeek, state.showSubmitted, state.setShowSubmitted]);
    const [attendanceDownloadModalVisible, setAttendanceDownloadModalVisible] = useState(false);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);

    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
        getCGLNum().then((res) => {
            console.log(res)
            setCurrentCGNum(res);
        });
        initAttendData();
    }, []);

    useEffect(() => {
        if (dateArray[3] && currentWeek === "") {
            setCurrentWeek(dateArray[3]);
        }
    }, [dateArray]);

    useEffect(() => {
        if (isLoading) return;
        if (user) {
            addRecord({
                page: "AttendanceManagement",
                user_id: user.sub,
            });
            return;
        }
        loginWithRedirect();
    }, [isLoading])


    const onOpenModal = () => {
        setVisible(true);
    }

    const setAttendanceData = (record) => {
        setAttendanceRecord(record);
    }

    return (
        <div className={"h-full w-full sm:px-8 px-2  py-4 "}>
            <div className={"bg-white pt-2 rounded"}>
                {
                    dateArray && <div className={"flex flex-row justify-between bg-white"}>
                        <div className={"flex flex-row flex-wrap"}>
                            <Select placeholder='Please select' style={{ width: 250,marginBottom:8 }} allowClear
                                    value={currentWeek}
                                    onChange={(value) => {
                                        setCurrentWeek(value);
                                    }}
                            >
                                {dateArray.slice().reverse().map((option, index) => (
                                    <Option key={index} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                            <div>
                                <Button type='secondary' icon={<IconDownload />} className={"ml-2"}
                                        onClick={() => {
                                            setAttendanceDownloadModalVisible(true);
                                        }}
                                />
                                <Button type='secondary' icon={<IconNotification />} className={"ml-2"}
                                        onClick={() => {
                                            setReminderModalVisible(true);
                                        }}
                                />
                            </div>
                        </div>

                        <Switch
                            type='round'
                            checkedText='Submitted'
                            uncheckedText='Pending'
                            checked={showSubmitted}
                            className={"bg-[#C9CDD4]"}
                            onChange={(value) => {
                                setShowSubmitted(value);
                            }}
                        />
                    </div>
                }

                <div className={"bg-white rounded-lg pb-2"}>
                    <AttendanceTable
                        onOpenModal={onOpenModal}
                        setAttendanceData={setAttendanceData}
                        currentWeek={currentWeek}
                        currentCGNum={currentCGNum}
                        className={showSubmitted === false ? 'hidden' : 'block'}
                    />
                    <AbsentCGLsTable
                        currentWeek={currentWeek}
                        currentCGNum={currentCGNum}
                        className={!showSubmitted === false ? 'hidden' : 'block'}
                    />

                </div>
            </div>
            {
                attendanceRecord && <AttendanceInfoEditModal
                    visible={visible}
                    setVisible={setVisible}
                    attendanceRecord={attendanceRecord}
                />
            }
            <AttendanceDownloadModal setVisible={setAttendanceDownloadModalVisible} visible={attendanceDownloadModalVisible} />
            <AttendanceReminder setVisible={setReminderModalVisible} visible={reminderModalVisible} />
        </div>
    )
}

export default AttendanceManagement

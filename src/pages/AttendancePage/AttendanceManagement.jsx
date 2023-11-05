import React, { useEffect, useRef, useState } from 'react'
import {Button, Input, Popconfirm, Select, Space, Switch, Table} from '@arco-design/web-react';
import {deleteAttend, queryAttends, readAllAttends} from '../../api/attendance';
import {convertCGLTableData, getWeekDatesArray} from '../formPage/data';
import { IconDelete, IconEdit, IconSearch } from '@arco-design/web-react/icon';
import { pastoralTeamList, satelliteList } from '../../config';
import AttendanceInfoEditModal from './AttendanceInfoEditModal';
import { useFormStore } from '../../store/formStore';
import {useAuth0} from "@auth0/auth0-react";
import {addRecord} from "../../api/records.js";
import {getCGLNum} from "../../api/CGLs.js";


const Option = Select.Option;
const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled'];

function AbsentCGLsTable({currentWeek,currentCGNum}){
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Salary',
            dataIndex: 'salary'
        },
        {
            title: 'Address',
            dataIndex: 'address'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        }
    ];
    const data = [
        {
            key: '1',
            name: 'Jane Doe',
            salary: 23000,
            address: '32 Park Road, London',
            email: 'jane.doe@example.com'
        },
        {
            key: '2',
            name: 'Alisa Ross',
            salary: 25000,
            address: '35 Park Road, London',
            email: 'alisa.ross@example.com'
        },
        {
            key: '3',
            name: 'Kevin Sandra',
            salary: 22000,
            address: '31 Park Road, London',
            email: 'kevin.sandra@example.com'
        },
        {
            key: '4',
            name: 'Ed Hellen',
            salary: 17000,
            address: '42 Park Road, London',
            email: 'ed.hellen@example.com'
        },
        {
            key: '5',
            name: 'William Smith',
            salary: 27000,
            address: '62 Park Road, London',
            email: 'william.smith@example.com'
        }
    ];

    return(
        <Table columns={columns} data={data} />
    )
}

const AttendanceTable = ({ onOpenModal, setAttendanceData ,currentWeek,currentCGNum}) => {
    const inputRef = useRef(null);
    const columns = [
        {
            title: 'Date',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={'w-[200px] truncate'}>
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
            width: 150,
            render: (_, record) => {
                return (
                    <div className={'w-[200px] truncate'}>
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
            width: 150,
            render: (_, record) => {
                return (
                    <div className={'w-[150px] truncate'}>
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
            width: 130,
            render: (_, record) => {
                return (
                    <div className={'w-[150px] truncate'}>
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
            title: 'Total members',
            width: 120,
            render: (_, record) => {
                return (
                    <div className={'w-[150px] truncate'}>
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
            width: 120,
            render: (_, record) => (
                <div>
                    <Button
                        icon={<IconEdit />}
                        className={'mr-2'}
                        onClick={() => {
                            onOpenModal();
                            setAttendanceData(record);
                        }}
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='confirm'
                        content='Are you sure to delete this record?'
                        onOk={() => {
                            deleteAttend(record.key);
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
    const [allAttendance, setAllAttendance] = useState([]);
    const [attendance, setAttendance] = useState([])
    const [rowKey, total_members_num] = useFormStore((state) => [state.rowKey, state.total_members_num]);
    const [absentCGLs,setAbsentCGLs] = useState([])


    useEffect(() => {
        async function getAttendance() {
            const attendance_data = await queryAttends(currentWeek);
            // console.log(attendance_data)
            const updateattendanceData = convertCGLTableData(attendance_data).map((item) => {
                if (item.key === rowKey) {
                    return {
                        ...item,
                        total_members_num: total_members_num,
                    }
                }
                return item;
            })
            setAllAttendance(updateattendanceData);
            setAttendance(updateattendanceData);
            // findAbsentMembers();
        }
        getAttendance();
    }, [currentWeek])



    // async  function findAbsentMembers(){
    //     const allCGLs =await get("kikilala-CGLs")
    //     // console.log(allCGLs)
    //     let allMembers = []
    //     for (let item in allCGLs){
    //         allMembers.push(allCGLs[item].CG_name)
    //     }
    //
    //     let attendanceMembers = []
    //     for (let item in attendance){
    //         attendanceMembers.push(attendance[item].cg_name)
    //     }
    //
    //     let absentMembers = []
    //     for (let item in allMembers){
    //         if (!attendanceMembers.includes(allMembers[item])){
    //             absentMembers.push(allMembers[item])
    //         }
    //     }
    //     setAbsentCGLs(absentMembers)
    // }




    return (
        <>
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
        </>
    )
}



const AttendanceManagement = () => {
    const [visible, setVisible] = useState(false);
    const [attendanceRecord, setAttendanceRecord] = useState({});
    const [dateArray,setDateArray] = useState([])
    const buttonsNumber = 4
    const [currentWeek,setCurrentWeek] = useState("")
    const [currentCGNum,setCurrentCGNum] = useState(0)
    const { loginWithRedirect,user,isLoading } = useAuth0();
    const [switchStatus, setSwitchStatus] = useState(true);


    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
        getCGLNum().then((res) => {
            setCurrentCGNum(res);
        });
    }, []);

    useEffect(() => {
        // console.log(dateArray[0])
        setCurrentWeek(dateArray[3]);
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
        <div className={"h-full w-full p-8"}>
            {
                dateArray && <div className={"flex flex-row justify-between mb-2"}>
                    <Select placeholder='Please select' style={{ width: 250 }} allowClear
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

                    <Switch
                        type='round'
                        checkedText='Submitted'
                        uncheckedText='Pending'
                        defaultChecked
                        className={"bg-[#C9CDD4]"}
                        onChange={(value) => {
                            setSwitchStatus(value);
                        }}
                    />
                </div>
            }

            <div className={"bg-white rounded-lg pb-2"}>
                {
                    switchStatus
                    ? <AttendanceTable onOpenModal={onOpenModal}
                                                     setAttendanceData={setAttendanceData}
                                                     currentWeek={currentWeek}
                                                     currentCGNum={currentCGNum}
                    />
                    : <AbsentCGLsTable
                            currentWeek={currentWeek}
                            currentCGNum={currentCGNum}
                        />
                }

            </div>
            {
                attendanceRecord && <AttendanceInfoEditModal
                    visible={visible}
                    setVisible={setVisible}
                    attendanceRecord={attendanceRecord}
                />
            }
        </div>
    )
}

export default AttendanceManagement

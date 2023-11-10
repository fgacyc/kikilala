import React, {useEffect, useRef, useState} from "react";
import useSelectedRowStore from "../../store/attendanceRecordStore.js";
import {IconDelete, IconEdit, IconSearch} from "@arco-design/web-react/icon";
import {Button, Input, Popconfirm, Space, Table} from "@arco-design/web-react";
import {pastoralTeamList, satelliteList} from "../../config.js";
import {deleteAttend, queryAttends} from "../../api/attendance.js";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {convertTableData} from "../formPage/data.js";
import AttendanceInfoEditModal from "./AttendanceInfoEditModal.jsx";

export const AttendanceTable = ({  currentWeek, currentCGNum, className }) => {
    const inputRef = useRef(null);
    const [selectedRow,setSelectedRow] =
        useSelectedRowStore((state) => [
            state.selectedRow, state.setSelectedRow
        ]);
    const [editModalVisible, setEditModalVisible] = useState(false);
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
                            setEditModalVisible(true);
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
    const [currentSubmitData,setCurrentSubmitData] = useAttendanceStore(state => [
        state.currentSubmitData, state.setCurrentSubmitData
    ]);


    useEffect(() => {
        async function getAttendance() {
            const attendance_data = await queryAttends(currentWeek);
            const updateAttendanceData = convertTableData(attendance_data);
            setCurrentSubmitData(updateAttendanceData);
        }
        getAttendance();
    }, [currentWeek, selectedRow])

    return (
        <div className={className}>
            {
                currentSubmitData &&
                <Table
                    columns={columns}
                    data={currentSubmitData}
                    renderPagination={(paginationNode) => (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 10,
                            }}
                        >
                            <Space>
                                <span className={"mx-4 text-end truncate"}>Items: {currentSubmitData.length} / {currentCGNum}</span>
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
            <AttendanceInfoEditModal
                visible={editModalVisible}
                setVisible={setEditModalVisible}
                attendanceRecord={selectedRow}
            />
        </div>
    );
}

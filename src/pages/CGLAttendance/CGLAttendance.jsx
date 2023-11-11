import React, { useEffect, useState } from 'react'
import { readAttendByCGName } from '../../api/attendance';
import {Button, Space, Table} from '@arco-design/web-react';
import {IconArrowLeft, IconDownload, IconHistory} from "@arco-design/web-react/icon";
import {useNavigate, useParams} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { attendanceTypeList } from '../../config';
import CsvDownload from "react-csv-downloader";
import { downloadCGLAttendanceData, getTodayDateStr } from '../../tools';
import {readCGLNameByCGName} from "../../api/CGLs.js";
import {useAuth0} from "@auth0/auth0-react";

const CGLAttendance = () => {
    const params = useParams()
    const [attendanceData, setAttendanceData] = useState([{}]);
    const [CGLName, setCGLName] = useState('');
    const columns = [
        {
            key: 'date',
            title: 'Date',
            dataIndex: 'date',
            width: 120,
            render: (_, record) => <div>{record.date}</div>,
            sorter: (a, b) => new Date(a.date.split('-')[0]) - new Date(b.date.split('-')[0]),
        },
        {
            key: 'type',
            title: 'Type',
            dataIndex: 'type',
            width: 85,
            render: (_, record) => <div>{record.type}</div>,
            sorter: (a, b) => a.type.localeCompare(b.type),
            filters: attendanceTypeList,
            onFilter: (value, row) => {
                return row.type.toLowerCase().includes(value.toLowerCase());
            },
            filterMultiple: false,
        },
        {
            key: 'om_num',
            title: 'OM',
            dataIndex: 'om_num',
            width: 50,
            render: (_, record) => <div>{record.om_num}</div>,
            sorter: (a, b) => a.om_num - b.om_num,
        },
        {
            key: 'nb_num',
            title: 'NB',
            dataIndex: 'nb_num',
            width: 50,
            render: (_, record) => <div>{record.nb_num}</div>,
            sorter: (a, b) => a.nb_num - b.nb_num,
        },
        {
            key: 'nf_num',
            title: 'NF',
            dataIndex: 'nf_num',
            width: 50,
            render: (_, record) => <div>{record.nf_num}</div>,
            sorter: (a, b) => a.nf_num - b.nf_num,
        },
        {
            key: 'rnf_num',
            title: 'RNF',
            dataIndex: 'rnf_num',
            width: 50,
            render: (_, record) => <div>{record.rnf_num}</div>,
            sorter: (a, b) => a.rnf_num - b.rnf_num,
        },
        {
            key: 'ac_num',
            title: 'AC',
            dataIndex: 'ac_num',
            width: 50,
            render: (_, record) => <div>{record.ac_num}</div>,
            sorter: (a, b) => a.ac_num - b.ac_num,
        },
        {
            key: 'abs_num',
            title: 'ABS',
            dataIndex: 'abs_num',
            width: 50,
            render: (_, record) => <div>{record.abs_num}</div>,
            sorter: (a, b) => a.abs_num - b.abs_num,
        },
        // {
        //     key: 'total_num',
        //     title: 'Numbering',
        //     dataIndex: 'total_num',
        //     width: 50,
        //     render: (_, record) => <div>{record.total_num}</div>,
        //     sorter: (a, b) => a.total_num - b.total_num,
        // },
        {
            key: 'total_num',
            title: 'Total',
            //dataIndex: 'total_num',
            width: 50,
            render: (_, record) => <div>{record.om_num + record.nb_num + record.nf_num + record.rnf_num + record.ac_num  }</div>,
            //sorter: (a, b) => a.total_num - b.total_num,
        }
    ];
    const { loginWithRedirect,user,isLoading } = useAuth0();
    const navigate = useNavigate();

    async function getCGLAttendance() {
        const attendance_data = await readAttendByCGName(params.cg_name);
        const transform_attendance_data = transformData(attendance_data)
            .sort((a, b) => new Date(b.date.split('-')[0]) - new Date(a.date.split('-')[0]))
        // console.log(transform_attendance_data)
        setAttendanceData(transform_attendance_data);
        const CGLNameQ =await readCGLNameByCGName(params.cg_name);
        setCGLName(CGLNameQ.CG_leader);
    }

    useEffect(() => {
        if (isLoading) return;
        if (user) {
            getCGLAttendance();
            return;
        }
        loginWithRedirect();
    }, [isLoading])



    const transformData = (data) => {
        return data.flatMap(item => {
            // Create a new object for "cg" data
            const cgData = {
                key: uuidv4(),
                type: "CG",
                date: item.date,
                ac_num: item.cg_ac_num,
                nb_num: item.cg_nb_num,
                abs_num: item.cg_abs_num,
                nf_num: item.cg_nf_num,
                om_num: item.cg_om_num,
                rnf_num: item.cg_rnf_num,
                total_num: item.total_members_num,
                absence_reason: "Absence_reason: " + item.cg_absence_reason,
            };

            // Create a new object for "service" data
            const serviceData = {
                key: uuidv4(),
                type: "Service",
                date: item.date,
                ac_num: item.service_ac_num,
                nb_num: item.service_nb_num,
                abs_num: item.service_abs_num,
                nf_num: item.service_nf_num,
                om_num: item.service_om_num,
                rnf_num: item.service_rnf_num,
                total_num: item.total_members_num,
                absence_reason: "Absence_reason: " + item.service_absence_reason,
            };

            return [cgData, serviceData];
        });
    }

    return (
        <div className='p-10'>
            <div className='flex flex-row text-white text-3xl mb-2 justify-between flex-wrap'>
                <div className={`w-[44px] h-[44px] bg-[#313131] rounded-[8px] mr-2
                                hover:bg-gray-200 hover:text-[#313131] cursor-pointer
                                flex flex-row items-center justify-center mb-[10px]`}
                     // onClick={() => viewHistory()}
                >
                    <IconArrowLeft  fontSize={24} onClick={
                        () => navigate("/")
                    } />
                </div>
               <div>
                   <b className='text-[#313131] mb-2'>{
                       CGLName === '' ? '' : CGLName+ "'s "
                   }</b>
                   <div>Connect Group Attendance</div>
               </div>
            </div>
            <div className={"bg-white pb-4"}>
                {
                    attendanceData.length !== 1 && <Table
                        columns={columns}
                        data={attendanceData}
                        expandedRowRender={(record) => record.absence_reason}
                        expandProps={{
                            width: window.innerWidth > 768 ? 15 : 25,
                            expandRowByClick: true,
                            rowExpandable: (record) => record.absence_reason !== null && record.absence_reason !== ''
                                && record.absence_reason !== 'Absence_reason: ',
                        }}
                        scroll={{
                            x: window.innerWidth * 0.9,
                            y: window.innerHeight,
                        }}
                        renderPagination={(paginationNode) => (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 10,
                                }}
                            >
                                <Space>
                                    <span className={"ml-4"}>Items: {attendanceData.length}</span>
                                </Space>
                                {paginationNode}
                            </div>
                        )}
                    />
                }
            </div>

            <div className='flex justify-end my-2'>
                <Button
                    type='secondary'
                    icon={<IconDownload/>}>
                    <CsvDownload
                        filename={`${CGLName}'s_CG_attendance_${getTodayDateStr()}`}
                        extension={".csv"}
                        text={"Download"}
                        datas={downloadCGLAttendanceData(attendanceData)}
                    />
                </Button>
            </div>
        </div>
    )
}

export default CGLAttendance

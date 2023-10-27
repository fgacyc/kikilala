import React, { useEffect, useState } from 'react'
import { readAttendByCGName } from '../../api/attendance';
import { Table } from '@arco-design/web-react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CGLAttendance = () => {
    const params = useParams()
    const [attendanceData, setAttendanceData] = useState([{}]);

    const columns = [
        {
            key: 'date',
            title: 'Date',
            width: 120,
            render: (_, record) => <div>{record.date}</div>,
            sorter: (a, b) => new Date(b.date.split('-')[0]) - new Date(a.date.split('-')[0]),
        },
        {
            key: 'type',
            title: 'Type',
            width: 85,
            render: (_, record) => <div>{record.type}</div>,
            sorter: (a, b) => a.type.localeCompare(b.type),
            filters: [
                {
                    text: 'CG',
                    value: 'CG',
                },
                {
                    text: 'Service',
                    value: 'Service',
                }
            ],
            onFilter: (value, row) => {
                return row.type.toLowerCase().includes(value.toLowerCase());
            },
            filterMultiple: false,
        },
        {
            key: 'om_num',
            title: 'OM',
            width: 50,
            render: (_, record) => <div>{record.om_num}</div>,
            sorter: (a, b) => a.om_num - b.om_num,
        },
        {
            key: 'nb_num',
            title: 'NB',
            width: 50,
            render: (_, record) => <div>{record.nb_num}</div>,
            sorter: (a, b) => a.nb_num - b.nb_num,
        },
        {
            key: 'nf_num',
            title: 'NF',
            width: 50,
            render: (_, record) => <div>{record.nf_num}</div>,
            sorter: (a, b) => a.nf_num - b.nf_num,
        },
        {
            key: 'rnf_num',
            title: 'RNF',
            width: 50,
            render: (_, record) => <div>{record.rnf_num}</div>,
            sorter: (a, b) => a.rnf_num - b.rnf_num,
        },
        {
            key: 'ac_num',
            title: 'AC',
            width: 50,
            render: (_, record) => <div>{record.ac_num}</div>,
            sorter: (a, b) => a.ac_num - b.ac_num,
        },
        {
            key: 'abs_num',
            title: 'ABS',
            width: 50,
            render: (_, record) => <div>{record.abs_num}</div>,
            sorter: (a, b) => a.abs_num - b.abs_num,
        },
    ];

    useEffect(() => {
        async function getCGLAttendance() {
            const attendance_data = await readAttendByCGName(params.cg_name);
            const transform_attendance_data = transformData(attendance_data)
                .sort((a, b) => new Date(b.date.split('-')[0]) - new Date(a.date.split('-')[0]))
            setAttendanceData(transform_attendance_data);
        }

        getCGLAttendance();
    }, [])

    const transformData = (data) => {
        return data.flatMap(item => {
            // Create a new object for "cg" data
            const cgData = {
                key: uuidv4(),
                type: "CG",
                date: item.date,
                ac_num: item.cg_ac_num,
                nb_num: item.cg_nb_num,
                abs_num: item.cg_nbs_num,
                nf_num: item.cg_nf_num,
                om_num: item.cg_om_num,
                rnf_num: item.cg_rnf_num,
                absence_reason: item.cg_absence_reason,
            };

            // Create a new object for "service" data
            const serviceData = {
                key: uuidv4(),
                type: "Service",
                date: item.date,
                ac_num: item.service_ac_num,
                nb_num: item.service_nb_num,
                abs_num: item.service_nbs_num,
                nf_num: item.service_nf_num,
                om_num: item.service_om_num,
                rnf_num: item.service_rnf_num,
                absence_reason: item.service_absence_reason,
            };

            return [cgData, serviceData];
        });
    }

    return (
        <div className='p-10'>
            <div className='flex flex-col pb-8 text-white text-3xl'>
                <b className='text-[#313131] mb-3'>{`${params.cgl_name}'s `}</b>Connect Group Attendance
            </div>
            <Table
                columns={columns}
                data={attendanceData}
                expandedRowRender={(record) => record.absence_reason}
                expandProps={{
                    width: window.innerWidth > 768 ? 15 : 25,
                    expandRowByClick: true,
                    rowExpandable: (record) => record.absence_reason !== null && record.absence_reason !== '',
                }}
                scroll={{
                    x: window.innerWidth * 0.9,
                    y: window.innerHeight,
                }}
            />
        </div>
    )
}

export default CGLAttendance
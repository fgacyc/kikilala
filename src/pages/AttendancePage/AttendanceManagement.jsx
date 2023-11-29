import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Popconfirm, Select, Space, Switch, Table } from '@arco-design/web-react';
import { deleteAttend, queryAttends, readAllAttends } from '../../api/attendance';
import { convertTableData, getWeekDatesArray } from '../formPage/data';
import {
    IconDelete,
    IconDownload,
    IconEdit, IconHome,
    IconNotification,
    IconPlusCircle,
    IconSearch
} from '@arco-design/web-react/icon';
import { pastoralTeamList, satelliteList } from '../../config';
import AttendanceInfoEditModal from './AttendanceInfoEditModal';
import { useAuth0 } from "@auth0/auth0-react";
import { addRecord } from "../../api/records.js";
import {getCGLNum, readAllActiveCGLs} from "../../api/CGLs.js";
import { useAttendanceStore } from "../../store/attendanceStore.js";
import { get } from "idb-keyval";
import useSelectedRowStore from '../../store/attendanceRecordStore.js';
import AttendanceDownloadModal from "./AttendanceDownloadModal.jsx";
import AttendanceReminder from "./AttendanceReminder.jsx";
import {AttendanceTable} from "./AttendanceTable.jsx";
import {AbsentCGLsTable} from "./PendingTable.jsx";
const Option = Select.Option;
const AttendanceManagement = () => {
    const [dateArray, setDateArray] = useState([])
    const buttonsNumber = 4
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const [initAttendData, currentWeek, setCurrentWeek, showSubmitted, setShowSubmitted] =
        useAttendanceStore(state => [
        state.initAttendData, state.currentWeek, state.setCurrentWeek, state.showSubmitted, state.setShowSubmitted]);
    const [attendanceDownloadModalVisible, setAttendanceDownloadModalVisible] = useState(false);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const setCurrentCGNumber  =
        useAttendanceStore(state =>state.setCurrentCGNumber)


    useEffect(() => {
        async  function init(){
            // init data for date selection
            setDateArray(getWeekDatesArray(buttonsNumber));
            // load local storage data for date and showSubmitted
            initAttendData();
            // get current num
            const num = await getCGLNum();
            setCurrentCGNumber(num);
        }
        void init();
    }, []);

    // log operation
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

    async function check() {
        const attendData = await  queryAttends("2023/10/30-2023/11/05")
        const CGLs = await readAllActiveCGLs();
        // console.log(attendData);
        // console.log(CGLs);

        const allCGID  = CGLs.map((cgl) => cgl.CG_id);
        //console.log(allCGID);

        const allCGAttendance = attendData.map((attend) => attend.cg_id);
        //console.log(allCGAttendance);

        // for (let id of allCGAttendance){
        //     if (!allCGID.includes(id)){
        //         console.log(id);
        //     }
        // }
        // for (let item of attendData){
        //     if (item.cg_id ==="MpkwSZ8YoyNXuOBT6aYY" || item.cg_id==="j84YmcgqsYfwOTfBykzQ"){
        //         console.log(item);
        //     }
        // }

        for (let item of attendData){
            if (item.cg_id ==="MpkwSZ8YoyNXuOBT6aYY" || item.cg_id==="j84YmcgqsYfwOTfBykzQ"){
                console.log(item);
            }
        }

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
                                <Button type='secondary' icon={<IconHome />} className={"ml-2"}
                                        onClick={() => {
                                            window.open("/", "_self");
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
                        className={showSubmitted === false ? 'hidden' : 'block'}
                    />
                    <AbsentCGLsTable
                        className={!showSubmitted === false ? 'hidden' : 'block'}
                    />
                </div>
            </div>
            <AttendanceDownloadModal setVisible={setAttendanceDownloadModalVisible} visible={attendanceDownloadModalVisible} />
            <AttendanceReminder setVisible={setReminderModalVisible} visible={reminderModalVisible} />
        </div>
    )
}

export default AttendanceManagement

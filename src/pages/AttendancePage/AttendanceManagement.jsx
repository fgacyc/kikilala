import React, { useEffect, useState } from 'react'
import { Button, Select, Switch } from '@arco-design/web-react';
import {
    IconDownload, IconHome,
    IconNotification, IconPlus, IconThunderbolt,
} from '@arco-design/web-react/icon';
import { useAuth0 } from "@auth0/auth0-react";
import { addRecord } from "../../api/records.js";
import {getCGLNum} from "../../api/CGLs.js";
import { useAttendanceStore } from "../../store/attendanceStore.js";
import AttendanceDownloadModal from "./AttendanceDownloadModal.jsx";
import AttendanceReminder from "./AttendanceReminder.jsx";
import {AttendanceTable} from "./AttendanceTable.jsx";
import {AbsentCGLsTable} from "./PendingTable.jsx";
import {generateAllWeeklyRanges} from "../../tools.js";
import {useNavigate} from "react-router-dom";
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
    const navigate = useNavigate();


    useEffect(() => {
        async  function init(){
            // init data for date selection
            setDateArray(generateAllWeeklyRanges());
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
                                {dateArray.map((option, index) => (
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
                                <Button type='secondary' icon={<IconPlus />} className={"ml-2"}
                                        onClick={() => {
                                            navigate("/submit");

                                        }}
                                />
                                <Button type='secondary' icon={<IconThunderbolt />} className={"ml-2"}
                                        onClick={() => {

                                            // window.open("/", "_self");
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

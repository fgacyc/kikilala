import { useEffect, useState } from 'react'
import { Button, Select, Switch } from '@arco-design/web-react';
import {
    IconDownload, IconFile, IconHome,
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
import {generateAllWeeklyRanges, generateMonthlyRanges} from "../../tools.js";
import {useNavigate} from "react-router-dom";
import DataInsightModal from "./DataInsightModal.jsx";
const Option = Select.Option;
const AttendanceManagement = () => {
    const [dateArray, setDateArray] = useState([])
    // const buttonsNumber = 4
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const [initAttendData, currentWeek, setCurrentWeek, showSubmitted, setShowSubmitted] =
        useAttendanceStore(state => [
        state.initAttendData, state.currentWeek, state.setCurrentWeek, state.showSubmitted, state.setShowSubmitted]);
    const [attendanceDownloadModalVisible, setAttendanceDownloadModalVisible] = useState(false);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [dataInsightModalVisible, setDataInsightModalVisible] = useState(false);
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
                            <Select placeholder='Please select' style={{ width: 250,marginBottom:8 }}
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
                                            navigate(`/nb-data-insight/${generateMonthlyRanges()[0]}`)
                                        }}
                                />
                                <Button type='secondary' icon={<IconFile />} className={"ml-2"}
                                        onClick={() => {
                                            navigate(`/nb-report`)
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
                        className={showSubmitted === false ? 'hidden' : 'block'}
                    />
                    <AbsentCGLsTable
                        className={!showSubmitted === false ? 'hidden' : 'block'}
                    />
                </div>
            </div>
            <AttendanceDownloadModal setVisible={setAttendanceDownloadModalVisible} visible={attendanceDownloadModalVisible} />
            <AttendanceReminder setVisible={setReminderModalVisible} visible={reminderModalVisible} />
            <DataInsightModal  setVisible={setDataInsightModalVisible} visible={dataInsightModalVisible} />
        </div>
    )
}

export default AttendanceManagement

import {Modal, Select} from '@arco-design/web-react';
import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {useDataInsightStore} from "../../store/dataInsightStore.js";
import {readAllAttends} from "../../api/attendance.js";
import {readAllActiveCGLs} from "../../api/CGLs.js";
const Option = Select.Option;

function filterAttendanceByMonth(){
    
}

export default function DataInsightModal({ visible, setVisible }) {
    const monthes = generateMonthlyRanges();
    const [currentMonth, setCurrentMonth] = useState('')
    const [attendanceData, setAttendanceData,connectGroupData, setConnectGroupData] =
        useDataInsightStore(state =>
        [state.attendanceData, state.setAttendanceData,
            state.connectGroupData, state.setConnectGroupData
        ]);


    useEffect(() => {
        if (currentMonth === '') return;

    }, [currentMonth]);

    useEffect(() => {
        readAllAttends().then((res) => {
            // console.log(res)

            setAttendanceData(res);
        });
        readAllActiveCGLs().then((res) => {
            // console.log(res)
            setConnectGroupData(res);
        });
    }, []);

    return (
        <Modal
            title="Data Insight"
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <Select placeholder='Please select month' style={{ width: 250,marginBottom:8 }}
                    value={currentMonth}
                    onChange={(value) => {
                        setCurrentMonth(value);
                    }}
            >
                {monthes.map((option, index) => (
                    <Option key={index} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>
            <p>
                You can customize modal body text by the current situation. This modal
                will be closed immediately once you press the OK button.
            </p>
        </Modal>
    );
}

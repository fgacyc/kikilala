import {Modal, Progress, Select} from '@arco-design/web-react';
import {generateMonthlyRanges} from "../../tools.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Option = Select.Option;


export default function DataInsightModal({ visible, setVisible }) {
    const [currentMonth, setCurrentMonth] = useState('')
    const monthes = generateMonthlyRanges();

    const navigate = useNavigate();

    useEffect(() => {
        if (currentMonth === '') return;

    }, [currentMonth]);
    return (
        <Modal
            title="Data Insight"
            visible={visible}
            onOk={() => {
                setVisible(false);
                navigate(`/nb-data-insight/${currentMonth}`)
            }}
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
        </Modal>
    );
}

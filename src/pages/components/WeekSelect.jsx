import React, {useEffect, useState} from "react";
import {Select} from "@arco-design/web-react";
import {generateAllWeeklyRanges} from "../../tools.js";
const Option = Select.Option;


export default function WeekSelect({currentWeek,setCurrentWeek}) {
    const [dateArray, setDateArray] = useState([])

    useEffect(() => {
        // console.log(getWeekDatesArray(buttonsNumber))
        setDateArray(generateAllWeeklyRanges());
    }, []);

    useEffect(() => {
        if (dateArray[3] && !currentWeek) {
            setCurrentWeek(dateArray[3]);
        }
    }, [dateArray]);

    return (
        <Select placeholder='Please select' style={{ width: 250 }} allowClear
                value={currentWeek}
                onChange={(value) => {
                    setCurrentWeek(value);
                }}
        >
            {dateArray && dateArray.slice().reverse().map((option, index) => (
                <Option key={index} value={option}>
                    {option}
                </Option>
            ))}
        </Select>
    )
}

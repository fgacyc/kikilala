import {Button, Modal, Select} from "@arco-design/web-react";
import React, {useEffect, useState} from "react";
import {readAllHeadcounts} from "../../api/headcount.js";
import {getWeekDatesArray} from "../formPage/data.js";
import {getTodayDateStr, isDateInRange} from "../../tools.js";
import CsvDownload from "react-csv-downloader";
import {IconDownload} from "@arco-design/web-react/icon";
const { Option } = Select;

export default  function HeadcountDownloadModal({ visible, setVisible }){
    const [allHeadCountData, setAllHeadCountData] = useState(null)
    const [dateArray, setDateArray] = useState([])
    const [currentWeek, setCurrentWeek] = useState(null)
    const [currentWeekData, setCurrentWeekData] = useState([])
    const ref = React.useRef(null);

    const buttonsNumber = 4
    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
        readAllHeadcounts().then((res) => {
            setAllHeadCountData(Object.values(res))
            // console.log(Object.values(res))
        })
    }, []);

    useEffect(() => {
        console.log(currentWeekData)
        console.log(allHeadCountData)
        setCurrentWeekData([])
        if(allHeadCountData === null) return;
        for (let item of allHeadCountData) {
            if (isDateInRange(item.dateTime, currentWeek)) {
                setCurrentWeekData((currentWeekData) => [...currentWeekData, item])
            }
        }
        console.log(currentWeekData)
    }, [currentWeek])

    function formatData(data){
        let result = []
        for(let item of data){
            result.push({
                "Satellite": item.satellite,
                "Date time": item.dateTime,
                "Kids num": item.kids_num,
                "CM num": item.cm_num,
                "Parents num": item.parents_num,
                "YW num": item.yw_num,
                "GS num": item.gs_num,
                "AC num": item.ac_num,
                "NF num": item.nf_num,
                "CGL": item.CGL,
                "Headcount": item.headCount,
                "Comment": item.comment
            })
        }
        return result
    }

    return (
        <Modal
            title="Headcount Reminder"
            visible={visible}
            onOk={() => {
                setVisible(false);
                ref.current.click();
            }}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div className={"mb-2"}>Select a week to download</div>
            <Select placeholder='Please select'
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
            <CsvDownload
                filename={`headcount_${getTodayDateStr()}`}
                extension={".csv"}
                text={"Download"}
                datas={formatData(currentWeekData)}
            >
                <Button type='secondary' icon={<IconDownload />} className={"ml-2 hidden"} ref={ref}/>
            </CsvDownload>
        </Modal>
    )
}



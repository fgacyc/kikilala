import {Modal, Select, DatePicker, Button, Message} from "@arco-design/web-react";
import {pastoralTeamList} from "../../config.js";
import {useEffect, useRef, useState} from "react";
import {useFormStore} from "../../store/formStore.js";
import {getWeekDatesArray} from "../formPage/data.js";
import {attendObjToCSV, checkWeek, downloadCGLsData, getTodayDateStr} from "../../tools.js";
import {filterAttendByDate, getAttendByPastoralTeam} from "../../api/attendance.js";
import CsvDownload from "react-csv-downloader";
const Option = Select.Option;

function ButtonsGroup({setDataDuration,visible}){
    const [active,setActive] = useState(-1)
    const [dateArray,setDateArray] = useState([])
    const buttonsNumber = 4
    const [rangeValue, setRangeValue] = useState();

    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
    }, []);

    useEffect(() => {
        setRangeValue(null);
    }, [visible]);

    function handleClick(index){
        setActive(index)
        if(index <=3){
            setDataDuration(dateArray[index])
        }
        else if (index === 4){
            setDataDuration('all')
        }
    }

    return (
        <div   className={"flex flex-row flex-wrap justify-around"}>
            {
                dateArray.map((date,index) => {
                    return (
                        <button key={index}
                                className={`hover:bg-[#00B05C] hover:text-white 
                        border-2 font-bold hover:border-[#00B05C] 
                        ${active === index ? 'bg-[#00B05C] border-[#00B05C] text-white'
                                    : 'bg-white border-[#2E024930] text-[#2E024930]'
                                }
                        rounded-[8px] px-[10px] py-[10px] my-[10px] mr-[10px] `}
                                onClick={() => handleClick(index)}
                        >
                            <span>{date}</span>
                            <div>{checkWeek(date)}</div>
                        </button>
                    )
                })
            }
            <button
                    className={`hover:bg-[#00B05C] hover:text-white  w-[195px]
                        border-2 font-bold hover:border-[#00B05C] 
                        ${active === 5 ? 'bg-[#00B05C] border-[#00B05C] text-white'
                        : 'bg-white border-[#2E024930] text-[#2E024930]'
                    }
                        rounded-[8px] px-[10px] py-[10px] my-[10px] mr-[10px] `}
                    onClick={() => handleClick(5)}
            >
                <DatePicker.RangePicker
                    triggerElement={
                        <div className={"w-[195px] relative right-3"}>{(rangeValue && rangeValue.join('-')) || 'Custom Duration'}</div>
                    }
                    style={{ width: 268 }}
                    value={rangeValue}
                    onChange={(v) => {
                        if(!v) return;
                        setRangeValue(v);
                        setDataDuration(v[0]+"-"+v[1]);
                    }}
                    format="YYYY/MM/DD"
                    dayStartOfWeek={1}
                />
            </button>
            <button
                className={`hover:bg-[#00B05C] hover:text-white w-[195px]
                        border-2 font-bold hover:border-[#00B05C] 
                        ${active === 4 ? 'bg-[#00B05C] border-[#00B05C] text-white'
                    : 'bg-white border-[#2E024930] text-[#2E024930]'
                }
                        rounded-[8px] px-[10px] py-[10px] my-[10px] mr-[10px] `}
                onClick={() => handleClick(4)}
            >
                <span>All Data</span>
            </button>
        </div>
    )
}


export default function AttendanceDownloadModal({visible, setVisible}) {
    const [pastoralTeam, setPastoralTeam] = useState();
    const [dataDuration, setDataDuration] = useState();
    const [downloadData, setDownloadData] = useState([]);
    const downloadBtnRef = useRef(null);
    const pastoralTeamListAndAll = pastoralTeamList.concat([{text: "All", value: "all"}]);

    async function generateDownloadData(){
        if (!dataDuration||!pastoralTeam )return;
        const pastoralTeamAttendance = await getAttendByPastoralTeam(pastoralTeam);
        // console.log(pastoralTeamAttendance)

        //return;
        const data = filterAttendByDate(pastoralTeamAttendance, dataDuration);
        const csvData = attendObjToCSV(data);
        setDownloadData(csvData);
    }

    useEffect(() => {
        generateDownloadData();
    }, [dataDuration,pastoralTeam]);


    return (
        <Modal
            title="Download Attendance Data"
            visible={visible}
            onOk={() => {
                //setVisible(false)
                // console.log(downloadData)
                downloadBtnRef.current.click()
            }}
            okText={"Download"}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div className={"mb-4"}>
                <div className={"mb-2"}>Which pastoral team's attendance data do you want to download?</div>
                <Select
                    placeholder='Please select  pastoral team...'
                    value={pastoralTeam}
                    onChange={setPastoralTeam}
                >
                    {pastoralTeamListAndAll.map((option, index) => (
                        <Option key={index} value={option.value}>
                            {option.text}
                        </Option>
                    ))}
                </Select>
            </div>
            <div>
                <div>What duration of attendance data do you want to download?</div>
                <ButtonsGroup setDataDuration={setDataDuration} visible={visible} />
            </div>
            <CsvDownload filename={`${pastoralTeam}_attendance_${dataDuration}`}
                         extension={".csv"}
                         className={"hidden"}
                         datas={downloadData} >
                <button  ref={downloadBtnRef}>Download</button>
            </CsvDownload>
        </Modal>
    );
}

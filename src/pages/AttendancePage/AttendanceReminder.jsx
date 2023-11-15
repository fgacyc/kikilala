import {Button, Input, Message, Modal, Select} from '@arco-design/web-react';
import {pastoralTeamList, satelliteNameList} from "../../config.js";
import {useEffect, useState} from "react";
import {IconCheck, IconCopy} from "@arco-design/web-react/icon";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {Result} from "postcss";

const Option = Select.Option;
const TextArea = Input.TextArea;


export default function AttendanceReminder({visible, setVisible}) {
    const [satellite, setSatellite] = useState("");
    const [pastoralTeam, setPastoralTeam] = useState("");
    const [absentCGLsNameList, setAbsentCGLsNameList] = useState([]);
    const [message, setMessage] = useState("");
    const currentPendingData = useAttendanceStore(state => state.currentPendingData);
    const [isShowSuccess, setIsShowSuccess] = useState(false);

    function getCGLNameListFromSateAndPastoral(satellite, pastoralTeam) {
        if (!satellite && !pastoralTeam) return [];

        let CGLs;
        if (satellite && !pastoralTeam) {
            CGLs = currentPendingData.filter((item) => item.satellite === satellite);
        }

        if (satellite && pastoralTeam) {
            CGLs = currentPendingData.filter((item) => item.satellite === satellite && item.pastoral_team === pastoralTeam);
        }
        if(CGLs.length === 0) setIsShowSuccess(true);
        else setIsShowSuccess(false);
        return CGLs;
    }


    async function updateData() {
        if (!satellite) return;
        // Kuchai must choose pastoral team, other satellite don't need to choose
        if (satellite.includes("Kuchai") && !pastoralTeam) return;
        const filterAbsentCGLsList = getCGLNameListFromSateAndPastoral(satellite, pastoralTeam);
        //console.log(filterAbsentCGLsList)
        const filterAbsentCGLsNameList = filterAbsentCGLsList.map((item) => item.CG_leader);

        setAbsentCGLsNameList(filterAbsentCGLsNameList);
    }

    useEffect(() => {
        // console.log(absentCGLsNameList, absentCGLsNameList.length)
        if (absentCGLsNameList.length === 0) {
            setMessage("");
            return;
        }
        generateMessage();
    }, [absentCGLsNameList]);

    function generateMessage() {
        let prefix = `*Attendance Reminder*\n\n${pastoralTeam ? satellite + "-" + pastoralTeam : satellite}\n\n` +
            "Hi, kindly remind below CG to submit attendance for last week:\n\n";
        let suffix = "\n\nThank you!";
        const message = prefix + absentCGLsNameList.join("\n") + suffix;
        setMessage(message);
    }

    useEffect(() => {
        // console.log(pastoralTeam, satellite)
        updateData();
    }, [pastoralTeam, satellite]);


    return (
        <Modal
            title="Generate Reminder message"
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div className={"mb-4"}>
                <div className={"mb-2"}>Which Location's reminder message do you want to generate?</div>
                <Select
                    placeholder='Please select  pastoral team...'
                    value={satellite}
                    onChange={(value)=>{
                        setSatellite(value);
                        setPastoralTeam("");
                    }}
                >
                    {satelliteNameList.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </div>
            {
                satellite.includes("Kuchai") &&
                <div className={"mb-4"}>
                    <div className={"mb-2"}>Which pastoral team's reminder message do you want to generate?</div>
                    <Select
                        placeholder='Please select  pastoral team...'
                        value={pastoralTeam}
                        onChange={setPastoralTeam}
                    >
                        {pastoralTeamList.map((option, index) => (
                            <Option key={index} value={option.value}>
                                {option.text}
                            </Option>
                        ))}
                    </Select>
                </div>
            }
            {
                absentCGLsNameList.length !== 0
                    && <div className="relative">
                        <div className={"mb-2"}>Reminder Message:</div>
                        <TextArea
                            className={"resize-none h-[100px]"}
                            value={message}
                        />
                        <IconCopy className={"text-lg absolute bottom-2 right-4 cursor-pointer"}
                                  onClick={() => {
                                      navigator.clipboard.writeText(message).then(() =>
                                          Message.success("Copied to clipboard")).catch(() => {
                                          Message.error("Failed to copy to clipboard")
                                      })
                                  }}
                        />
                    </div>
            }
            {
                isShowSuccess && <div className={"h-[130px] flex flex-col items-center justify-center"}>
                    <div className={"w-[42px] h-[42px] bg-[#E8FFEA] rounded-full flex flex-row justify-center items-center mb-2"}>
                        <IconCheck className={"text-xl"} />
                    </div>
                    <div>All CGs have submitted attendance</div>
                </div>
            }

        </Modal>
    )
}

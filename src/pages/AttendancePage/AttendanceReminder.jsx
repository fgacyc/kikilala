import {Input, Message, Modal, Select} from '@arco-design/web-react';
import {pastoralTeamList, satellite_pastoralTeam, satelliteNameList} from "../../config.js";
import {useEffect, useState} from "react";
import {IconCopy} from "@arco-design/web-react/icon";
import {get} from "idb-keyval";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {readAllActiveCGLs} from "../../api/CGLs.js";

const Option = Select.Option;
const TextArea = Input.TextArea;


export default function AttendanceReminder({visible, setVisible}) {
    const [satellite, setSatellite] = useState("");
    const [pastoralTeam, setPastoralTeam] = useState("");
    const [absentCGLsNameList, setAbsentCGLsNameList] = useState([]);
    const [message, setMessage] = useState("");

    async function getCGLNameListFromSateAndPastoral(satellite,pastoralTeam){
        if(!satellite && !pastoralTeam) return [];

        let CGLs= await readAllActiveCGLs();
        if (satellite && !pastoralTeam){
           CGLs = CGLs.filter((item) => item.satellite === satellite);
        }

        if (satellite && pastoralTeam){
            CGLs = CGLs.filter((item) => item.satellite === satellite && item.pastoral_team === pastoralTeam);
        }
        return  CGLs;
    }




    async function updateData() {
        if (!satellite) return;
        // Kuchai must choose pastoral team, other satellite don't need to choose
        if(satellite.includes("Kuchai") && !pastoralTeam) return;

        // get satellite's CGLs + pastoral team's CGLs
        //currentPendingData
        //console.log(currentPendingData)

        //setAbsentCGLsNameList(absentCGLsNameList);
    }

    useEffect(() => {
        console.log(absentCGLsNameList, absentCGLsNameList.length)
        if (absentCGLsNameList.length === 0) {
            setMessage("");
            return;
        }
        generateMessage();
    }, [absentCGLsNameList]);

    function generateMessage() {
        let prefix = `*Attendance Reminder*\n\n${pastoralTeam}\n\n` +
            "Hi, kindly remind below CG to submit attendance for last week:\n\n";
        let suffix = "\n\nThank you!";
        const message = prefix + absentCGLsNameList.join("\n") + suffix;
        setMessage(message);
    }

    useEffect(() => {
        console.log(pastoralTeam,satellite)
        updateData();
    }, [pastoralTeam,satellite]);

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
                    onChange={setSatellite}
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
            <div className="relative">
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
        </Modal>
    )
}

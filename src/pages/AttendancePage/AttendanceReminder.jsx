import {Input, Message, Modal, Select} from '@arco-design/web-react';
import {pastoralTeamList} from "../../config.js";
import {useEffect, useState} from "react";
import {IconCopy} from "@arco-design/web-react/icon";
import {get} from "idb-keyval";
import {useAttendanceStore} from "../../store/attendanceStore.js";

const Option = Select.Option;
const TextArea = Input.TextArea;


export default function AttendanceReminder({visible, setVisible}) {
    const [pastoralTeam, setPastoralTeam] = useState("");
    const currentSubmitData = useAttendanceStore(state => state.currentSubmitData);
    const [absentCGLsNameList, setAbsentCGLsNameList] = useState([]);
    const [message, setMessage] = useState("");

    async function updateData() {
        if (!pastoralTeam) return;
        let submitCGLs = currentSubmitData.map((item) => item.cg_id);
        let absentCGLs = [];
        const allCGLs = await get("kikilala-CGLs")
        for (let key in allCGLs) {
            allCGLs[key].key = key;
            if (!submitCGLs.includes(key)) {
                absentCGLs.push(allCGLs[key]);
            }
        }
        const absentCGLsNameList = absentCGLs.filter((item) => item.pastoral_team === pastoralTeam).map((item) => item.CG_leader);
        // console.log(absentCGLsNameList)
        setAbsentCGLsNameList(absentCGLsNameList);
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
            let prefix = `*Attendance Reminder*\n\n${pastoralTeam}\n\n` +
                "Hi, kindly remind below CG to submit attendance for last week:\n\n";
            let suffix = "\n\nThank you!";
            const message = prefix + absentCGLsNameList.join("\n") + suffix;
            setMessage(message);
        }

        useEffect(() => {
            updateData();
        }, [pastoralTeam]);

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

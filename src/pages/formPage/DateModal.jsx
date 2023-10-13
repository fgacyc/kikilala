import {Modal, Button, Message} from '@arco-design/web-react';
import {IconClose} from "@arco-design/web-react/icon";
import {getWeekDatesArray, validate} from "./data.js";
import {useEffect, useState} from "react";
import {useFormStore} from "../../store/formStore.js";
import {addCGL} from "../../api/CGLs.js";
import {addAttend} from "../../api/attendance.js";
import {set} from "idb-keyval";

function ButtonsGroup(){
    const [active,setActive] = useState(-1)
    const [dateArray,setDateArray] = useState([])
    const setDate = useFormStore(state => state.setDate)
    const buttonsNumber = 4

    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
    }, []);

    function handleClick(index){
        setActive(index)
        setDate(dateArray[index])
    }

    return (
        <div>
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
                        >{date}</button>
                    )
                })
            }
        </div>
    )
}

function DateModal({visible, setVisible}) {
    const getFormData = useFormStore(state => state.getFormData);

    function submit() {
        const data = getFormData();
        if(validate(data) === false) return;
        setVisible(false);
        addAttend(data).then((res) => {
            if (res!==false){
                Message.success("Submitted successfully!")
                saveCGInfoToLocal();
            }else{
                Message.error("Submitted failed!")
            }
        })
    }

    async function saveCGInfoToLocal(){
        const data = getFormData();
        await set("CGInfo",{
            "satellite": data.satellite,
            "pastoral_team": data.pastoral_team,
            "cgl_name": data.cgl_name,
            "total_members_num" : data.total_members_num,
        })
    }

    return (
        <div>
            <Modal
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
                simple={true}
                footer={null}
                style={{
                    margin: 0,
                    padding: 0,
                }}
                className={"sm:text-right text-center"}

            >
                <div className={"relative flex flex-row justify-center p-2.5"}>
                    <div className={"text-base"}>Which week are you submitting for?</div>
                    <div className={`rounded-full w-[20px] h-[20px] hover:bg-gray-400 absolute right-3 top-3 
                        cursor-pointer leading-[20px] text-center`}
                            onClick={() => setVisible(false)}
                    >
                        <IconClose />
                    </div>
                </div>
                <hr/>
                <div  className={"p-4"}>
                    <ButtonsGroup />
                </div>
                <hr/>
                <div className={"p-3 flex flex-row justify-end"}>
                    <Button type='secondary' className={"mr-3"}
                            onClick={() => setVisible(false)}
                    >Cancel</Button>
                    <Button  type='primary' status='success'
                        onClick={submit}
                    >Submit</Button>
                </div>
            </Modal>
        </div>
    );
}

export default DateModal;

import { Modal, Button } from '@arco-design/web-react';
import {IconClose} from "@arco-design/web-react/icon";
import {getWeekDates, getWeekDatesArray} from "./data.js";
import {useEffect, useState} from "react";

function ButtonsGroup(){
    const [active,setActive] = useState(-1)
    const [dateArray,setDateArray] = useState([])
    const buttonsNumber = 4

    useEffect(() => {
        setDateArray(getWeekDatesArray(buttonsNumber));
    }, []);

    function handleClick(index){
        setActive(index)
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
                    <Button  type='primary' status='success'>Submit</Button>
                </div>
            </Modal>
        </div>
    );
}

export default DateModal;

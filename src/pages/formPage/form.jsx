import { useEffect, useState } from "react";
import {  Input, Message } from '@arco-design/web-react';
import {readAllActiveCGLs} from "../../api/CGLs.js";
import { SendIcon } from "../../Icon/SendIcon.jsx";
import DateModal from "./dateModal.jsx";
import { useFormStore } from "../../store/formStore.js";

import { IconHistory } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ButtonGroup from "../components/buttonGroup.jsx";
import Selects from "../components/selects.jsx";
import UIInput from "../components/UIInput.jsx";
import InputPIN from "../components/InputPIN.jsx";
import {useAttendanceStore} from "../../store/attendanceStore.js";
const TextArea = Input.TextArea;


function InputPINs({ type }) {
    if (type !== "activity"
        && type !== "service"
        && type !== "WK-CG"
        && type !== "WK-SVE"
    ) new Error("type must be activity or service")


    const [
        setCGOMNum,
        setCGNBNum,
        setCGNFNum,
        setCGRNFNum,
        setCGACNum,
        setCGABSNum
    ] = useFormStore(state => [
        state.setCGOMNum,
        state.setCGNBNum,
        state.setCGNFNum,
        state.setCGRNFNum,
        state.setCGACNum,
        state.setCGABSNum
    ])

    const [
        setServiceOMNum,
        setServiceNBNum,
        setServiceNFNum,
        setServiceRNFNum,
        setServiceACNum,
        setServiceABSNum
    ] = useFormStore(state => [
        state.setServiceOMNum,
        state.setServiceNBNum,
        state.setServiceNFNum,
        state.setServiceRNFNum,
        state.setServiceACNum,
        state.setServiceABSNum
    ])

    const [
        cg_om_num,
        cg_nb_num,
        cg_nf_num,
        cg_rnf_num,
        cg_ac_num,
        cg_abs_num,
        service_om_num,
        service_nb_num,
        service_nf_num,
        service_rnf_num,
        service_ac_num,
        service_abs_num
    ] = useFormStore(state => [
        state.cg_om_num,
        state.cg_nb_num,
        state.cg_nf_num,
        state.cg_rnf_num,
        state.cg_ac_num,
        state.cg_abs_num,
        state.service_om_num,
        state.service_nb_num,
        state.service_nf_num,
        state.service_rnf_num,
        state.service_ac_num,
        state.service_abs_num
    ])


    return (
        <div>
            {type === "activity" &&
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setCGOMNum} val={cg_om_num} />
                    <InputPIN name={"NB"} setter={setCGNBNum} val={cg_nb_num}  />
                    <InputPIN name={"NF"} setter={setCGNFNum} val={cg_nf_num}  />
                    <InputPIN name={"RNF"} setter={setCGRNFNum} val={cg_rnf_num}  />
                    <InputPIN name={"AC"} setter={setCGACNum} val={cg_ac_num}  />
                    <InputPIN name={"ABS"} setter={setCGABSNum} val={cg_abs_num}  />
                </div>
            }
            {
                type === "service" &&
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setServiceOMNum} val={service_om_num}/>
                    <InputPIN name={"NB"} setter={setServiceNBNum} val={service_nb_num}/>
                    <InputPIN name={"NF"} setter={setServiceNFNum} val={service_nf_num}/>
                    <InputPIN name={"RNF"} setter={setServiceRNFNum} val={service_rnf_num}/>
                    <InputPIN name={"AC"} setter={setServiceACNum} val={service_ac_num}/>
                    <InputPIN name={"ABS"} setter={setServiceABSNum} val={service_abs_num}/>
                </div>
            }
            {
                type === "WK-CG" &&
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setCGOMNum} val={cg_om_num}/>
                    <InputPIN name={"KID"} setter={setCGNBNum} val={cg_nb_num}/>
                    <InputPIN name={"FTK"} setter={setCGNFNum} val={cg_nf_num}/>
                    <InputPIN name={"AC"} setter={setCGACNum} val={cg_ac_num}/>
                </div>
            }
            {
                type === "WK-SVE" &&
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setServiceOMNum} val={service_om_num}/>
                    <InputPIN name={"KID"} setter={setServiceNBNum} val={service_nb_num}/>
                    <InputPIN name={"FTK"} setter={setServiceNFNum} val={service_nf_num}/>
                    <InputPIN name={"AC"} setter={setServiceACNum} val={service_ac_num}/>
                </div>
            }
        </div>
    )
}

function InputArea({type, textAreaValue, setTextAreaValue}) {
    return (
        <div>
            <InputPINs type={type}/>
            <TextArea placeholder='Please enter remarks, like absence reasons, new friends, etc...'
                      value={textAreaValue}
                      onChange={setTextAreaValue}
                      className={"w-full resize-none mt-2"}/>
        </div>
    )
}

export default function Form() {
    const setAllCGLs = useAttendanceStore(state => state.setCurrentCGLs)
    const [currentStatellite, setCurrentSatellite] = useState(null)
    const [visible, setVisible] = useState(false);
    //const [reset, printForm] = useFormStore(state => [state.reset, state.printForm])
    const [cg_name, cgl_name, setCGAbsenceReason, setServiceAbsenceReason,
        satellite,cg_absence_reason,service_absence_reason,
        user_email,user_sub,setUserEmail,setUserSub] =
        useFormStore(state => [state.cg_name, state.cgl_name,
            state.setCGAbsenceReason, state.setServiceAbsenceReason ,state.satellite
            ,state.cg_absence_reason,state.service_absence_reason
            ,state.user_email,state.user_sub,state.setUserEmail,state.setUserSub
        ])

    const navigate = useNavigate();
    const { loginWithRedirect,logout,user } = useAuth0();

    useEffect(() => {
        async function getData() {
            readAllActiveCGLs().then((data) => {
                console.log("allcgs",data);
                setAllCGLs(data);
            })
        }
        void getData();

    }, []);

    useEffect(() => {
        if(satellite){
            // console.log("satellite:",satellite)
            setCurrentSatellite(satellite)
        }
    }, [satellite])

    useEffect(() => {
        if(!user) return;
        setUserEmail(user.email)
        setUserSub(user.sub)
    }  ,[user])

    function submitHandler() {
        if(!user_sub){
            Message.warning("Please login first!")
            return;
        }

        setVisible(true)
    }

    const viewHistory = () => {
        // console.log("cg_name",cg_name)
        // console.log("cgl_name",cgl_name)
        if (cg_name) {
            navigate(`/history/${cgl_name}`)
        } else {
            Message.warning("Please select a CGL Name!")
        }
    }

    return (
        <div>
            {
                !user_email
                ? <div className={"font-bold mt-0 mb-3"}>
                    <span>You haven&apos;t logged in yet. </span>
                    <span className={"text-blue-500 cursor-pointer"}
                          onClick={() => loginWithRedirect()}
                    >Log in</span>
                </div>
                : <div className={"font-bold mt-0 mb-3"}>
                        <span>{user_email}</span>
                        <span className={"text-blue-500 cursor-pointer ml-2"}
                              onClick={() =>{
                                  void logout({ returnTo: window.location.origin });
                              }}
                        >Switch account</span>
                    </div>
            }
            <hr className={"my-2"} />
            <div className={"font-bold mt-0 mb-3"}>
                <div>Which Service Location do you attend?</div>
            </div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite} />
            <div className={"font-bold mt-5 mb-3"}>Which Pastoral Team do you belong to?</div>
            <Selects  />
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many members are there in your Connect Group?</div>
                <UIInput type={"number"} />
            </div>
            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended your CG this week?
                </div>
                {
                    currentStatellite === "Kuchai WK"
                    ? <InputArea type={"WK-CG"} textAreaValue={cg_absence_reason} setTextAreaValue={setCGAbsenceReason} />
                    : <InputArea type={"activity"} textAreaValue={cg_absence_reason} setTextAreaValue={setCGAbsenceReason} />
                }
            </div>

            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended service this week?</div>
                {
                    currentStatellite === "Kuchai WK"
                    ? <InputArea type={"WK-SVE"} textAreaValue={service_absence_reason} setTextAreaValue={setServiceAbsenceReason} />
                    : <InputArea type={"service"} textAreaValue={service_absence_reason} setTextAreaValue={setServiceAbsenceReason} />
                }
            </div>

            <div className={"flex flex-row justify-between items-end"}>
                <button className={`bg-[#00B05C] text-white rounded-[8px] p-[10px] my-[10px] mr-[10px] 
                    mt-8 flex flex-row justify-center w-[200px]`}
                    onClick={submitHandler}
                //onClick={printForm}
                >
                    <SendIcon className={"scale-50"} />
                    <span className={"ml-3"}
                    >Submit Attendance</span>
                </button>
                <div className={`w-[44px] h-[44px] bg-gray-200 rounded-[8px] 
                                hover:bg-[#00B05C] hover:text-white cursor-pointer
                                flex flex-row items-center justify-center mb-[10px]`}
                    onClick={() => viewHistory()}
                >
                    <IconHistory fontSize={24} />
                </div>
            </div>

            <DateModal setVisible={setVisible} visible={visible} />
        </div>
    )
}

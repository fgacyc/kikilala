import React, {useEffect, useState} from "react";
import {useFormStore} from "../../store/formStore.js";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import ButtonGroup from "../components/buttonGroup.jsx";
import Selects from "../components/selects.jsx";
import UIInput from "../components/UIInput.jsx";
import {DatePicker, Input, Message, Select} from "@arco-design/web-react";
import InputPIN from "../components/InputPIN.jsx";
import {SendIcon} from "../../Icon/SendIcon.jsx";
import {IconHistory} from "@arco-design/web-react/icon";
import {useHeadCountStore} from "../../store/headcountStore.js";
import {addHeadcount} from "../../api/headcount.js";

const Option = Select.Option;
export const serviceTypeOptions = [
    // 'Service', 'Creative Service', 'Evangelistic Service', 'Leaders Community'
    {
        value: 'service',
        text: 'Service',
    },
    {
        value: 'creative_service',
        text: 'Creative Service',
    },
    {
        value: 'evangelistic_service',
        text: 'Evangelistic Service',
    },
    {
        value: 'leaders_community',
        text: 'Leaders Community',
    }
];
const TextArea = Input.TextArea;



export default function HeadCountForm(){
    const [currentStatellite, setCurrentSatellite] = useState(null)
    const [
        setSatelliteH,
        setDateTime,
        setServiceType
    ] =
        useHeadCountStore(state => [
            state.setSatellite,
            state.setDateTime,
            state.setServiceType
        ])

    const [
        kids_num, cm_num, parents_num,
        yw_num, gs_num, yp_num
    ] = useHeadCountStore(state => [
        state.kids_num, state.cm_num, state.parents_num,
        state.yw_num, state.gs_num, state.yp_num
    ])

    const [
        setKidsNum,
        setCMNum,
        setParentsNum,
        setYWNum,
        setGSNum,
        setYPNum,
        setComment
    ] = useHeadCountStore(state => [
        state.setKidsNum, state.setCMNum, state.setParentsNum,
        state.setYWNum, state.setGSNum, state.setYPNum,
        state.setComment
    ])

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
    const getHeadCountData  = useHeadCountStore(state => state.getHeadCountData)

    useEffect(() => {
        if(!user) return;
        setUserEmail(user.email)
        setUserSub(user.sub)
    }  ,[user])

    useEffect(() => {
        if(satellite){
            //console.log(satellite)
            setCurrentSatellite(satellite)
            setSatelliteH(satellite)
        }
    }, [satellite])


    function  submitHandler(){
        const data =  getHeadCountData();
        console.log(data)
        // return;

        if (!data) return;
        addHeadcount(data).then(res => {
            if (res!== false) {
                Message.success("Submit successfully!")
            }
        })
    }


    return(
        <div>
            {
                !user_email
                    ? <div className={"font-bold mt-0 mb-3"}>
                        <span>You haven't logged in yet. </span>
                        <span className={"text-blue-500 cursor-pointer"}
                              onClick={() => loginWithRedirect()}
                        >Log in</span>
                    </div>
                    : <div className={"font-bold mt-0 mb-3"}>
                        <span>{user_email}</span>
                        <span className={"text-blue-500 cursor-pointer ml-2"}
                              onClick={() =>{
                                  logout({ returnTo: window.location.origin });
                              }}
                        >Switch account</span>
                    </div>
            }
            <hr className={"my-2"} />
            <div className={"font-bold mt-0 mb-3"}>
                <div>Which Service Location are you logging for?</div>
            </div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite} />
            <div>
                <div className={"font-bold mt-5 mb-3"}>What time did this service start?</div>
                <DatePicker
                    style={{width: '100%'}}
                    showTime={{
                        defaultValue: '00:00:00',
                    }}
                    format='YYYY-MM-DD HH:mm:ss'
                    //onChange={onChange}
                    onSelect={setDateTime}
                    //onOk={onOk}
                />
            </div>
            <div>
                <div className={"font-bold mt-5 mb-1"}>Which type of service are you logging for?</div>
                <Select
                    placeholder='Please select/enter service type...'
                    style={{ width: "100%" }}
                    onChange={setServiceType}
                    allowCreate={true}
                >
                    {serviceTypeOptions.map((option, index) => (
                        <Option key={option.text}  value={option.value}>
                            {option.text}
                        </Option>
                    ))}
                </Select>

            </div>
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many is the total headcount?</div>
                <UIInput type={"number"} />
            </div>
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many people attend this week?</div>
                <div className={"flex flex-row justify-between items-start"}>
                   <div className={"text-center"}>
                       <div className={`flex flex-row justify-between bg-gray-100 rounded-xl 
                                    sm:py-2 sm:px-4 py-2`}>
                           <InputPIN name={"Kids"} setter={setKidsNum} val={kids_num}  />
                           <InputPIN name={"CM"} setter={setCMNum} val={cm_num}  />
                           <InputPIN name={"Parents"} setter={setParentsNum} val={parents_num}  />
                       </div>
                       <div className={"mt-1"}>Wonder Kids</div>
                   </div>
                    <InputPIN name={"YW"} setter={setYWNum} val={yw_num} className={"py-2"} />
                    <InputPIN name={"GS"} setter={setGSNum} val={gs_num} className={"py-2"}   />
                    <InputPIN name={"YP"} setter={setYPNum} val={yp_num} className={"py-2"}   />
                </div>
            </div>
            <div>
                <div className={"font-bold mt-5 mb-1"}>Do you have any comments?</div>
                <TextArea
                    placeholder='Please enter comments...'
                    style={{ marginTop:5, width: "100%" ,resize: "none" }}
                    onChange={setComment}
                />
            </div>
            <div className={"flex flex-row justify-between items-end"}>
                <button className={`bg-[#00B05C] text-white rounded-[8px] p-[10px] my-[10px] mr-[10px] 
                    mt-8 flex flex-row justify-center w-[200px]`}
                        onClick={submitHandler}
                >
                    <SendIcon className={"scale-50"} />
                    <span className={"ml-3"}
                    >Submit Headcount</span>
                </button>
                <div className={`w-[44px] h-[44px] bg-gray-200 rounded-[8px] 
                                hover:bg-[#00B05C] hover:text-white cursor-pointer
                                flex flex-row items-center justify-center mb-[10px]`}
                     //onClick={() => viewHistory()}
                >
                    <IconHistory fontSize={24} />
                </div>
            </div>



        </div>
    )
}

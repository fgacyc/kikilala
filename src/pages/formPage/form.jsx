import React, { useEffect, useState } from "react";
import { Select, Input, Notification, Icon, Message } from '@arco-design/web-react';
import { readAllCGLs } from "../../api/CGLs.js";
import {
    getAllPastoralTeamNames,
    getAllTeamLeaderNames,
    getCGName,
    ifExpire
} from "./data.js";
import { SendIcon } from "../../Icon/SendIcon.jsx";
import DateModal from "./DateModal.jsx";
import { useFormStore } from "../../store/formStore.js";
import { get } from "idb-keyval";

import { IconHistory } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router-dom";
const IconFont = Icon.addFromIconFontCn({
    src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js',
});

const Option = Select.Option;
const TextArea = Input.TextArea;

function ButtonGroup({ setCurrentSatellite }) {
    const [active, setActive] = useState(-1)
    const [satellite, setSatellite] =
        useFormStore(state => [state.satellite,state.setSatellite])
    const satellites = [
        'Kuchai YW',
        'Kuchai WK',
        'Kuchai GS',
        'Serdang',
        'Kepong',
        'USJ',
        'Setapak',
        'SG Long',
        'Seremban'
    ]

    useEffect(() => {
        async function getData() {
            if (!satellite) return;
            for (let i = 0; i < satellites.length; i++) {
                if (satellites[i] === satellite) {
                    handleClick(i);
                    setCurrentSatellite(satellites[i])
                }
            }
        }
        getData();
    }, [satellite]);

    function handleClick(index) {
        setActive(index)
        setCurrentSatellite(satellites[index])
        setSatellite(satellites[index])
    }

    return (
        <div>
            {
                satellites.map((satellite, index) => {
                    return (
                        <button key={index}
                            className={`hover:bg-[#00B05C] hover:text-white 
                        border-2 font-bold hover:border-[#00B05C] 
                        ${active === index ? 'bg-[#00B05C] border-[#00B05C] text-white'
                                    : 'bg-white border-[#2E024930] text-[#2E024930]'
                                }
                        rounded-[8px] px-[10px] py-[10px] my-[10px] mr-[10px] `}
                            onClick={() => handleClick(index)}
                        >{satellite}</button>
                    )
                })
            }
        </div>
    )
}

function Selects({ data, statellite }) {
    const [currentPastoralTeamNames, setCurrentPastoralTeamNames] = useState([])
    const [currentPT, setCurrentPT] = useState("")
    const [currentCGLName, setCurrentCGLName] = useState("")
    const [currentTeamLeaderNames, setCurrentTeamLeaderNames] = useState([])
    const [setPastoralTeam, setCGLName, setCGName,satellite,pastoral_team,cgl_name] = useFormStore(state => [
        state.setPastoralTeam, state.setCGLName, state.setCGName,
        state.satellite, state.pastoral_team, state.cgl_name
    ])

    const [ifPTLocal, setIfPTLocal] = useState(false)
    useEffect(() => {
        get("CGInfo").then((res) => {
            if (res) {
                setIfPTLocal(true)
            }
        })
    }, []);

    useEffect(() => {
        async function getData(){

            let data = await get("kikilala-CGLs");
            if (!data) return;
            // set select 1 options
            //console.log(satellite, data)
            const allPastoralTeamNames = getAllPastoralTeamNames(satellite, data);
            setCurrentPastoralTeamNames(allPastoralTeamNames);
            //console.log(allPastoralTeamNames)
            // set select 2 options
            const allTeamLeaderNames = getAllTeamLeaderNames(satellite, pastoral_team, data);
            setCurrentTeamLeaderNames(allTeamLeaderNames);
            // console.log(allTeamLeaderNames)

            // set default pastoral team
            setCurrentPT(pastoral_team)

            // set default CGL name
            setCurrentCGLName(cgl_name)

        }
        getData();
    }, [satellite])


    useEffect(() => {
        // console.log("currentPT:", currentPT)
        if (!currentPT) return;
        setCurrentTeamLeaderNames(getAllTeamLeaderNames(satellite, currentPT, data))
        setPastoralTeam(currentPT)
    }, [currentPT])

    function CGLSelectHandler(value) {
        setCGLName(value);
        getCGName(value).then((res) => {
            setCGName(res)
        });
    }


    return (
        <>
            <div className={"w-full flex flex-row justify-between h-auto"}>
                <Select placeholder='Pastoral Team'
                        style={{ width: "50%" }}
                        onChange={setCurrentPT}
                        //defaultValue={currentPT}
                        value={currentPT}
                        onFocus={() => {
                            if (!satellite) {
                                Notification.warning({
                                    content: 'Please select Satellite first!',
                                    icon: <IconFont type='icon-warning' />,
                                    position: 'topLeft',
                                });
                            }
                        }}
                >
                    {currentPastoralTeamNames && currentPastoralTeamNames.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='CGL Name' style={{ width: "45%" }}
                        onChange={CGLSelectHandler}
                        value={cgl_name}
                        onFocus={() => {
                            if (!satellite) {
                                Notification.warning({
                                    content: 'Please select Satellite and Pastoral Team first!',
                                    icon: <IconFont type='icon-warning' />,
                                    position: 'topLeft',
                                });
                            }
                        }}
                >
                    {currentTeamLeaderNames && currentTeamLeaderNames.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </div>
        </>
    );
}

function UIInput({ type }) {
    const [total_members_num,setTotalMembersNum] = useFormStore(state => [
        state.total_members_num, state.setTotalMembersNum
    ])

    function handleChange(e) {
        const val = e.target.value
        if (!val) {
            setTotalMembersNum("")
            return;
        }
        const value = parent.parseInt(val)
        setTotalMembersNum(value)
    }

    return (
        <input type={type}
            onChange={handleChange}
            value={total_members_num}
            className={"w-full  border-b-2 border-[#2E024930] h-[30px] my-0"} />
    )
}

function InputPIN({ name, setter,val }) {

    function handleChange(e) {
        const valueStr = e.target.value;
        const val = valueStr.substring(0, 2);
        if (!val) {
            setter("")
        }
        const value = parent.parseInt(val)
        setter(value)
    }

    useEffect(() => {
        if(val === 0){
            setter("")
        }
    }, [])


    return (
        <div className={"flex flex-col justify-center w-[64px]"}>
            <input type="number"
                className={`border-[#2E024930] 
                   text-center 
                   w-[32px] h-[32px] text-xl border rounded-lg
                   sm:w-[48px] sm:h-[48px] sm:text-2xl sm:border-2 sm:rounded-xl
                   my-0 inline-block  mx-[10px]`}
                value={val}
                onChange={handleChange}
            />
            <div className={"text-center"}>{name}</div>
        </div>
    )
}

function InputPINs({ type }) {
    if (type !== "activity" && type !== "service") new Error("type must be activity or service")

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
            {type === "activity" ?
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setCGOMNum} val={cg_om_num} />
                    <InputPIN name={"NB"} setter={setCGNBNum} val={cg_nb_num}  />
                    <InputPIN name={"NF"} setter={setCGNFNum} val={cg_nf_num}  />
                    <InputPIN name={"RNF"} setter={setCGRNFNum} val={cg_rnf_num}  />
                    <InputPIN name={"AC"} setter={setCGACNum} val={cg_ac_num}  />
                    <InputPIN name={"ABS"} setter={setCGABSNum} val={cg_abs_num}  />
                </div>
                : <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"} setter={setServiceOMNum} val={service_om_num}  />
                    <InputPIN name={"NB"} setter={setServiceNBNum} val={service_nb_num}  />
                    <InputPIN name={"NF"} setter={setServiceNFNum} val={service_nf_num}  />
                    <InputPIN name={"RNF"} setter={setServiceRNFNum} val={service_rnf_num}  />
                    <InputPIN name={"AC"} setter={setServiceACNum} val={service_ac_num}  />
                    <InputPIN name={"ABS"} setter={setServiceABSNum} val={service_abs_num}  />
                </div>
            }
        </div>
    )
}

export default function Form() {
    const [allCGLs, setAllCGLs] = useState([])
    const [currentStatellite, setCurrentSatellite] = useState(null)
    const [visible, setVisible] = useState(false);
    //const [reset, printForm] = useFormStore(state => [state.reset, state.printForm])
    const [cg_name, cgl_name, setCGAbsenceReason, setServiceAbsenceReason,
        satellite,cg_absence_reason,service_absence_reason] =
        useFormStore(state => [state.cg_name, state.cgl_name,
            state.setCGAbsenceReason, state.setServiceAbsenceReason ,state.satellite
            ,state.cg_absence_reason,state.service_absence_reason
        ])
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            const isExpire = await ifExpire();
            const localData = await get("kikilala-CGLs");
            if (localData && !isExpire) {
                setAllCGLs(localData);
                return;
            }
            readAllCGLs().then((data) => {
                console.log(data);
                setAllCGLs(data);
            })
        }
        getData();

    }, []);

    useEffect(() => {
        if(satellite){
            setCurrentSatellite(satellite)
        }
    }, [satellite])

    function submitHandler() {
        setVisible(true)
    }

    const viewHistory = () => {
        // console.log("cg_name",cg_name)
        // console.log("cgl_name",cgl_name)
        if (cg_name) {
            navigate(`/history/${cg_name}`)
        } else {
            Message.warning("Please select a CGL Name!")
        }
    }

    return (
        <div>
            <div className={"font-bold mt-0 mb-3"}>
                <div>Which Service Location do you attend?</div>
                <div></div>
            </div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite} />
            <div className={"font-bold mt-5 mb-3"}>Which Pastoral Team do you belong to?</div>
            <Selects data={allCGLs} statellite={currentStatellite} />
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many members are there in your Connect Group?</div>
                <UIInput type={"number"} />
            </div>
            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended your CG this week?
                </div>
                <InputPINs type={"activity"} />
                <TextArea placeholder='Please enter absence reasons ...'
                          value={cg_absence_reason}
                    onChange={setCGAbsenceReason}
                    className={"w-full resize-none mt-2"} />
            </div>

            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended service this week?</div>
                <InputPINs type={"service"} />
                <TextArea placeholder='Please enter absence reasons ...'
                    onChange={setServiceAbsenceReason}
                    value={service_absence_reason}
                    className={"w-full resize-none mt-2"} />
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

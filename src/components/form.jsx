import React, {useEffect, useState} from "react";
import {Select, Input, Notification, Icon} from '@arco-design/web-react';
import {readAllCGLs} from "../api/CGLs.js";
import {getAllPastoralTeamNames, getAllTeamLeaderNames} from "./data.js";
import {SendIcon} from "../Icon/SendIcon.jsx";
import DateModal from "./DateModal.jsx";
import {useFormStore} from "../store/formStore.js";
const IconFont = Icon.addFromIconFontCn({
    src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js',
});

const Option = Select.Option;
const TextArea = Input.TextArea;

function ButtonGroup({setCurrentSatellite}) {
    const [active, setActive] = useState(-1)
    const setSatellite = useFormStore(state => state.setSatellite)
    const satellites = [
        'Kuchai YW',
        'Kuchai WK',
        'Kuchai GS',
        'Klang',
        'Serdang',
        'Kepong',
        'USJ',
        'Setapak',
        'SG Long',
        'Seremban'
    ]

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

function Selects({data, statellite}) {
    const [currentPastoralTeamNames, setCurrentPastoralTeamNames] = useState([])
    const [currentPT, setCurrentPT] = useState(null)
    const [currentTeamLeaderNames, setCurrentTeamLeaderNames] = useState([])
    const [setPastoralTeam,setCGLName] = useFormStore(state => [state.setPastoralTeam,state.setCGLName])
    useEffect(() => {
        if (!statellite) return;
        setCurrentPastoralTeamNames(getAllPastoralTeamNames(statellite, data));
    }, [statellite])

    useEffect(() => {
        if (!currentPT) return;
        setCurrentTeamLeaderNames(getAllTeamLeaderNames(statellite, currentPT, data))
        setPastoralTeam(currentPT)
    }, [currentPT])

    function CGLSelectHandler(value){
        setCGLName(value)
    }


    return (
        <div className={"w-full flex flex-row justify-between h-auto"}>
            <Select placeholder='Select Pastoral Team'
                    style={{width: "45%"}}
                    onChange={setCurrentPT}
                    onFocus={() => {
                        if (!statellite) {
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
            <Select placeholder='Select CGL Name' style={{width: "45%"}}
                    onChange={CGLSelectHandler}
                    onFocus={() => {
                        if (!statellite) {
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
    );
}

function UIInput({type}) {
    const setTotalMembersNum = useFormStore(state => state.setTotalMembersNum)

    return (
        <input type={type}
               onChange={(e) => setTotalMembersNum(e.target.value)}
               className={"w-full  border-b-2 border-[#2E024930] h-[30px] my-0"}/>
    )
}

function InputPIN({name,setter}) {
    return (
        <div className={"flex flex-col justify-center w-[64px]"}>
            <input type="number"
                   className={`border-2 rounded-xl border-[#2E024930] 
                   text-center text-2xl
                   my-0 inline-block w-[50px] h-[50px] mx-[10px]`}
                     onChange={(e) => setter(e.target.value)}
            />
            <div className={"text-center"}>{name}</div>
        </div>
    )
}

function InputPINs({type}) {
    if (type !== "activity" && type !== "service") new Error("type must be activity or service")

    const [
        setCGOMNum,
        setCGNBNum,
        setCGNFNum,
        setCGRNFNum,
        setCGNBSNum
    ] = useFormStore(state => [
        state.setCGOMNum,
        state.setCGNBNum,
        state.setCGNFNum,
        state.setCGRNFNum,
        state.setCGNBSNum
    ])

    const [
        setServiceOMNum,
        setServiceNBNum,
        setServiceNFNum,
        setServiceRNFNum,
        setServiceNBSNum
    ] = useFormStore(state => [
        state.setServiceOMNum,
        state.setServiceNBNum,
        state.setServiceNFNum,
        state.setServiceRNFNum,
        state.setServiceNBSNum
    ])


    return (
        <div>
            { type === "activity" ?
                <div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"}  setter={setCGOMNum}/>
                    <InputPIN name={"NB"} setter={setCGNBNum}/>
                    <InputPIN name={"NF"}  setter={setCGNFNum}/>
                    <InputPIN name={"RNF"}  setter={setCGRNFNum}/>
                    <InputPIN name={"ABs"}  setter={setCGNBSNum}/>
                </div>
                :<div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"}  setter={setServiceOMNum}/>
                    <InputPIN name={"NB"}  setter={setServiceNBNum}/>
                    <InputPIN name={"NF"}  setter={setServiceNFNum}/>
                    <InputPIN name={"RNF"} setter={setServiceRNFNum}/>
                    <InputPIN name={"ABs"} setter={setServiceNBSNum}/>
                </div>
            }
        </div>
    )
}

export default function Form() {
    const [allCGLs, setAllCGLs] = useState([])
    const [currentStatellite, setCurrentSatellite] = useState(null)
    const [visible, setVisible] = useState(false);
    const [reset,printForm] = useFormStore(state => [state.reset,state.printForm])
    const [setCGAbsenceReason,setServiceAbsenceReason] = useFormStore(state => [state.setCGAbsenceReason,state.setServiceAbsenceReason])

    useEffect(() => {
        readAllCGLs().then((data) => {
            // console.log(data);
            setAllCGLs(data);
        })
    }, []);

    function submitHandler() {
        setVisible(true)
    }

    return (
        <div>
            <div className={"font-bold mt-0 mb-3"}>
                <div>Which Satellite are you belonging to?</div>
                <div></div>
            </div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite}/>
            <div className={"font-bold mt-5 mb-3"}>Which Pastoral Team are you belonging to?</div>
            <Selects data={allCGLs} statellite={currentStatellite}/>
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many members are there in your Cell Group?</div>
                <UIInput type={"number"}/>
            </div>
            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended your Cell Group activity this week?
                </div>
                <InputPINs type={"activity"}/>
                <TextArea placeholder='Please enter absence reasons ...'
                          onChange={setCGAbsenceReason}
                          className={"w-full resize-none mt-2"}/>
            </div>

            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended service this week?</div>
                <InputPINs type={"service"} />
                <TextArea placeholder='Please enter absence reasons ...'
                          onChange={setServiceAbsenceReason}
                          className={"w-full resize-none mt-2"}/>
            </div>
            <button className={`bg-[#00B05C] text-white rounded-[8px] p-[10px] my-[10px] mr-[10px] 
                    mt-8 flex flex-row justify-center w-[200px]`}
                    onClick={submitHandler}
                    //onClick={printForm}
            >
                <SendIcon className={"scale-50"}/>
                <span className={"ml-3"}
                >Submit Attendance</span>
            </button>
            <DateModal setVisible={setVisible} visible={visible}/>
        </div>
    )
}

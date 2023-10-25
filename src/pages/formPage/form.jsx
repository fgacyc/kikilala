import React, {useEffect, useState} from "react";
import {Select, Input, Notification, Icon} from '@arco-design/web-react';
import {readAllCGLs} from "../../api/CGLs.js";
import {
    getAllPastoralTeamNames,
    getAllTeamLeaderNames,
    getCGInfo,
    getCGName,
    getSatelliteNames,
    ifExpire
} from "./data.js";
import {SendIcon} from "../../Icon/SendIcon.jsx";
import DateModal from "./DateModal.jsx";
import {useFormStore} from "../../store/formStore.js";
import {get} from "idb-keyval";
import {IconHistory} from "@arco-design/web-react/icon";
const IconFont = Icon.addFromIconFontCn({
    src: '//at.alicdn.com/t/font_180975_26f1p759rvn.js',
});

const Option = Select.Option;
const TextArea = Input.TextArea;

function ButtonGroup({setCurrentSatellite}) {
    const [active, setActive] = useState(-1)
    const setSatellite = useFormStore(state => state.setSatellite)
    // const satellites = [
    //     'Kuchai YW',
    //     'Kuchai WK',
    //     'Kuchai GS',
    //     'Klang',
    //     'Serdang',
    //     'Kepong',
    //     'USJ',
    //     'Setapak',
    //     'SG Long',
    //     'Seremban'
    // ]
    const [satellites, setSatellites] = useState([])

    useEffect(() => {
        async function getSats(){
            const data =await getSatelliteNames();
            if (!data) return;
            setSatellites(data);
        }
       async  function getData(){
           const satellite =await  getCGInfo("satellite");
              if (!satellite) return;
              for (let i = 0; i < satellites.length; i++) {
                  if (satellites[i] === satellite) {
                      handleClick(i);
                  }
              }
       }
        getData();
        getSats();
    }, []);

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
    const [currentPT, setCurrentPT] = useState("")
    const [currentCGLName, setCurrentCGLName] = useState("")
    const [currentTeamLeaderNames, setCurrentTeamLeaderNames] = useState([])
    const [setPastoralTeam,setCGLName,setCGName] = useFormStore(state => [
        state.setPastoralTeam,state.setCGLName,state.setCGName
    ])

    const [ifPTLocal,setIfPTLocal] = useState(false)

    useEffect(() => {
        async function  getData(){
            let data =await get("kikilala-CGLs");
            if (!data) return;

            let statelliteDB = await getCGInfo("satellite");
            let pastoralTeam = await getCGInfo("pastoral_team");
            let cgl_name = await getCGInfo("cgl_name");

            // set select 1 options
            setCurrentPastoralTeamNames(getAllPastoralTeamNames(statelliteDB, data));
            // set select 2 options
            setCurrentTeamLeaderNames(getAllTeamLeaderNames(statelliteDB, pastoralTeam, data))

            // stet store
            setPastoralTeam(pastoralTeam)
            setCGLName(cgl_name)

            // set default value
            setIfPTLocal(true)
            console.log(pastoralTeam)
            setCurrentPT(pastoralTeam)
            console.log(cgl_name)
            setCurrentCGLName(cgl_name)
        }
        getData();
    }, [])

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
        setCGLName(value);
        getCGName(value).then((res) => {
            setCGName(res)
        });
    }


    return (
       <>
           {
               ifPTLocal
               ?  <div className={"w-full flex flex-row justify-between h-auto"}>
                       <Select placeholder={currentPT}
                               style={{width: "50%"}}
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
                       <Select placeholder={currentCGLName} style={{width: "45%"}}
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
                   : <div className={"w-full flex flex-row justify-between h-auto"}>
                       <Select placeholder='Pastoral Team'
                               style={{width: "50%"}}
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
                       <Select placeholder='CGL Name' style={{width: "45%"}}
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
           }
       </>
    );
}

function UIInput({type}) {
    const setTotalMembersNum = useFormStore(state => state.setTotalMembersNum)
    const [currentTotalMembersNum, setCurrentTotalMembersNum] = useState("")

    useEffect(() => {
        getCGInfo("total_members_num").then((res) => {
            console.log("total_members_num",res);
            setCurrentTotalMembersNum(res)
            setTotalMembersNum(res)
        })
    }, []);

    function handleChange(e) {
        const val = e.target.value
        if(!val){
            setTotalMembersNum(0)
            setCurrentTotalMembersNum("")
            return;
        }
        const value = parent.parseInt(val)
        setTotalMembersNum(value)
        setCurrentTotalMembersNum(value)
    }

    return (
        <input type={type}
               onChange={handleChange}
                value={currentTotalMembersNum}
               className={"w-full  border-b-2 border-[#2E024930] h-[30px] my-0"}/>
    )
}

function InputPIN({name,setter}) {
    const [currentValue, setCurrentValue] = useState("")

    function handleChange(e) {
        const valueStr = e.target.value;
        const val = valueStr.substring(0, 2);
        if(!val){
            setter(0)
            setCurrentValue("")
        }
        const value = parent.parseInt(val)
        setter(value)
        setCurrentValue(value)
    }


    return (
        <div className={"flex flex-col justify-center w-[64px]"}>
            <input type="number"
                   className={`border-[#2E024930] 
                   text-center 
                   w-[32px] h-[32px] text-xl border rounded-lg
                   sm:w-[48px] sm:h-[48px] sm:text-2xl sm:border-2 sm:rounded-xl
                   my-0 inline-block  mx-[10px]`}
                   value={currentValue}
                     onChange={handleChange}
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
        setCGACNum,
        setCGNBSNum
    ] = useFormStore(state => [
        state.setCGOMNum,
        state.setCGNBNum,
        state.setCGNFNum,
        state.setCGRNFNum,
        state.setCGACNum,
        state.setCGNBSNum
    ])

    const [
        setServiceOMNum,
        setServiceNBNum,
        setServiceNFNum,
        setServiceRNFNum,
        setServiceACNum,
        setServiceNBSNum
    ] = useFormStore(state => [
        state.setServiceOMNum,
        state.setServiceNBNum,
        state.setServiceNFNum,
        state.setServiceRNFNum,
        state.setServiceACNum,
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
                    <InputPIN name={"AC"}  setter={setCGACNum}/>
                    <InputPIN name={"ABS"}  setter={setCGNBSNum}/>
                </div>
                :<div className={"flex flex-row justify-between items-start "}>
                    <InputPIN name={"OM"}  setter={setServiceOMNum}/>
                    <InputPIN name={"NB"}  setter={setServiceNBNum}/>
                    <InputPIN name={"NF"}  setter={setServiceNFNum}/>
                    <InputPIN name={"RNF"} setter={setServiceRNFNum}/>
                    <InputPIN name={"AC"}  setter={setServiceACNum}/>
                    <InputPIN name={"ABS"} setter={setServiceNBSNum}/>
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
        async function getData(){
            const isExpire =await ifExpire();
            const localData = await get("kikilala-CGLs");
            if (localData && !isExpire){
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

    function submitHandler() {
        setVisible(true)
    }

    return (
        <div>
            <div className={"font-bold mt-0 mb-3"}>
                <div>Which Service Location do you attend?</div>
                <div></div>
            </div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite}/>
            <div className={"font-bold mt-5 mb-3"}>Which Pastoral Team do you belong to?</div>
            <Selects data={allCGLs} statellite={currentStatellite}/>
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many members are there in your Connect Group?</div>
                <UIInput type={"number"}/>
            </div>
            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended your CG this week?
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

            <div className={"flex flex-row justify-between items-end"}>
                <button className={`bg-[#00B05C] text-white rounded-[8px] p-[10px] my-[10px] mr-[10px] 
                    mt-8 flex flex-row justify-center w-[200px]`}
                        onClick={submitHandler}
                    //onClick={printForm}
                >
                    <SendIcon className={"scale-50"}/>
                    <span className={"ml-3"}
                    >Submit Attendance</span>
                </button>
                <div className={`w-[44px] h-[44px] bg-gray-200 rounded-[8px] 
                                hover:bg-[#00B05C] hover:text-white cursor-pointer
                                flex flex-row items-center justify-center mb-[10px]`}>
                    <IconHistory fontSize={24} />
                </div>
            </div>
            <DateModal setVisible={setVisible} visible={visible}/>
        </div>
    )
}

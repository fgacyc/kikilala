import {useEffect, useState} from "react";
import { Select,Input } from '@arco-design/web-react';
import {readAllCGLs} from "../api/CGLs.js";
import {getAllPastoralTeamNames, getAllTeamLeaderNames} from "./data.js";
import {SendIcon} from "../Icon/SendIcon.jsx";
import DateModal from "./DateModal.jsx";
const Option = Select.Option;
const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled'];
const TextArea = Input.TextArea;

function ButtonGroup({setCurrentSatellite}){
    const [active,setActive] = useState(-1)
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

    function handleClick(index){
        setActive(index)
        setCurrentSatellite(satellites[index])
    }

    return (
        <div>
            {
                satellites.map((satellite,index) => {
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

function Selects({data,statellite}){
    const [currentPastoralTeamNames,setCurrentPastoralTeamNames] = useState([])
    const [currentPT,setCurrentPT] = useState(null)
    const  [currentTeamLeaderNames,setCurrentTeamLeaderNames] = useState([])
    const [filteredCGLs,setFilteredCGLs] = useState([])
    useEffect(() => {
        if (!statellite) return;
        setCurrentPastoralTeamNames(getAllPastoralTeamNames(statellite,data));
    },[statellite])

    useEffect(() => {
        if (!currentPT) return;
        setCurrentTeamLeaderNames(getAllTeamLeaderNames(statellite,currentPT,data))
    },[currentPT])


    return (
        <div className={"w-full flex flex-row justify-between"}>
            <Select placeholder='Select Pastoral Team'
                    style={{ width: "45%" }} allowClear showSearch
                onChange={setCurrentPT}
            >
                {currentPastoralTeamNames && currentPastoralTeamNames.map((option, index) => (
                    <Option key={option} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>
            <Select placeholder='Select CGL Name' style={{ width: "45%" }} allowClear showSearch>
                {currentTeamLeaderNames && currentTeamLeaderNames.map((option, index) => (
                    <Option key={option}  value={option}>
                        {option}
                    </Option>
                ))}
            </Select>
        </div>
    );
}

function UIInput({type}){
    return (
        <input type={type}
               className={"w-full  border-b-2 border-[#2E024930] h-[30px] my-0"} />
    )
}

function InputPIN({name}){
    return (
        <div className={"flex flex-col justify-center w-[64px]"}>
            <input type="number"
                   className={`border-2 rounded-xl border-[#2E024930] 
                   text-center text-2xl
                   my-0 inline-block w-[50px] h-[50px] mx-[10px]`}
            />
            <div className={"text-center"}>{name}</div>
        </div>
    )
}

function InputPINs(){
    return(
        <div className={"flex flex-row justify-between items-start "}>
            <InputPIN name={"OM"}/>
            <InputPIN name={"NB"}/>
            <InputPIN name={"NF"}/>
            <InputPIN name={"RNF"}/>
            <InputPIN name={"ABs"}/>
        </div>
    )
}

export default  function Form(){
    const [allCGLs,setAllCGLs] = useState([])
    const [currentStatellite,setCurrentSatellite] = useState(null)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        readAllCGLs().then((data) => {
            console.log(data);
            setAllCGLs(data);
        })
    }, []);

    function submitHandler(){
        setVisible(true)
    }

    return (
        <div>
            <div className={"font-bold mt-0 mb-3"}>Which Satellite are you belonging to?</div>
            <ButtonGroup setCurrentSatellite={setCurrentSatellite}/>
            <div className={"font-bold mt-5 mb-3"}>Which Pastoral Team are you belonging to?</div>
            <Selects data={allCGLs} statellite={currentStatellite}/>
            <div>
                <div className={"font-bold mt-5 mb-1"}>How many members are there in your Cell Group?</div>
                <UIInput type={"number"}/>
            </div>
            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended your Cell Group activity this week?</div>
                <InputPINs />
                <TextArea placeholder='Please enter absence reasons ...'
                          className={"w-full resize-none mt-2"} />
            </div>

            <div>
                <div className={"font-bold mt-5 mb-3"}>How many members attended service this week?</div>
                <InputPINs />
                <TextArea placeholder='Please enter absence reasons ...'
                          className={"w-full resize-none mt-2"} />
            </div>
            <button className={`bg-[#00B05C] text-white rounded-[8px] p-[10px] my-[10px] mr-[10px] 
                mt-8
                flex flex-row justify-center w-[200px]`}>
                <SendIcon className={"scale-50"}/>
                <span className={"ml-3"}
                        onClick={submitHandler}
                >Submit Attendance</span>
            </button>
            <DateModal setVisible={setVisible} visible={visible}/>
        </div>
    )
}

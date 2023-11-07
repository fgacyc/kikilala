import React, {useEffect, useState} from "react";
import {useFormStore} from "../../store/formStore.js";
import {get} from "idb-keyval";
import {getAllPastoralTeamNames, getAllTeamLeaderNames, getCGName} from "../formPage/data.js";
import {Notification, Select} from "@arco-design/web-react";


const Option = Select.Option;

export  default  function Selects({ data, statellite }) {
    const [currentPastoralTeamNames, setCurrentPastoralTeamNames] = useState([])
    const [currentPT, setCurrentPT] = useState("")
    const [currentCGLName, setCurrentCGLName] = useState("")
    const [currentTeamLeaderNames, setCurrentTeamLeaderNames] = useState([])
    const [setPastoralTeam, setCGLName, setCGName,satellite,pastoral_team,cgl_name,setCGID] = useFormStore(state => [
        state.setPastoralTeam, state.setCGLName, state.setCGName,
        state.satellite, state.pastoral_team, state.cgl_name,state.setCGID
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
            console.log(res)
            setCGName(res.cg_name)
            setCGID(res.cg_id)
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
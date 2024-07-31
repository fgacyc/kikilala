import {Input, Select, Modal, Message} from '@arco-design/web-react';
import {useEffect, useState} from "react";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {getLocation, getPastoralTeam} from "../../config.js";
import {addPastoralLeader} from "../../api/pastoral_leader.js";
import PubSub from "pubsub-js";
const Option = Select.Option;
const options = [
    {
        role:'Pastor',
        role_id : "rol_930865293a64447e91ea"
    },
    {
        role:'Team Leader',
        role_id : "rol_482a585b8f764e19a90a"
    },
    {
        role:'Coach',
        role_id : "rol_3646e05f277b4e218d00"
    }
];

function CGLCard({data, selected_CGLs, addSelectedCGLs}){
    const [isSelect, setIsSelect] = useState(false);

    function clickHandler(){
        addSelectedCGLs(data);
        const selected_CGL_ids = Object.keys(selected_CGLs);
        if (selected_CGL_ids.includes(data.CG_id)){
            setIsSelect(true);
        }else{
            setIsSelect(false);
        }
    }
    return (
        <div className={`border rounded p-2 cursor-pointer hover:bg-[#33CC99] hover:text-white3 
             ${isSelect && "bg-[#33CC99] text-white"}`}
             onClick={clickHandler}
        >
            <div className={"w-[80%]"}>{data.CG_leader}</div>
        </div>
    )
}

export default function StructureInfoModifyModal({ visible, setVisible }){
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [role, setRole] = useState("");
    const currentCGLs= useAttendanceStore(state => state.currentCGLs);
    const [currentLocation, setCurrentLocation] = useState("");
    const [pastoralTeamOptions, setPastoralTeamOptions] = useState([]);
    const [currentPastoralTeam, setCurrentPastoralTeam] = useState("");
    const [filterCGLs , setFilterCGLs] = useState([]);
    const [selected_CGLs, setSelected_CGLs] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    function addSelectedCGLs(data){
        const cg_id = data.CG_id;
        if(selected_CGLs[cg_id]){
            delete selected_CGLs[cg_id];
        }else{
            selected_CGLs[cg_id] = data;
        }
        // console.log(selected_CGLs)
        setSelected_CGLs(selected_CGLs);
    }

    function submit(){
        if (!name || !nickname || !role || !currentLocation || !currentPastoralTeam ) {
            Message.warning("Please fill in all the fields");
            return;
        }
        if(Object.keys(selected_CGLs).length === 0){
            Message.warning("Please select at least one CGL");
            return;
        }
        if (isLoading) return;
        setIsLoading(true);

        const cg_id_list =  Object.keys(selected_CGLs);
        addPastoralLeader(name,nickname,role,cg_id_list).then((res) => {
            if(res.status === true){
                Message.success("Successfully added");
                resetForm();
                PubSub.publish("updateLeaders");
            }else{
                Message.error("Failed to add");
            }
            setVisible(false);
            setIsLoading(false);
        });
    }

    function resetForm(){
        setName("");
        setNickname("");
        setSelected_CGLs({});
        window.location.reload();
    }

    useEffect(() => {
        setPastoralTeamOptions(getPastoralTeam(currentLocation));
    }, [currentLocation]);

    useEffect(() => {
        if(!currentLocation||!currentPastoralTeam) return;
        const filterCGLs = currentCGLs.filter((cgl) => cgl.satellite === currentLocation && cgl.pastoral_team === currentPastoralTeam);
        setFilterCGLs(filterCGLs);
        // console.log(filterCGLs)

    }, [currentPastoralTeam]);

    return (
        <Modal
            title="Pastoral Leader

             Info"
            visible={visible}
            onOk={() => {
                submit();
            }}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Name</div>
                    <Input className={"w-[80%]"}
                           value={name}
                           defaultValue={name}
                           onChange={setName}
                           placeholder='please enter name...'/>
                </div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Nickname</div>
                    <Input className={"w-[80%]"}
                           value={nickname}
                           defaultValue={nickname}
                           onChange={setNickname}
                           placeholder='please enter nickname...'/>
                </div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Role</div>
                    <Select
                        placeholder='Select role'
                        className={"w-[80%]"}
                        onChange={setRole}
                    >
                        {options.map((option, index) => (
                            <Option key={index} value={option.role_id}
                                    disabled={index === 0 || index === 1}
                            >
                                {option.role}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>CGLs</div>
                    <Select
                        placeholder='Select Location'
                        className={"w-[40%] mr-2"}
                        onChange={setCurrentLocation}
                    >
                        {getLocation().map((option, index) => (
                            <Option key={index} value={option}
                            >
                                {option}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder='Select Pastoral Team'
                        className={"w-[40%]"}
                        onChange={(value) => {
                            setCurrentPastoralTeam(value)
                        }}
                    >
                        {pastoralTeamOptions && pastoralTeamOptions.map((option, index) => (
                            <Option key={index} value={option}
                            >
                                {option}
                            </Option>
                        ))}
                    </Select>
                </div>
               <div className={"grid sm:grid-cols-3 grid-cols-1 gap-4 w-[80%] ml-[20%] max-h-[400px] overflow-y-auto"}>
                   {
                       filterCGLs.length > 0  && filterCGLs.map((cgl, index)=> {
                           return (
                               <CGLCard key={cgl.CG_id}
                                        data={cgl}
                                        selected_CGLs={selected_CGLs}
                                        addSelectedCGLs={addSelectedCGLs}
                               />
                           )
                       })
                   }
               </div>
            </div>
        </Modal>
    );
}

import {Message, Modal, Select} from "@arco-design/web-react";
import { Form, Input } from '@arco-design/web-react';
import {useCGLStore} from "../../store/CGLStore.js";
import {pastoralTeamList, satelliteList} from "../../config.js";
import {useEffect, useRef} from "react";
import {updateCGL} from "../../api/CGLs.js";
import PubSub from "pubsub-js";
const FormItem = Form.Item;
const Option = Select.Option;

export default function CGLsInfoEditModal({ visible, setVisible }) {
    // const formRef = useRef(null);
    // const [form] = Form.useForm();
    const [
        CG_leader,
        CG_name,
        pastoral_team,
        satellite,
        docId,
        nickname,
    ] = useCGLStore(state => [
        state.CG_leader,
        state.CG_name,
        state.pastoral_team,
        state.satellite,
        state.docId,
        state.nickname,
    ]);
    const [
        setCGLeader,
        setCGName,
        setPastoralTeam,
        setSatellite,
        setNickname,
    ] = useCGLStore(state => [
        state.setCGLeader,
        state.setCGName,
        state.setPastoralTeam,
        state.setSatellite,
        state.setNickname,
    ]);

    const getForm = useCGLStore(state => state.getForm);


    function  handleSubmit() {
        const data = getForm();
        const  docId = data.docId;
        // console.log(data)
        // return;

        updateCGL(docId,data).then((res) => {
            if (res!== false){
                Message.success('Submitted successfully!')
                PubSub.publish('updateCGLs');
            }
        })
    }


    return (
        <Modal
            title="Modify CGLs' information"
            visible={visible}
            onOk={() => {
                setVisible(false)
                handleSubmit()
            }}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
            style={{
                width: 600,
            }}
        >
            <div className={"flex flex-row items-center mb-4"}>
                <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>CG Leader</div>
                <Input value={CG_leader}
                       className={"w-[80%]"}
                       defaultValue={CG_leader}
                       onChange={setCGLeader}
                       placeholder='please enter CGL name...' />
            </div>
            <div className={"flex flex-row items-center mb-4"}>
                <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>CGL nickname</div>
                <Input className={"w-[80%]"}
                       value={nickname}
                          defaultValue={nickname}
                       onChange={setNickname}
                    placeholder='please enter CGL nickname...' />
            </div>
            <div className={"flex flex-row items-center mb-4"}>
                <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>CG Name</div>
                <Input className={"w-[80%]"}
                       value={CG_name}
                       defaultValue={CG_name}
                          onChange={setCGName}
                       placeholder='please enter CG name...' />
            </div>
            <div className={"flex flex-row items-center mb-4"}>
                <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Satellite</div>
                <Select
                    placeholder='Please select satellite...'
                    value={satellite}
                    onChange={setSatellite}
                    defaultValue={satellite}
                    className={"w-[80%]"}
                >
                    {satelliteList.map((option, index) => (
                        <Option key={index} value={option.value}>
                            {option.text}
                        </Option>
                    ))}
                </Select>
            </div>
            <div  className={"flex flex-row items-center mb-4"}>
                <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Pastoral Team</div>
                <Select
                    placeholder='Please select  pastoral team...'
                    value={pastoral_team}
                    defaultValue={pastoral_team}
                    onChange={setPastoralTeam}
                    className={"w-[80%]"}
                >
                    {pastoralTeamList.map((option, index) => (
                        <Option key={index} value={option.value}>
                            {option.text}
                        </Option>
                    ))}
                </Select>
            </div>

            {/*<hr/>*/}

            {/*<Form*/}
            {/*      ref={formRef}*/}
            {/*      form={form}*/}
            {/*      autoComplete='off'>*/}
            {/*    <FormItem label='CG Leader'*/}
            {/*        field={'CG_leader'}*/}
            {/*    >*/}
            {/*        <Input value={CG_leader}*/}
            {/*               defaultValue={CG_leader}*/}
            {/*            placeholder='please enter CGL name...' />*/}
            {/*    </FormItem>*/}
            {/*    <FormItem label='CGL nickname'*/}
            {/*              field={'nickname'}*/}
            {/*    >*/}
            {/*        <Input*/}
            {/*            placeholder='please enter CGL nickname...' />*/}
            {/*    </FormItem>*/}
            {/*    <FormItem label='CG Name'*/}
            {/*        field={'CG_name'}*/}
            {/*    >*/}
            {/*        <Input  value={CG_name}*/}
            {/*                defaultValue={CG_name}*/}
            {/*            placeholder='please enter CG name...' />*/}
            {/*    </FormItem>*/}
            {/*    <FormItem label='Satellite'*/}
            {/*              field={'satellite'}*/}
            {/*    >*/}
            {/*        <Select*/}
            {/*            placeholder='Please select satellite...'*/}
            {/*            value={satellite}*/}
            {/*        >*/}
            {/*            {satelliteList.map((option, index) => (*/}
            {/*                <Option key={index} value={option.value}>*/}
            {/*                    {option.text}*/}
            {/*                </Option>*/}
            {/*            ))}*/}
            {/*        </Select>*/}
            {/*    </FormItem>*/}
            {/*    <FormItem label='Pastoral Team'*/}
            {/*        field={'pastoral_team'}*/}
            {/*    >*/}
            {/*        <Select*/}
            {/*            placeholder='Please select  pastoral team...'*/}
            {/*            value={pastoral_team}*/}
            {/*        >*/}
            {/*            {pastoralTeamList.map((option, index) => (*/}
            {/*                <Option key={index} value={option.value}>*/}
            {/*                    {option.text}*/}
            {/*                </Option>*/}
            {/*            ))}*/}
            {/*        </Select>*/}
            {/*    </FormItem>*/}

            {/*</Form>*/}
        </Modal>
    );
}

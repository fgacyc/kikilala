import {Message, Modal, Select} from "@arco-design/web-react";
import { Form, Input } from '@arco-design/web-react';
import {useCGLStore} from "../../store/CGLStore.js";
import {CGCategoryList, getShortCGCategory, getShortSatellite, pastoralTeamList, satelliteList} from "../../config.js";
import {useEffect, useRef, useState} from "react";
import {addCGL, CGStatusEnum, duplicateCheck, updateCGL} from "../../api/CGLs.js";
import PubSub from "pubsub-js";
import {get} from "idb-keyval";
const FormItem = Form.Item;
const Option = Select.Option;


export default function CGLsAddModal({ visible, setVisible }) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const coachOptions = useCGLStore(state => state.coachOptions);
    const [activeCGs, setActiveCGs] =useState(null);


    async  function  handleSubmit() {
        const data = formRef.current.getFieldsValue();
        //console.log(data)
        const isCGNameDuplicate = await duplicateCheck(data.CG_name);
        //console.log("isCGNameDuplicate",isCGNameDuplicate)
        if(isCGNameDuplicate){
            Message.warning('CG Name already exists!')
            return;
        }

        data.CG_status = CGStatusEnum.active;

        if (data.coach_name === undefined){
            // Message.warning('Please select/enter coach name!')
            // return;
            data.coach_name = "";
        }

        // console.log(data)
        // return;

        addCGL(data).then((res) => {
            // console.log(res)
            if (res!== false){
                Message.success('Submitted successfully!')
                PubSub.publish('updateCGLs');
                setVisible(false);
            }
        })
    }

    async function getCGLNumber(satellite) {
        const data = await get("kikilala-CGLs-active");
        if (data === undefined) return 0;
        setActiveCGs(data);
        let count = 0;
        for (let key in data) {
            if (data[key].satellite === satellite) count++;
        }
        return count;
    }

    function ifCGNameExists(cg_name) {
        if (activeCGs === null) return false;
        for (let key in activeCGs) {
            if (activeCGs[key].cg_name === cg_name) return true;
        }
        return false;
    }

    async  function formOnValuesChange() {
        const data = formRef.current.getFieldsValue();
        // console.log(data)

        if (!data.CG_leader || !data.category || !data.nickname || !data.pastoral_team || !data.satellite) return;

        const satellite_short = getShortSatellite(data.satellite);
        const category_short = getShortCGCategory(data.category);

        let  cglNumbers =await getCGLNumber(data.satellite);
        let new_cg_name = `CYC${satellite_short && " " + satellite_short } ${cglNumbers+1} ${category_short}`;
        // const isCGNameDuplicate = await duplicateCheck(new_cg_name);
        //console.log("new_cg_name",new_cg_name)

        while ( await  duplicateCheck(new_cg_name)) {
            cglNumbers++;
            new_cg_name = `CYC${satellite_short && " " + satellite_short } ${cglNumbers+1} ${category_short}`;
        }

        formRef.current.setFieldsValue({
            CG_name: new_cg_name
        })


        // getCGLNumber(data.satellite).then((res) => {
        //     let new_cg_name = `CYC${satellite_short && " " + satellite_short } ${res+1} ${category_short}`;
        //     const isCGNameDuplicate = await duplicateCheck(data.CG_name);
        //     //console.log("new_cg_name",new_cg_name)
        //     //console.log("ifCGNameExists(new_cg_name)",ifCGNameExists(new_cg_name))
        //     while (ifCGNameExists(new_cg_name)) {
        //         res++;
        //         new_cg_name = `CYC${satellite_short && " " + satellite_short } ${res+1} ${category_short}`;
        //     }
        //
        //     formRef.current.setFieldsValue({
        //         CG_name: new_cg_name
        //     })
        // })
    }


    return (
        <Modal
            title="Add new CGLs"
            visible={visible}
            onOk={handleSubmit}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
            style={{
                width: 600,
            }}
        >
            <Form
                  ref={formRef}
                  form={form}
                  onChange={formOnValuesChange}
                  autoComplete='off'>
                <FormItem label='CGL name'
                          field={'CG_leader'}
                >
                    <Input
                           placeholder='please enter CGL name...' />
                </FormItem>
                <FormItem label='CGL nickname'
                          field={'nickname'}
                >
                    <Input
                        placeholder='please enter CGL nickname...' />
                </FormItem>
                <FormItem label='CG Name'
                          field={'CG_name'}
                >
                    <Input
                        disabled={true}
                            placeholder='CG name...' />
                </FormItem>
                <FormItem label='Satellite'
                          field={'satellite'}
                >
                    <Select
                        placeholder='Please select satellite...'
                    >
                        {satelliteList.map((option, index) => (
                            <Option key={index} value={option.value}>
                                {option.text}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem label='Pastoral Team'
                          field={'pastoral_team'}
                >
                    <Select
                        placeholder='Please select  pastoral team...'
                    >
                        {pastoralTeamList.map((option, index) => (
                            <Option key={index} value={option.value}>
                                {option.text}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                {/*<FormItem label='Coach Name'*/}
                {/*          field={'coach_name'}*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        // mode='multiple'*/}
                {/*        placeholder='Please select/enter coach name...'*/}
                {/*        allowCreate*/}
                {/*    >*/}
                {/*        {coachOptions.map((option, index) => (*/}
                {/*            <Option key={index} value={option}>*/}
                {/*                {option}*/}
                {/*            </Option>*/}
                {/*        ))}*/}
                {/*    </Select>*/}
                {/*</FormItem>*/}
                <FormItem label='Category'
                          field={'category'}
                >
                    <Select
                        // mode='multiple'
                        placeholder='Please select group category...'
                        allowClear
                    >
                        {CGCategoryList.map((option,index) => (
                            <Option key={index} value={option.value}>
                                {option.text}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    );
}

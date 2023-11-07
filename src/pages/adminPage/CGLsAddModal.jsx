import {Message, Modal, Select} from "@arco-design/web-react";
import { Form, Input, Button, Checkbox } from '@arco-design/web-react';
import {useCGLStore} from "../../store/CGLStore.js";
import {pastoralTeamList, satelliteList} from "../../config.js";
import {useEffect, useRef, useState} from "react";
import {addCGL, CGStatusEnum, duplicateCheck, updateCGL} from "../../api/CGLs.js";
import PubSub from "pubsub-js";
const FormItem = Form.Item;
const Option = Select.Option;


export default function CGLsAddModal({ visible, setVisible }) {
    const formRef = useRef(null);
    const [form] = Form.useForm();

    async  function  handleSubmit() {
        const data = formRef.current.getFieldsValue();
        //console.log(data)
        const isCGNameDuplicate = await duplicateCheck(data.CG_name);
        if(isCGNameDuplicate){
            Message.warning('CG Name already exists!')
            return;
        }

        data.CG_status = CGStatusEnum.active;
        addCGL(data).then((res) => {
            console.log(res)
            if (res!== false){
                Message.success('Submitted successfully!')
                PubSub.publish('updateCGLs');
                setVisible(false);
            }
        })
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
            <Form style={{ width: 550 }}
                  ref={formRef}
                  form={form}
                  autoComplete='off'>
                <FormItem label='CG Leader'
                          field={'CG_leader'}
                >
                    <Input
                           placeholder='please enter your username...' />
                </FormItem>
                <FormItem label='CG Name'
                          field={'CG_name'}
                >
                    <Input
                            placeholder='please enter your post...' />
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
            </Form>
        </Modal>
    );
}

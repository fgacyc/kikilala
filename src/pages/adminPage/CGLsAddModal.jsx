import {Message, Modal, Select} from "@arco-design/web-react";
import { Form, Input } from '@arco-design/web-react';
import {useCGLStore} from "../../store/CGLStore.js";
import {CGCategoryList, pastoralTeamList, satelliteList} from "../../config.js";
import { useRef} from "react";
import {addCGL, CGStatusEnum, duplicateCheck, updateCGL} from "../../api/CGLs.js";
import PubSub from "pubsub-js";
const FormItem = Form.Item;
const Option = Select.Option;


export default function CGLsAddModal({ visible, setVisible }) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const coachOptions = useCGLStore(state => state.coachOptions);


    async  function  handleSubmit() {
        const data = formRef.current.getFieldsValue();
        //console.log(data)
        const isCGNameDuplicate = await duplicateCheck(data.CG_name);
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
                            placeholder='please enter CG name...' />
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

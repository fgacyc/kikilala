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
    const [
        CG_leader,
        CG_name,
        pastoral_team,
        satellite,
        docId
    ] = useCGLStore(state => [
        state.CG_leader,
        state.CG_name,
        state.pastoral_team,
        state.satellite,
        state.docId
    ]);

    useEffect(() => {
        if(!formRef.current) return;
        if (visible) {
            formRef.current?.setFieldsValue({
                CG_leader: CG_leader,
                CG_name: CG_name,
                pastoral_team: pastoral_team,
                satellite: satellite,
            }   );
        }
    }, [visible]);




    const formRef = useRef(null);
    const [form] = Form.useForm();

    function  handleSubmit() {
        const data = formRef.current.getFieldsValue();
        // console.log(data)
        // console.log(docId)
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
            <Form style={{ width: 550 }}
                  ref={formRef}
                  form={form}
                  autoComplete='off'>
                <FormItem label='CG Leader'
                    field={'CG_leader'}
                >
                    <Input value={CG_leader}
                           defaultValue={CG_leader}
                        placeholder='please enter your username...' />
                </FormItem>
                <FormItem label='CG Name'
                    field={'CG_name'}
                >
                    <Input  value={CG_name}
                            defaultValue={CG_name}
                        placeholder='please enter your post...' />
                </FormItem>
                <FormItem label='Pastoral Team'
                    field={'pastoral_team'}
                >
                    <Select
                        placeholder='Please select  pastoral team...'
                        value={pastoral_team}
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
                            value={satellite}
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

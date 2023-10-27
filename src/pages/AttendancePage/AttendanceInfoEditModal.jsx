import React, { useEffect, useState } from 'react'
import { Form, Message, Divider, InputNumber, Drawer } from '@arco-design/web-react';
import { updateAttend } from '../../api/attendance';
import { useFormStore } from '../../store/formStore';

const FormItem = Form.Item;

const AttendanceInfoEditModal = ({ visible, setVisible, attendanceRecord }) => {
    const attendance_list = ['OM', 'NB', 'NF', 'RNF', 'AC', 'NBS']

    const [attendanceData, setAttendanceData] = useState({})
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();

    const [setRowKey, setTotalMembersNum] = useFormStore((state) => [state.setRowKey, state.setTotalMembersNum]);

    useEffect(() => {
        console.log(attendanceRecord);
        if (visible) {
            setTotal(attendanceRecord.total_members_num);
            setAttendanceData(attendanceRecord)
            form.setFieldsValue({
                cg_om_num: attendanceRecord.cg_om_num,
                cg_nb_num: attendanceRecord.cg_nb_num,
                cg_nf_num: attendanceRecord.cg_nf_num,
                cg_rnf_num: attendanceRecord.cg_rnf_num,
                cg_ac_num: attendanceRecord.cg_ac_num,
                cg_nbs_num: attendanceRecord.cg_nbs_num,
                service_om_num: attendanceRecord.service_om_num,
                service_nb_num: attendanceRecord.service_nb_num,
                service_nf_num: attendanceRecord.service_nf_num,
                service_rnf_num: attendanceRecord.service_rnf_num,
                service_ac_num: attendanceRecord.service_ac_num,
                service_nbs_num: attendanceRecord.service_nbs_num,
            })
        }
    }, [visible])

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const updateattendanceData = async () => {
        let fieldsValue = form.getFieldsValue();

        // Calculate the new total
        let cgTotal = 0;
        let serviceTotal = 0;

        attendance_list.slice(0, 2).forEach((item) => {
            const cgValue = fieldsValue[`cg_${item.toLowerCase()}_num`] || 0;
            const serviceValue = fieldsValue[`service_${item.toLowerCase()}_num`] || 0;
            cgTotal += cgValue;
            serviceTotal += serviceValue;
        });

        const higherTotal = Math.max(cgTotal, serviceTotal);
        fieldsValue.total_members_num = higherTotal;

        const attendance_data = await updateAttend(attendanceData.key, fieldsValue);

        if (attendance_data) {
            setTotal(higherTotal);
            setRowKey(attendanceRecord.key);
            setTotalMembersNum(higherTotal);
            Message.success('Updated successfully!');
        } else {
            Message.error('Failed to update. Please try again.');
        }
    }


    return (
        <Drawer
            width={'100%'}
            visible={visible}
            onOk={updateattendanceData}
            onCancel={() => {
                setVisible(false);
            }}
        >
            <div className='flex justify-center mx-auto my-10'>
                <div className='mr-10 font-semibold'>
                    <div>Date</div>
                    <div>CG Leader</div>
                    <div>Pastoral Team</div>
                    <div>Satellite</div>
                    <div>Total Members</div>
                </div>
                {
                    attendanceData && (
                        <div>
                            <div>{attendanceData.date}</div>
                            <div>{attendanceData.cgl_name}</div>
                            <div>{attendanceData.pastoral_team}</div>
                            <div>{attendanceData.satellite}</div>
                            <div>{total}</div>
                        </div>
                    )
                }
            </div>
            <Form
                {...formItemLayout}
                form={form}
                labelCol={{
                    style: { flexBasis: 90 },
                }}
                wrapperCol={{
                    style: { flexBasis: 'calc(100% - 90px)' },
                }}
            >
                <Divider orientation='center'>Connect Group</Divider>
                {
                    attendanceData && attendance_list.map((item, index) => {
                        return (
                            <FormItem
                                key={index}
                                label={item}
                                field={`cg_${item.toLowerCase()}_num`}
                                // initialValue={attendanceData[`cg_${item.toLowerCase()}_num`] || 0}
                                className='w-[450px] mx-auto'>
                                <InputNumber
                                    min={0}
                                />
                            </FormItem>
                        )
                    })
                }
                <Divider orientation='center'>Service</Divider>
                {
                    attendanceData && attendance_list.map((item, index) => {
                        return (
                            <FormItem
                                key={index}
                                label={item}
                                field={`service_${item.toLowerCase()}_num`}
                                // initialValue={attendanceData[`service_${item.toLowerCase()}_num`] || 0}
                                className='w-[450px] mx-auto'>
                                <InputNumber
                                    min={0}
                                />
                            </FormItem>
                        )
                    })
                }
            </Form>
        </Drawer >
    )
}

export default AttendanceInfoEditModal
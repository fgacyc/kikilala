import React, { useEffect, useState } from 'react'
import { Form, Message, Divider, InputNumber, Drawer, Input, Space } from '@arco-design/web-react';
import { updateAttend } from '../../api/attendance';
import { useFormStore } from '../../store/formStore';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const CGInfo = ({ attendanceData, total }) => {
    const cg_info_list = ['Date', 'CG Leader', 'Pastoral Team', 'Satellite', 'Total Members']

    return (
        <div className='flex justify-center mx-auto my-10'>
            <div className='mr-10 font-semibold'>
                {cg_info_list.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
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
    )
}

const AttendanceCard = ({ title, attendanceType, attendanceData, attendance_list }) => {
    return (
        <>
            <Divider orientation='center'>{title}</Divider>
            <div className="mx-auto">
                <div className="flex flex-wrap w-[325px]">
                    {attendanceData &&
                        attendance_list.map((item, index) => (
                            <div key={index}>
                                <FormItem
                                    label={item === 'NBS' ? 'ABS' : item}
                                    field={`${attendanceType}_${item.toLowerCase()}_num`}
                                    className="w-[150px] mt-6"
                                >
                                    <InputNumber min={0} />
                                </FormItem>
                            </div>
                        ))}
                </div>
                <Divider orientation='center'>Absence Reason</Divider>
                <FormItem field={`${attendanceType}_absence_reason`}>
                    <TextArea className="w-[325px] min-h-[100px] mt-3"></TextArea>
                </FormItem>
            </div>
        </>
    );
};

const AttendanceInfoEditModal = ({ visible, setVisible, attendanceRecord }) => {
    const attendance_list = ['OM', 'NB', 'NF', 'RNF', 'AC', 'NBS']

    const [attendanceData, setAttendanceData] = useState({})
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();

    const [setRowKey, setTotalMembersNum] = useFormStore((state) => [state.setRowKey, state.setTotalMembersNum]);

    useEffect(() => {
        if (visible) {
            setTotal(attendanceRecord.total_members_num);
            setAttendanceData(attendanceRecord)
            form.setFieldsValue({
                cg_om_num: attendanceRecord.cg_om_num,
                cg_nb_num: attendanceRecord.cg_nb_num,
                cg_nf_num: attendanceRecord.cg_nf_num,
                cg_rnf_num: attendanceRecord.cg_rnf_num,
                cg_ac_num: attendanceRecord.cg_ac_num,
                cg_abs_num: attendanceRecord.cg_abs_num,
                cg_absence_reason: attendanceRecord.cg_absence_reason || 'none',
                service_om_num: attendanceRecord.service_om_num,
                service_nb_num: attendanceRecord.service_nb_num,
                service_nf_num: attendanceRecord.service_nf_num,
                service_rnf_num: attendanceRecord.service_rnf_num,
                service_ac_num: attendanceRecord.service_ac_num,
                service_abs_num: attendanceRecord.service_abs_num,
                service_absence_reason: attendanceRecord.service_absence_reason || 'none',
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

    const calculateTotal = (fieldsValue) => {
        // Calculate the new total
        let cgTotal = 0;
        let serviceTotal = 0;

        attendance_list.slice(0, 2).forEach((item) => {
            const cgValue = fieldsValue[`cg_${item.toLowerCase()}_num`] || 0;
            const serviceValue = fieldsValue[`service_${item.toLowerCase()}_num`] || 0;
            cgTotal += cgValue;
            serviceTotal += serviceValue;
        });

        return Math.max(cgTotal, serviceTotal);
    }


    const updateattendanceData = async () => {
        let fieldsValue = form.getFieldsValue();
        fieldsValue.total_members_num = calculateTotal(fieldsValue);

        const attendance_data = await updateAttend(attendanceData.key, fieldsValue);

        if (attendance_data) {
            setTotal(fieldsValue.total_members_num);
            setRowKey(attendanceRecord.key);
            setTotalMembersNum(fieldsValue.total_members_num);
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
            <CGInfo attendanceData={attendanceData} total={total} />
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
                <AttendanceCard
                    title='Connect Group'
                    attendanceType='cg'
                    attendanceData={attendanceData}
                    attendance_list={attendance_list}
                />
                <AttendanceCard
                    title='Service'
                    attendanceType='service'
                    attendanceData={attendanceData}
                    attendance_list={attendance_list}
                />
            </Form>
        </Drawer >
    )
}

export default AttendanceInfoEditModal

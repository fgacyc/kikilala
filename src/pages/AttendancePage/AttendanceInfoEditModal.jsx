import React, { useEffect, useState } from 'react'
import { Form, Message, Divider, InputNumber, Drawer, Input, Select } from '@arco-design/web-react';
import { updateAttend } from '../../api/attendance';
import useSelectedRowStore from '../../store/attendanceRecordStore';
import { getWeekDatesArray } from '../formPage/data';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const CGInfo = ({ attendanceRecord, valueRange, setValueRange }) => {
    const cg_info_list = ['CG Leader', 'Pastoral Team', 'Satellite', 'Total Members']
    const dateArray = getWeekDatesArray(4);
    const Option = Select.Option;

    return (
        <div className='flex justify-center mx-auto my-10'>
            <div className='mr-10 font-semibold'>
                <div className='h-[45px] mt-[5px]'>Date</div>
                {cg_info_list.map((item, index) => (
                    <div key={index} className='h-[40px]'>{item}</div>
                ))}
            </div>
            {
                attendanceRecord && (
                    <div>
                        {
                            dateArray &&
                            <Select
                                className='h-[50px]'
                                value={valueRange}
                                onChange={(v) => setValueRange(v)}
                            >
                                {dateArray.slice().reverse().map((option, index) => (
                                    <Option key={index} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        }
                        <div className='h-[40px]'>{attendanceRecord.cgl_name}</div>
                        <div className='h-[40px]'>{attendanceRecord.pastoral_team}</div>
                        <div className='h-[40px]'>{attendanceRecord.satellite}</div>
                        <div className='h-[40px]'>{attendanceRecord.total_members_num}</div>
                    </div>
                )
            }
        </div>
    )
}

const AttendanceCard = ({ title, attendanceType, attendanceRecord, attendance_list }) => {
    return (
        <>
            <Divider orientation='center'>{title}</Divider>
            <div className="mx-auto">
                <div className="flex flex-wrap w-[325px]">
                    {attendanceRecord &&
                        attendance_list.map((item, index) => (
                            <div key={index}>
                                <FormItem
                                    label={item}
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

const AttendanceInfoEditModal = ({ visible, setVisible }) => {
    const attendance_list = ['OM', 'NB', 'NF', 'RNF', 'AC', 'ABS']
    const [valueRange, setValueRange] = useState([]);
    const [form] = Form.useForm();
    const attendanceRecord = useSelectedRowStore((state) => state.selectedRow);
    const setAttendanceRecord = useSelectedRowStore((state) => state.setSelectedRow);

    useEffect(() => {
        if (visible) {
            setValueRange(attendanceRecord.date)

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
        const cgTotal = fieldsValue['cg_om_num'] + fieldsValue['cg_abs_num'];
        const serviceTotal = fieldsValue['service_om_num'] + fieldsValue['service_abs_num'];

        return Math.max(cgTotal, serviceTotal);
    }

    const updateattendanceRecord = async () => {
        let fieldsValue = form.getFieldsValue();
        fieldsValue.total_members_num = calculateTotal(fieldsValue);

        await updateAttend(attendanceRecord.id,
            { ...fieldsValue, date: valueRange }).then((res) => {
                if (res) {
                    setAttendanceRecord({ ...attendanceRecord, ...fieldsValue, date: valueRange });
                    Message.success('Updated successfully!');
                } else {
                    Message.error('Failed to update. Please try again.');
                }
            })
    }

    return (
        <Drawer
            width={'100%'}
            visible={visible}
            onOk={() => {
                updateattendanceRecord().then(() => {
                    setVisible(false);
                });
            }}
            onCancel={() => {
                setVisible(false);
            }}
        >
            <CGInfo
                attendanceRecord={attendanceRecord}
                valueRange={valueRange}
                setValueRange={setValueRange}
            />
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
                    attendanceRecord={attendanceRecord}
                    attendance_list={attendance_list}
                />
                <AttendanceCard
                    title='Service'
                    attendanceType='service'
                    attendanceRecord={attendanceRecord}
                    attendance_list={attendance_list}
                />
            </Form>
        </Drawer >
    )
}

export default AttendanceInfoEditModal

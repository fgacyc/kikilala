import {DatePicker, Drawer, Input, InputNumber, Message, Select} from "@arco-design/web-react";
import React, {useEffect} from "react";
import {serviceTypeOptions} from "./headcountForm.jsx";
import {useHeadCountStore} from "../../store/headcountStore.js";
import {addHeadcount, updateHeadcount} from "../../api/headcount.js";
import PubSub from "pubsub-js";
const Option = Select.Option;
const TextArea = Input.TextArea;

export  default  function HeadCountDrawer({visible, setVisible}){
    const satellites = [
        'Kuchai YW',
        'Kuchai WK',
        'Kuchai GS',
        'Serdang',
        'Kepong',
        'USJ',
        'Setapak',
        'SG Long',
        'Seremban'
    ]
    const [
        satellite,serviceType, dateTime,
        headCount,kids_num,cm_num,parents_num,
        yw_num,gs_num,nf_num,comment,key,ac_num
    ] = useHeadCountStore(state => [
        state.satellite, state.serviceType, state.dateTime,
        state.headCount,state.kids_num,state.cm_num,state.parents_num,
        state.yw_num,state.gs_num,state.nf_num,state.comment,
        state.key,state.ac_num
    ])

    const [
        setSatellite,setServiceType, setDateTime,
        setHeadCount,setKids_num,setCm_num,setParents_num,
        setYw_num,setGs_num,setNf_num,setComment,getHeadCountData,setAc_num
    ] = useHeadCountStore(state => [
        state.setSatellite, state.setServiceType, state.setDateTime,
        state.setHeadCount,state.setKidsNum,state.setCMNum,state.setParentsNum,
        state.setYWNum,state.setGSNum,state.setNFNum,state.setComment,
        state.getHeadCountData,state.setACNum
    ]);

    useEffect(() => {
        setHeadCount(kids_num + cm_num + parents_num + yw_num + gs_num + nf_num)
    }, [kids_num, cm_num, parents_num,yw_num, gs_num, nf_num])

    function submit(){
        const data =  getHeadCountData("drawer");
        // console.log(data)
        // console.log(key)
        // return;

        if (!data) return;
        updateHeadcount(key,data).then(res => {
            if (res!== false) {
                Message.success("Update successfully!")
                PubSub.publish('REFRESH_HEADCOUNT_TABLE');
                setVisible(false);
            }
        })
    }

    return (
        <Drawer
            width={332}
            title={<span>HeadCount Edit</span>}
            visible={visible}
            onOk={() => {
                submit();
                // setVisible(false);
            }}
            onCancel={() => {
                setVisible(false);
            }}
        >
            <div className={"mb-4"}>
                <div>Service Location</div>
                <Select
                    placeholder='Please select'
                    style={{ width: "100%" }}
                    onChange={setSatellite}
                    value={satellite}
                >
                    {satellites.map((option, index) => (
                        <Option key={option}  value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={"mb-4"}>
                <div>Service Type</div>
                <Select
                    placeholder='Please select/enter service type...'
                    style={{ width: "100%" }}
                    onChange={setServiceType}
                    allowCreate={true}
                    value={serviceType}
                >
                    {serviceTypeOptions.map((option, index) => (
                        <Option key={option.text}  value={option.value}>
                            {option.text}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={"mb-4"}>
                <div>Service Datetime</div>
                <DatePicker
                    style={{width: '100%'}}
                    showTime={{
                        defaultValue: '00:00:00',
                    }}
                    format='YYYY-MM-DD HH:mm:ss'
                    value={dateTime}
                    //onChange={onChange}
                    onSelect={setDateTime}
                    //onOk={onOk}
                />
            </div>

            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>Total:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={headCount}
                    onChange={setHeadCount}
                    disabled={true}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>Kids:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={kids_num}
                    onChange={setKids_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>CW:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={cm_num}
                    onChange={setCm_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>Parents:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={parents_num}
                    onChange={setParents_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>YW:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={yw_num}
                    onChange={setYw_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>GS:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={gs_num}
                    onChange={setGs_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>AC:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={ac_num}
                    onChange={setAc_num}
                />
            </div>
            <div className={"flex flex-row justify-between items-center py-2"}>
                <span>NF:</span>
                <InputNumber
                    min={0}
                    className={"w-[calc(100%-40px)] ml-2"}
                    value={nf_num}
                    onChange={setNf_num}
                />
            </div>

            <div className={"flex flex-col py-2"}>
                <span>Comments:</span>
                <TextArea
                    placeholder='Please enter comments...'
                    style={{ marginTop:5, width: "100%" ,resize: "none" }}
                    // onChange={setComment}
                    value={comment}
                    onChange={setComment}
                />
            </div>
        </Drawer>
    )
}

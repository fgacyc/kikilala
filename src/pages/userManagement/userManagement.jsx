import {Button, Input, Popconfirm, Table} from '@arco-design/web-react';
import {useEffect, useState} from "react";
import {addAdmin, deleteHeadcount, readAllAdmins} from "../../api/admin.js";
import {convertTableData} from "../formPage/data.js";
import {IconDelete} from "@arco-design/web-react/icon";
import {closeCG} from "../../api/CGLs.js";
import PubSub from "pubsub-js";

export default function UserManagement() {
    const [tableData, setTableData] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        getAdmins();
    }, [])

    async function getAdmins(){
        const data  = await readAllAdmins();
        // console.log(data)
        setTableData(convertTableData(data));
    }

    function addUser(){
        if(name===""||email===""){
            return;
        }
        const data = {
            name: name,
            email: email
        }

        addAdmin(data).then((res) => {
            if(res !== false) getAdmins();
        });

        setName("");
        setEmail("");
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: "Operation",
            width: 110,
            fixed: "right",
            dataIndex: "op",
            render: (_, record) => (
                <div className={"text-right"}>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete this admin?'
                        onOk={() => {
                            // console.log(record);
                            // console.log(record.key);
                            deleteHeadcount(record.key).then((res) => {
                                if(res !== false) getAdmins();
                            });
                        }}
                    >
                        <Button icon={<IconDelete />}
                                type="secondary"
                        ></Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return(
        <div className={"h-full w-full sm:px-8 px-2 py-4"}>
            <div className={"bg-white rounded-lg pb-2 pt-2"}>
                <div className={"my-4 flex flex-row flex-wrap justify-between"}>
                   <div>
                       <Input className={"w-1/3 mr-2 mb-2 min-w-[300px]"}  allowClear
                              placeholder='Please Enter Name...'
                              onChange={setName}
                              value={name}
                       />
                       <Input  className={"w-1/3 mr-2 mb-2 min-w-[300px]"}  allowClear
                               placeholder='Please Enter Email...'
                               onChange={setEmail}
                                 value={email}
                       />
                   </div>
                    <Button type='primary'
                            className={"mr-4 w-[80px]"}
                            onClick={addUser}
                    >Add</Button>
                </div>
                <Table columns={columns} data={tableData} />
            </div>
        </div>
    )
}

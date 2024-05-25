import {Button, Input, Popconfirm, Table} from '@arco-design/web-react';
import {useEffect, useRef, useState} from "react";
import {addAdmin, deleteAdmin, readAllAdmins} from "../../api/admin.js";
import {convertTableData} from "../formPage/data.js";
import {IconDelete, IconEdit, IconSearch} from "@arco-design/web-react/icon";
import PubSub from "pubsub-js";
import AdminUserInfoModifyModal from "./adminUserInfoModifyModal.jsx";
import {useAdminUserStore} from "../../store/adminUserStore.js";

export default function UserManagement() {
    const [tableData, setTableData] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [remark, setRemark] = useState("");
    const [adminUserInfoModifyModalVisible, setAdminUserInfoModifyModalVisible] = useState(false);
    const setAdminUser = useAdminUserStore(state => state.setAdminUser);
    const inputRef = useRef(null);

    useEffect(() => {
        getAdmins();
        PubSub.subscribe('updateAdmins', () => {
            getAdmins();
        });
        return () => {PubSub.unsubscribe('updateAdmins');}
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
            email: email.trim(),
            remark: remark
        }

        addAdmin(data).then((res) => {
            if(res !== false) getAdmins();
        });

        setName("");
        setEmail("");
        setRemark("");
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
            sorter: (a, b) => a?.name.localeCompare(b?.name),
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                return (
                    <div className='arco-table-custom-filter'>
                        <Input.Search
                            allowClear={true}
                            ref={inputRef}
                            searchButton
                            placeholder='Please enter name'
                            value={filterKeys[0] || ''}
                            onChange={(value) => {
                                setFilterKeys(value ? [value] : []);
                            }}
                            onSearch={() => {
                                confirm();
                            }}
                        />
                    </div>
                );
            },
            onFilter: (value, row) => {
                return row.name.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },

        },
        {
            title: 'Email',



            width: 150,
            render: (_, record) => (
                <div className={"flex flex-row"}>
                    <span className={"mr-2"}>{record.email}</span>
                </div>
            ),
            sorter: (a, b) => a?.email.localeCompare(b?.email),
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                return (
                    <div className='arco-table-custom-filter'>
                        <Input.Search
                            allowClear={true}
                            ref={inputRef}
                            searchButton
                            placeholder='Please enter name'
                            value={filterKeys[0] || ''}
                            onChange={(value) => {
                                setFilterKeys(value ? [value] : []);
                            }}
                            onSearch={() => {
                                confirm();
                            }}
                        />
                    </div>
                );
            },
            onFilter: (value, row) => {
                return row.email.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            width: 300,
        },
        {
            title: "Operation",
            width: 110,
            fixed: "right",
            dataIndex: "op",
            render: (_, record) => (
                <div className={"text-right flex flex-row"}>
                    <Button icon={<IconEdit />}
                            className={`mr-2`}
                            onClick={() => {
                                // console.log(record)
                                setAdminUser(record);
                                setAdminUserInfoModifyModalVisible(true);
                            }}
                            type="secondary"
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete this admin?'
                        onOk={() => {
                            // console.log(record);
                            // console.log(record.key);
                            deleteAdmin(record.key).then((res) => {
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
            <div className={"bg-white rounded pb-2 pt-2"}>
                <div className={"my-0 flex flex-row flex-wrap justify-between"}>
                   <div className={"flex flex-row flex-wrap"}>

                       <Input className={"w-1/4 mr-2 mb-2 min-w-[300px]"}  allowClear
                              placeholder='Please Enter Name...'
                              onChange={setName}
                              value={name}
                       />
                       <Input  className={"w-1/4 mr-2 mb-2 min-w-[300px]"}  allowClear
                               placeholder='Please Enter Email...'
                               onChange={setEmail}
                                 value={email}
                       />
                       <Input  className={"w-1/4 mr-2 mb-2 min-w-[300px]"}  allowClear
                               placeholder='Please Enter Remark...'
                               onChange={setRemark}
                               value={remark}
                       />
                   </div>
                    <Button type='secondary'
                            className={"mr-4 w-[80px]"}
                            onClick={addUser}
                    >Add</Button>
                </div>
                <Table columns={columns} data={tableData}
                       scroll={{
                           x: window.innerWidth * 0.9,
                           y: window.innerHeight,
                       }}
                />
            </div>
            <AdminUserInfoModifyModal
                visible={adminUserInfoModifyModalVisible}
                setVisible={setAdminUserInfoModifyModalVisible} />
        </div>
    )
}

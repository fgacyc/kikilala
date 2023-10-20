import {Table, Input, Button, Popconfirm} from '@arco-design/web-react';
import {useEffect, useRef, useState} from "react";
import {deleteCGL, readAllCGLs} from "../../api/CGLs.js";
import {convertCGLTableData} from "../formPage/data.js";
import {IconDelete, IconDownload, IconEdit, IconPlus, IconSearch} from "@arco-design/web-react/icon";
import CGLsInfoEditModal from "./CGLsInfoEditModal.jsx";
import {useCGLStore} from "../../store/CGLStore.js";
import {pastoralTeamList, satelliteList} from "../../config.js";
import CGLsAddModal from "./CGLsAddModal.jsx";
import PubSub from "pubsub-js";

function  CGLTable({setVisible}){
    const inputRef = useRef(null);
    const columns = [
        {
            title: 'CG leader',
            dataIndex: 'CG_leader',
            sorter: (a, b) => a.CG_leader.localeCompare(b.CG_leader),
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
                return row.CG_leader.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'CG_name',
            dataIndex: 'CG_name',
            sorter: (a, b) => a.CG_name.localeCompare(b.CG_name),
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
                return row.CG_name.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'pastoral_team',
            dataIndex: 'pastoral_team',
            sorter: (a, b) => a.pastoral_team.localeCompare(b.pastoral_team),
            filters: pastoralTeamList,
            onFilter: (value, row) => {
                return row.pastoral_team.toLowerCase().includes(value.toLowerCase());
            },
            filterMultiple: false,
        },
        {
            title: 'satellite',
            dataIndex: 'satellite',
            sorter: (a, b) => a.satellite.localeCompare(b.satellite),
            filters: satelliteList,
            onFilter: (value, row) => {
                return row.satellite === value;
            },
            filterMultiple: false,
        },
        {
            title: "Operation",
            dataIndex: "op",
            render: (_, record) => (
                <div>
                    <Button icon={<IconEdit />}
                            className={"mr-2"}
                            onClick={() => {
                                setVisible(true);
                                setCGL(record);
                            }}
                            type="secondary"
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete?'
                        onOk={() => {
                            // console.log(record);
                            deleteCGL(record.key);
                            PubSub.publish('updateCGLs');
                        }}
                        onCancel={() => {
                            Message.error({
                                content: 'cancel',
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
    const [allCGLs,setAllCGLs] = useState([])
    const setCGL = useCGLStore(state => state.setCGL);

    async function updateCGLs(){
        const data = await readAllCGLs();
        setAllCGLs( convertCGLTableData(data));
    }


    useEffect(() => {
        updateCGLs();
        const subscription = PubSub.subscribe('updateCGLs', (msg, data) => {
            updateCGLs();
        });
        return () => PubSub.unsubscribe(subscription);
    }, []);

    return <Table columns={columns} data={allCGLs} />;
}


export  default  function  CGLsManagement(){
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    return(
        <div className={"h-full w-full p-8"}>
            <div className={"flex flex-row justify-between"}>
                <Button type='secondary' className={"mb-2"}
                        icon={<IconPlus />}
                        onClick={() => setAddVisible(true)}
                >Add New CGL</Button>
                <Button type='secondary'
                        icon={<IconDownload />}
                        className={"mb-2"}>Download</Button>
            </div>
            <div className={"bg-white rounded-lg pb-2"}>
                <CGLTable setVisible={setEditVisible} />
            </div>
            <CGLsInfoEditModal visible={editVisible} setVisible={setEditVisible}/>
            <CGLsAddModal  visible={addVisible} setVisible={setAddVisible}/>
        </div>
    )
}

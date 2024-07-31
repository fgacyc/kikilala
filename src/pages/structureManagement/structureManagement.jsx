import {Button, Input, Popconfirm, Table} from '@arco-design/web-react';
import {useEffect, useRef, useState} from "react";
import {IconDelete, IconPlus, IconSearch} from "@arco-design/web-react/icon";
import PubSub from "pubsub-js";
import StructureInfoModifyModal from "./structureInfoModifyModal.jsx";
import {readAllActiveCGLs} from "../../api/CGLs.js";
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {deletePastoralLeader, getPastoralLeader} from "../../api/pastoral_leader.js";

export default function StructureManagement() {

    const [structureInfoModifyModalVisible,setStructureInfoModifyModalVisible] = useState(false);
    const inputRef = useRef(null);
    const setCurrentCGLs = useAttendanceStore(state => state.setCurrentCGLs);
    const [pastoralLeader, setPastoralLeader] = useState([]);

    useEffect(() => {
        async function getCGLs(){
            const CGLs = await  readAllActiveCGLs();
            setCurrentCGLs(CGLs);
        }
        void getCGLs();
        void getLeaders();

        PubSub.subscribe('updateLeaders', () => {
            void getLeaders();
        });
        return () => {PubSub.unsubscribe('updateLeaders');}

    }, [])

    async function getLeaders(){
        getPastoralLeader().then((res) => {
            if(res.status){
                // console.log(res.data)
                setPastoralLeader(res.data);
            }
        });
    }



    const columns = [
        {
            title: 'Name',
            dataIndex: 'user_name',
            width: 150,
            sorter: (a, b) => a?.user_name.localeCompare(b?.user_name),
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
                return row.user_name.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },

        },
        {
            title: 'Nickname',
            dataIndex: 'nickname',
            width: 150,
            render: (_, record) => (
                <div className={"flex flex-row"}>
                    <span className={"mr-2"}>{record.nickname}</span>
                </div>
            ),
            sorter: (a, b) => a?.nickname.localeCompare(b?.nickname),
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
                return row.nickname.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'Role',
            dataIndex: 'user_role',
            width: 300,
        },
        {
            title: 'CGLs',
            width: 300,
            render: (_, record) => (
                <div>
                    {
                        record.cg_list.map((cg, index) => (
                            <div key={index} className={"mr-2"}>
                                <span className={"font-bold"}>{cg.CGL_name}</span>({cg.CG_name})
                            </div>
                        ))
                    }
                </div>
            )
        },
        {
            title: "Operation",
            width: 110,
            fixed: "right",
            dataIndex: "op",
            render: (_, record) => (
                <div className={"text-right flex flex-row"}>
                    {/*<Button icon={<IconEdit />}*/}
                    {/*        className={`mr-2`}*/}
                    {/*        onClick={() => {*/}
                    {/*            // console.log(record)*/}
                    {/*            setAdminUser(record);*/}
                    {/*            // setAdminUserInfoModifyModalVisible(true);*/}
                    {/*        }}*/}
                    {/*        type="secondary"*/}
                    {/*></Button>*/}
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete this leader?'
                        onOk={() => {
                            console.log(record);
                            deletePastoralLeader(record.user_name,
                                record.nickname,
                                "rol_" + record.key.split('_')[1]
                            ).then((res) => {
                                if(res !== false) getLeaders();
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
                    <Button type='secondary' className={"mb-2"}
                            icon={<IconPlus />}
                            onClick={() => setStructureInfoModifyModalVisible(true) }
                    >Add Pastor/Team Leader/Coach</Button>
                </div>
                <Table columns={columns} data={pastoralLeader}
                       scroll={{
                           x: window.innerWidth * 0.9,
                           y: window.innerHeight,
                       }}
                />
            </div>
            <StructureInfoModifyModal
                visible={structureInfoModifyModalVisible}
                setVisible={setStructureInfoModifyModalVisible} />
        </div>
    )
}

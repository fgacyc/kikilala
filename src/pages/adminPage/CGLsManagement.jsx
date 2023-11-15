import { Table, Input, Button, Popconfirm, Message, Space } from '@arco-design/web-react';
import { useEffect, useRef, useState } from "react";
import {
    CGStatusEnum,
    closeCG,
    deleteCGL,
    duplicateCheck,
    findDuplicateCGName,
    openCG, readAllActiveCGLs,
    readAllCGLs, readAllClosedCGLs
} from "../../api/CGLs.js";
import { convertTableData } from "../formPage/data.js";
import {
    IconArchive,
    IconClose,
    IconDownload,
    IconEdit,
    IconPlus,
    IconSearch, IconUndo
} from "@arco-design/web-react/icon";
import CGLsInfoEditModal from "./CGLsInfoEditModal.jsx";
import { useCGLStore } from "../../store/CGLStore.js";
import { pastoralTeamList, satelliteList } from "../../config.js";
import CGLsAddModal from "./CGLsAddModal.jsx";
import PubSub from "pubsub-js";
import { downloadCGLsData, downloadXLSX, getTodayDateStr } from "../../tools.js";
import CsvDownload from "react-csv-downloader";
import { addRecord } from "../../api/records.js";
import { useAuth0 } from "@auth0/auth0-react";

function CGLTable({tableData ,updateData,type,setCGEditModalVisible}) {
    const inputRef = useRef(null);
    const columns = [
        {
            title: 'CG leader',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.CG_leader
                        }
                    </div>
                )
            },
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
        // {
        //     title: 'CGID',
        //     dataIndex: 'CG_id',
        // },
        {
            title: 'Nickname',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.nickname
                        }
                    </div>
                )
            },
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
            title: 'Pastoral Team',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.pastoral_team
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.pastoral_team.localeCompare(b.pastoral_team),
            filters: pastoralTeamList,
            onFilter: (value, row) => {
                return row.pastoral_team.toLowerCase().includes(value.toLowerCase());
            },
            filterMultiple: false,
        },
        {
            title: 'Service Location',
            width: 180,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.satellite
                        }
                    </div>
                )
            },
            sorter: (a, b) => a.satellite.localeCompare(b.satellite),
            filters: satelliteList,
            onFilter: (value, row) => {
                return row.satellite === value;
            },
            filterMultiple: false,
        },
        {
            title: "Operation",
            width: 110,
            fixed: "right",
            dataIndex: "op",
            render: (_, record) => (
                <div>
                    <Button icon={<IconEdit />}
                        className={`mr-2 ${type==="closed" && "hidden"}`}
                        onClick={() => {
                            setCGL(record);
                            setCGEditModalVisible(true);
                        }}
                        type="secondary"
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to close this CG?'
                        onOk={() => {
                            // console.log(record);
                            closeCG(record.key).then((res) => {
                                if(res!==false)PubSub.publish('updateCGLs');
                            });
                        }}
                    >
                        <Button icon={<IconClose />}
                            type="secondary"
                            className={`${type==="closed" && "hidden"}`}
                        ></Button>
                    </Popconfirm>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to close this CG?'
                        onOk={() => {
                            // console.log(record);
                            openCG(record.key).then((res) => {
                                if(res!==false)PubSub.publish('updateCGLs');
                            });
                        }}
                    >
                        <Button icon={<IconUndo />}
                                type="secondary"
                                className={`${type==="active" && "hidden"}`}
                        ></Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];
    const setCGL = useCGLStore(state => state.setCGL);

    useEffect(() => {
        updateData();
        const subscription = PubSub.subscribe('updateCGLs', (msg, data) => {
            updateData();
        });
        return () => PubSub.unsubscribe(subscription);
    }, []);

    return <Table
        columns={columns}
        data={tableData}
        renderPagination={(paginationNode) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                }}
            >
                <span className={"ml-4"}>Items: {tableData.length}</span>
                {paginationNode}
            </div>
        )}
        scroll={{
            x: window.innerWidth * 0.9,
            y: window.innerHeight,
        }}
    />;
}


export default function CGLsManagement() {
    const [addVisible, setAddVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [closedCGLs, setClosedCGLs] = useState([]);
    const [allCGLs, setAllCGLs] = useState([]);
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const [isShowActive, setIsShowActive] = useState(true);
    const [CGEditModalVisible, setCGEditModalVisible] = useState(false);


    useEffect(() => {
        if (isLoading) return;
        if (user) {
            addRecord({
                page: "CGLsManagement",
                user_id: user.sub,
            });
            return;
        }
        loginWithRedirect();
    }, [isLoading])

    async function updateCGLs() {
        //const data = await readAllCGLs();

        // const openedList = data.filter((item) => item.CG_status === "open");
        ///const allCGLs = convertTableData(data);
        ///const activeCGLs = allCGLs.filter((item) => item.CG_status === CGStatusEnum.active);
        ///const closedCGLs = allCGLs.filter((item) => item.CG_status === CGStatusEnum.closed);

        // console.log("closedCGLs", closedCGLs)
        // setAllCGLs(activeCGLs);
        setTableData(await readAllActiveCGLs());
        setClosedCGLs(await readAllClosedCGLs());
        setAllCGLs(await readAllCGLs());
    }

    useEffect(() => {
        updateCGLs();
    }, [isShowActive]);


    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4"}>
            <div className={"flex flex-row justify-between"}>
                <Button type='secondary' className={"mb-2"}
                    icon={<IconPlus />}
                    onClick={() => setAddVisible(true)}
                >Add New CGL</Button>
               <div className={"flex flex-row"}>
                   <Button type='secondary' icon={<IconArchive />}
                           className={"mb-2 mr-2"}
                        onClick={() => setIsShowActive(!isShowActive)}
                   />
                   <CsvDownload filename={`CGLs_${getTodayDateStr()}`}
                                extension={".csv"}
                                text={"Download"}
                                datas={downloadCGLsData(allCGLs)} >
                       <Button type='secondary'
                               icon={<IconDownload  />}
                               className={"mb-2"}>
                       </Button>
                   </CsvDownload>
               </div>
                {/*<Button type='secondary' onClick={() =>{*/}
                {/*    duplicateCheck("The Blessing 2")*/}
                {/*}}>*/}
                {/*    Click*/}
                {/*</Button>*/}
            </div>
            <div className={"bg-white rounded-lg pb-2"}>
                {
                    isShowActive
                        ? <CGLTable
                            tableData={tableData}
                            updateData={updateCGLs}
                            type={"active"}
                            setCGEditModalVisible={setCGEditModalVisible}
                        />
                        : <CGLTable
                            tableData={closedCGLs}
                            updateData={updateCGLs}
                            type={"closed"}
                            setCGEditModalVisible={setCGEditModalVisible}
                        />
                }

            </div>
            <CGLsInfoEditModal visible={CGEditModalVisible} setVisible={setCGEditModalVisible} />
            <CGLsAddModal visible={addVisible} setVisible={setAddVisible} />
        </div>
    )
}

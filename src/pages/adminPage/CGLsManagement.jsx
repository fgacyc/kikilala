import {Table, Input, Button, Popconfirm, Card} from '@arco-design/web-react';
import { useEffect, useRef, useState } from "react";
import {
    closeCG,
    deleteCGL,
    openCG, readAllActiveCGLs,
    readAllCGLs, readAllClosedCGLs
} from "../../api/CGLs.js";
//import { convertTableData } from "../formPage/data.js";
import {
    IconArchive,
    IconClose, IconDelete,
    IconDownload,
    IconEdit,
    IconPlus,
    IconSearch, IconUndo
} from "@arco-design/web-react/icon";
import CGLsInfoEditModal from "./CGLsInfoEditModal.jsx";
import { useCGLStore } from "../../store/CGLStore.js";
import {CGCategoryList, pastoralTeamList, satelliteList} from "../../config.js";
import CGLsAddModal from "./CGLsAddModal.jsx";
import PubSub from "pubsub-js";
import {downloadCGLsData, getCoachOptions, getPastoralTeamCGNumber, getTodayDateStr} from "../../tools.js";
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
        //     title: 'CG_ID',
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
        // {
        //     title: 'Coach',
        //     width: 180,
        //     render: (_, record) => {
        //         return (
        //             <div className={"truncate"}>
        //                 {
        //                     record.hasOwnProperty("coach_name") && record.coach_name
        //                 }
        //             </div>
        //         )
        //     },
        //     sorter: (a, b) => {
        //         if (!a.coach_name) return 1;
        //         return a.coach_name.localeCompare(b.coach_name);
        //     },
        //     filterIcon: <IconSearch />,
        //     filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
        //         return (
        //             <div className='arco-table-custom-filter'>
        //                 <Input.Search
        //                     allowClear={true}
        //                     ref={inputRef}
        //                     searchButton
        //                     placeholder='Please enter name'
        //                     value={filterKeys[0] || ''}
        //                     onChange={(value) => {
        //                         setFilterKeys(value ? [value] : []);
        //                     }}
        //                     onSearch={() => {
        //                         confirm();
        //                     }}
        //                 />
        //             </div>
        //         );
        //     },
        //     onFilter: (value, row) => {
        //         return row.coach_name?.toLowerCase().includes(value.toLowerCase());
        //     },
        //     onFilterDropdownVisibleChange: (visible) => {
        //         if (visible) {
        //             setTimeout(() => inputRef.current.focus(), 150);
        //         }
        //     },
        // },
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
            title: 'Category',
            width: 180,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.hasOwnProperty("category") && record.category
                        }
                    </div>
                )
            },
            sorter: (a, b) => {
                if (a.category === undefined) return 1;
                return a.category.localeCompare(b.category);
            },
            filters: CGCategoryList,
            onFilter: (value, row) => {
                return row.category === value;
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
                        content='Are you sure you want to reopen this CG?'
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
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete this CG?'
                        onOk={() => {
                            // console.log(record);
                            deleteCGL(record.key).then((res) => {
                                if(res!==false)PubSub.publish('updateCGLs');
                            });
                        }}
                    >
                        <Button icon={<IconDelete />}
                                type="secondary"
                                className={`ml-2 ${type==="active" && "hidden"}`}
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
    const setCoachOptions = useCGLStore(state => state.setCoachOptions);
    const [pastoralTeamCGNumber, setPastoralTeamCGNumber] = useState(null);


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
        setTableData(await readAllActiveCGLs());
        setClosedCGLs(await readAllClosedCGLs());
        setAllCGLs(await readAllCGLs());
    }

    useEffect(() => {
        updateCGLs();
    }, [isShowActive]);

    // tableData is active CGLs
    useEffect(() => {
        let coaches = getCoachOptions(tableData);
        coaches.unshift("None");
        setCoachOptions(coaches);
        setPastoralTeamCGNumber(getPastoralTeamCGNumber(tableData))
    }, [tableData]);


    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4 "}>
            <div className={"flex flex-row justify-between bg-white py-2 rounded-t"}>
                <Button type='secondary' className={"mb-2"}
                        icon={<IconPlus/>}
                        onClick={() => setAddVisible(true)}
                >Add New CGL</Button>
                <div className={"flex flex-row"}>
                    <Button type='secondary' icon={<IconArchive/>}
                            className={"mb-2 mr-2"}
                            onClick={() => setIsShowActive(!isShowActive)}
                    />
                    <CsvDownload filename={`CGLs_${getTodayDateStr()}`}
                                 extension={".csv"}
                                 text={"Download"}
                                 datas={downloadCGLsData(allCGLs)}>
                        <Button type='secondary'
                                icon={<IconDownload/>}
                                className={"mb-2"}>
                        </Button>
                    </CsvDownload>
                </div>
            </div>
            <div className={"bg-white rounded-b pb-2"}>
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
            <div className={`mt-4 grid grid-cols-3 gap-8 bg-white py-4 rounded `}>
                <Card
                    title='Wonderkides CG'
                >
                    {pastoralTeamCGNumber && pastoralTeamCGNumber.wonderkids}
                </Card>
                <Card
                    title='Young Warrior CG'
                >
                    {pastoralTeamCGNumber && pastoralTeamCGNumber.youngWarrior}
                </Card>
                <Card
                    title='General CG'
                >
                    {pastoralTeamCGNumber && pastoralTeamCGNumber.general}
                </Card>
            </div>
            <CGLsInfoEditModal visible={CGEditModalVisible} setVisible={setCGEditModalVisible}/>
            <CGLsAddModal visible={addVisible} setVisible={setAddVisible}/>
        </div>
    )
}

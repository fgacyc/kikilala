import { Table, Input, Button, Popconfirm, Message, Space } from '@arco-design/web-react';
import { useEffect, useRef, useState } from "react";
import {CGStatusEnum, closeCG, deleteCGL, duplicateCheck, findDuplicateCGName, readAllCGLs} from "../../api/CGLs.js";
import { convertCGLTableData } from "../formPage/data.js";
import {
    IconClose,
    IconDownload,
    IconEdit,
    IconPlus,
    IconSearch
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

function CGLTable({ setTableData, setVisible }) {
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
        {
            title: 'CG Name',
            width: 200,
            render: (_, record) => {
                return (
                    <div className={"truncate"}>
                        {
                            record.CG_name
                        }
                    </div>
                )
            },
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
                        className={"mr-2"}
                        onClick={() => {
                            setCGL(record);
                            setVisible(true);
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
                        ></Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];
    const [allCGLs, setAllCGLs] = useState([])
    const setCGL = useCGLStore(state => state.setCGL);

    async function updateCGLs() {
        const data = await readAllCGLs();
        //console.log(convertCGLTableData(data))
        setTableData(convertCGLTableData(data));

        // const openedList = data.filter((item) => item.CG_status === "open");
        const allCGLs = convertCGLTableData(data);
        const activeCGLs = allCGLs.filter((item) => item.CG_status === CGStatusEnum.active);
        setAllCGLs(activeCGLs);
    }


    useEffect(() => {
        updateCGLs();
        const subscription = PubSub.subscribe('updateCGLs', (msg, data) => {
            updateCGLs();
        });
        return () => PubSub.unsubscribe(subscription);
    }, []);

    return <Table
        columns={columns}
        data={allCGLs}
        renderPagination={(paginationNode) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                }}
            >
                <Space>
                    <span className={"ml-4"}>Items: {allCGLs.length}</span>
                </Space>
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
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const { loginWithRedirect, user, isLoading } = useAuth0();

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


    return (
        <div className={"h-full w-full sm:px-8 px-2 py-4"}>
            <div className={"flex flex-row justify-between"}>
                <Button type='secondary' className={"mb-2"}
                    icon={<IconPlus />}
                    onClick={() => setAddVisible(true)}
                >Add New CGL</Button>
                <Button type='secondary'
                    icon={<IconDownload />}
                    className={"mb-2"}>
                    <CsvDownload filename={`CGLs_${getTodayDateStr()}`}
                        extension={".csv"}
                        text={"Download"}
                        datas={downloadCGLsData(tableData)} />
                </Button>
                {/*<Button type='secondary' onClick={() =>{*/}
                {/*    duplicateCheck("The Blessing 2")*/}
                {/*}}>*/}
                {/*    Click*/}
                {/*</Button>*/}
            </div>
            <div className={"bg-white rounded-lg pb-2"}>
                <CGLTable
                    setTableData={setTableData}
                    setVisible={setEditVisible} />
            </div>
            <CGLsInfoEditModal visible={editVisible} setVisible={setEditVisible} />
            <CGLsAddModal visible={addVisible} setVisible={setAddVisible} />
        </div>
    )
}

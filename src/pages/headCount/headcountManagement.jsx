import {useEffect, useRef, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {addRecord} from "../../api/records.js";
import {Button, Input, Popconfirm, Space, Table} from "@arco-design/web-react";
import CGLsInfoEditModal from "../adminPage/CGLsInfoEditModal.jsx";
import CGLsAddModal from "../adminPage/CGLsAddModal.jsx";
import {deleteHeadcount, readAllHeadcounts} from "../../api/headcount.js";
import {pastoralTeamList, satelliteList} from "../../config.js";
import {serviceTypeOptions} from "./headcountForm.jsx";
import {IconDelete, IconEdit, IconSearch} from "@arco-design/web-react/icon";
import {deleteCGL} from "../../api/CGLs.js";
import PubSub from "pubsub-js";

function HeadCountTable() {
    const [data, setData] = useState(null);
    const inputRef = useRef(null);
    useEffect(() => {
        setHeadcountData();
    }, []);

    async function setHeadcountData() {
        const res = await readAllHeadcounts();
        let headData = [];
        for (let key in res) {
            res[key].key = key;
            headData.push(res[key]);
        }
        // console.log(headData)
        setData(headData);
    }


    const columns = [
        {
            title: 'Service Location',
            dataIndex: 'satellite',
            sorter: (a, b) => a.satellite.localeCompare(b.satellite),
            filters: satelliteList,
            onFilter: (value, row) => {
                return row.satellite === value;
            },
            filterMultiple: false,
        },
        {
            title: 'Type',
            dataIndex: 'serviceType',
            sorter: (a, b) => a.serviceType.localeCompare(b.serviceType),
            filters: serviceTypeOptions,
            onFilter: (value, row) => {
                return row.serviceType.toLowerCase() === value.toLowerCase();
            },
            filterMultiple: false,
        },
        {
            title: 'Date time',
            dataIndex: 'dateTime',
            sorter: (a, b) => a.dateTime.localeCompare(b.dateTime),
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                return (
                    <div className='arco-table-custom-filter'>
                        <Input.Search
                            allowClear={true}
                            ref={inputRef}
                            searchButton
                            placeholder='Please enter datetime'
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
                return row.dateTime.toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => inputRef.current.focus(), 150);
                }
            },
        },
        {
            title: 'YW',
            dataIndex: 'yw_num',
            sorter: (a, b) => a.yw_num - b.yw_num,
        }
        ,
        {
            title: 'GS',
            dataIndex: 'gs_num',
            sorter: (a, b) => a.gs_num - b.gs_num,
        }
        ,
        {
            title: 'YP',
            dataIndex: 'yp_num',
            sorter: (a, b) => a.yp_num - b.yp_num,
        }
        ,
        {
            title: 'Kids',
            dataIndex: 'kids_num',
            sorter: (a, b) => a.kids_num - b.kids_num,
        }
        ,
        {
            title: 'Crew',
            dataIndex: 'cm_num',
            sorter: (a, b) => a.cm_num - b.cm_num,
        }, {
            title: "total",
            dataIndex: "headCount",
            sorter: (a, b) => a.headCount - b.headCount,
        },
        {
            title: "Operation",
            dataIndex: "op",
            render: (_, record) => (
                <div>
                    <Button icon={<IconEdit />}
                            className={"mr-2"}
                            onClick={() => {
                                // setCGL(record);
                                // setVisible(true);
                            }}
                            type="secondary"
                    ></Button>
                    <Popconfirm
                        focusLock
                        title='Confirm'
                        content='Are you sure you want to delete?'
                        onOk={() => {
                            //console.log(record);
                            deleteHeadcount(record.key);
                            setHeadcountData()
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

    return <>
        {
            data && <Table columns={columns}
                           data={data}
                           renderPagination={(paginationNode) => (
                               <div
                                   style={{
                                       display: 'flex',
                                       justifyContent: 'space-between',
                                       marginTop: 10,
                                   }}
                               >
                                   <Space>
                                       <span className={"ml-4"}>Items: {data.length}</span>
                                   </Space>
                                   {paginationNode}
                               </div>
                           )}
                           scroll={{
                               x: window.innerWidth * 0.9,
                               y: window.innerHeight,
                           }}
            />
        }
    </>


}


export default function HeadCountManagement() {
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const {loginWithRedirect, user, isLoading} = useAuth0();

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
        <div className={"h-full w-full p-8"}>
            <div className={"bg-white rounded-lg pb-2"}>
                <HeadCountTable/>
            </div>
            <CGLsInfoEditModal visible={editVisible} setVisible={setEditVisible}/>
            <CGLsAddModal visible={addVisible} setVisible={setAddVisible}/>
        </div>
    )
}

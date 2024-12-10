import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select, Spin, Layout, Popconfirm, message, Table, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import PageHeader from '../../../../components/PageHeader/index.jsx'
import React, { useEffect, useState } from "react";
import { urlAdditionalChargeIndex, urlDeleteSelectedAdditionalCharge } from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function AdditionalCharge() {
    const [columnData, setColumnData] = useState();
    const [showTable, setShowTable] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [hideButton, setHideButton] = useState(true)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await customAxios.get(`${urlAdditionalChargeIndex}`);
            if (response.status === 200 && response.data.data != null) {
                const newColumnData = response.data.data.AdditionalCharges.map(
                    (obj, index) => {
                        return { ...obj, key: index + 1 };
                    }
                );
                setColumnData(newColumnData);
            } else {
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const columns = [
        {
            title: "Sl. No.",
            dataIndex: "key",
            key: "key",
            width:40
        },
        {
            title: "Facility Name",
            dataIndex: "FacilityName",
            key: "FacilityName",
        },
        {
            title: "Short Name",
            dataIndex: "ShortName",
            key: "ShortName",
            render: (text) => {
                return text ? text : "All";
            },
        },
        {
            title: "Long Name",
            dataIndex: "LongName",
            key: "LongName",
        },
        {
            title: "From Date",
            dataIndex: "EffectiveFromDate",
            key: "EffectiveFromDate",
        },
        {
            title: "To Date",
            dataIndex: "EffectiveToDate",
            key: "EffectiveToDate",
        },
        {
            title: "Additional Charge Type",
            dataIndex: "AdditionalChargeType",
            key: "AdditionalChargeType",
        },
        {
            title: "Status",
            dataIndex: "IsActive",
            key: "IsActive",
            render: (text, record) => (record.IsActive ? "Active" : "Hidden"),
        },
        // {
        //     title: '',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     render: (_, record) => (
        //         <span style={{ display: 'flex' }}>
        //             <Tooltip title="Edit">
        //                 <EditOutlined style={{ fontSize: '0.8rem', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleAddEditAdditionalCharge(record.AdditionalChargeId)} />
        //             </Tooltip>
        //             <Tooltip title="Delete">
        //                 <Popconfirm
        //                     title="Are you sure you want to delete this record?"
        //                     onConfirm={() => handledelete(record.AdditionalChargeId)}
        //                 >
        //                     <Button
        //                         size="small"
        //                         danger
        //                         icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
        //                     ></Button>
        //                 </Popconfirm>
        //                 {/* <DeleteOutlined style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => handledelete(record.AdditionalChargeId)} /> */}
        //             </Tooltip>
        //         </span>
        //     ),
        // },
    ];

    const handleEdit = (record) => {
        debugger
        navigate("/CreateAdditionalCharge", { state: { AdditionalChargeId: record ? record.AdditionalChargeId : 0 } });
    };

    const handleDelete = async (record) => {
        debugger;
        const response = await customAxios.get(`${urlDeleteSelectedAdditionalCharge}?AdditionalChargeId=${record.AdditionalChargeId}`);
        if (response.status === 200) {
            message.success('Deleted')
            const newColumnData = response.data.data.map(
                (obj, index) => {
                    return { ...obj, key: index + 1 };
                }
            );
            setColumnData(newColumnData);
        }
    };

    return (
        <>
            <Layout>
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        minHeight: "max-content",
                        borderRadius: "10px",
                    }}
                >
                    <PageHeader title='Additional Charge Setup Manager' buttonIcon={<PlusCircleOutlined />} onButtonClick={() => handleEdit(0)} />
                    <CustomTable
                        loading={loading}
                        isFilter={true}
                        columns={columns}
                        dataSource={columnData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </Layout>
        </>
    );
}

export default AdditionalCharge;

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select, Spin, Layout } from "antd";
import Title from "antd/es/typography/Title";

import Input from "antd/es/input/Input";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlGetAllPriceTariffs } from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";



function PriceTariff() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [columnData, setColumnData] = useState();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await customAxios.get(`${urlGetAllPriceTariffs}`);
            const newColumnData = response.data.data.BillTariffModels.map((obj, index) => {
                return { ...obj, key: index + 1 };
            });
            setColumnData(newColumnData);
            console.log("data", newColumnData);
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
        },
        {
            title: "FacilityName",
            dataIndex: "FacilityName",
            key: "FacilityName",
        },
        {
            title: "ShortName",
            dataIndex: "ShortPriceDescription",
            key: "ShortPriceDescription",
        },
        {
            title: "LongName",
            dataIndex: "LongPriceDescription",
            key: "LongPriceDescription",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
        },
        {
            title: "EffectiveFromDate",
            dataIndex: "EffectiveFromDate",
            key: "EffectiveFromDate",
        },

    ];

    const handleCreatePriceTariff = () => {
      navigate("/CreatePriceTariff");
    };
 

    const handleEdit = (record) => {
        debugger;
        navigate("/CreatePriceTariff", { state: { PriceTariffId: record.PriceTariffId } });
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
                    <Row
                        style={{
                            padding: "0.5rem 2rem 0.5rem 2rem",
                            backgroundColor: "#40A2E3",
                            borderRadius: "10px 10px 0px 0px ",
                        }}
                    >
                        <Col span={16}>
                            <Title
                                level={4}
                                style={{
                                    color: "white",
                                    fontWeight: 500,
                                    margin: 0,
                                    paddingTop: 0,
                                }}
                            >
                                PriceTariff
                            </Title>
                        </Col>
                        <Col offset={5} span={3}>
                            <Button icon={<PlusCircleOutlined />} onClick={() => handleCreatePriceTariff(0)}>
                                AddPriceTariff
                            </Button>
                        </Col>
                    </Row>

                    <Spin spinning={loading}>
                        <CustomTable
                            columns={columns}
                            dataSource={columnData}
                            actionColumn={true}
                            isFilter={true}
                            onEdit={handleEdit}
                        />
                    </Spin>
                    
                </div>
            </Layout>
        </>
    );
}

export default PriceTariff;

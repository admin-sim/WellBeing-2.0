import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select, Spin, Layout, Table } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlGetAllAutoChargeAsync } from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";

function AutoCharge() {
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllAutoChargeAsync}`);
      if (response.status === 200 && response.data.data != null) {
        const newColumnData = response.data.data.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setColumnData(newColumnData);
        console.log("data", newColumnData);
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
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "FacilityName",
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      render: (text) => {
        return text ? text : "All";
      },
    },
    {
      title: "EncounterType",
      dataIndex: "EncounterTypeName",
      key: "EncounterTypeName",
    },
    {
      title: "PatientTypeName",
      dataIndex: "PatientTypeName",
      key: "PatientTypeName",
      render: (text) => {
        return text ? text : "All";
      },
    },
    {
      title: "Provider Name",
      dataIndex: "ProviderName",
      key: "ProviderName",
      render: (text) => {
        return text ? text : "All";
      },
    },
    {
      title: "ServiceName",
      dataIndex: "ServiceName",
      key: "ServiceName",
    },
    {
      title: "Is One Time",
      dataIndex: "IsOneTime",
      key: "IsOneTime",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text, record) => (record.Status == "True" ? "Active" : "Hidden"),
    },
    {
      title: "Encounter Provider",
      dataIndex: "ChargeEncounterProvider",
      key: "ChargeEncounterProvider",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Charge Provider",
      dataIndex: "ChargeProviderName",
      key: "ChargeProviderName",
    },
  ];

  const handleAddAutoCharge = () => {
    navigate("/CreateAutoCharge");
  };

  const handleEdit = (record) => {
    debugger;
    //  navigate("/CreatePriceTariff", { state: { PriceTariffId: record.PriceTariffId } });
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
                AutoCharge
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => handleAddAutoCharge()}
              >
                AddAutoCharge
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={columnData}
            //   actionColumn={true}
            //   isFilter={true}
            //   onEdit={handleEdit}
            />
          </Spin>
        </div>
      </Layout>
    </>
  );
}

export default AutoCharge;

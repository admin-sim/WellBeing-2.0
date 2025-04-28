import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  Table,
  Tooltip,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlChargeExceptionIndex,
  urlGetAllAutoChargeAsync,
  urlRemoveAutoCharge,
} from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageHeader from "../../../../components/PageHeader";

function ChargeException() {
  const [columnData, setColumnData] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(urlChargeExceptionIndex);
      if (response.status === 200 && response.data.data != null) {
        const newColumnData = response.data.data.ChargeExceptions.map(
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
  }

  const columns = [
    // {
    //   title: "Sl. No.",
    //   dataIndex: "key",
    //   key: "key",
    //   width: 40,
    // },
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "LongName",
      // render: (text) => {
      //   return text ? text : "All";
      // },
    },
    {
      title: "Effective From",
      dataIndex: "EffectiveFrom",
      key: "EffectiveFrom",
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "FacilityName",
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "ProviderNaPriorityme",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];

  const handleAddAutoCharge = () => {
    navigate("/CreateAutoCharge");
  };

  const handleEdit = (record) => {
    debugger;
    navigate("/CreateAutoCharge", {
      state: { AutoChargeId: record.AutoChargeId },
    });
  };
  const handledelete = async (record) => {
    debugger;
    try {
      const response = await customAxios.delete(urlRemoveAutoCharge, {
        params: {
          id: record.AutoChargeId,
        },
      });
      if (response.status === 200 && response.data.data === true) {
        message.success("Deleted Successfully..");
        fetchData();
      }
    } catch (error) {}
  };

  async function handleChargeException(id) {
    navigate("/CreateChargeException", { state: { ChargeId: id } });
  }

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
          {/* <Row
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
                Charge Exception
              </Button>
            </Col>
          </Row> */}
          <PageHeader
            title={"Charge Exception"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "1rem" }} />}
            buttonLabel={"Add Charge Exception"}
            onButtonClick={() => handleChargeException(0)}
          />
          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              onEdit={handleEdit}
              onDelete={handledelete}
            />
          </Spin>
        </div>
      </Layout>
    </>
  );
}

export default ChargeException;

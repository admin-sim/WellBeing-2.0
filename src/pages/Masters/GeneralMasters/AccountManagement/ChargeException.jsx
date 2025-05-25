import { PlusCircleOutlined } from "@ant-design/icons";
import { Layout, message } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import {
  urlChargeExceptionIndex,
  urlDeleteSelectedchargeexception,
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
    setLoading(true);
    try {
      await customAxios.get(urlChargeExceptionIndex, {}).then((response) => {
        const apiData = response.data.data.ChargeExceptions;
        setColumnData(apiData);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
      setLoading(false);
    }
  }

  const columns = [
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "LongName",
    },
    {
      title: "Effective From",
      dataIndex: "EffectiveFromDate",
      key: "EffectiveFromDate",
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
      render: (text) => {
        return text === "A" ? "Active" : "Hidden";
      },
    },
  ];

  const handleEdit = (record) => {
    navigate("/CreateChargeException", {
      state: { ExceptionHeaderId: record.ExceptionHeaderId },
    });
  };

  const handledelete = async (record) => {
    try {
      const response = await customAxios.delete(
        urlDeleteSelectedchargeexception,
        {
          params: {
            ExceptionHeaderId: record.ExceptionHeaderId,
          },
        }
      );
      if (response.status === 200 && response.data === "Success") {
        message.success("Deleted Successfully..");
        fetchData();
      }
    } catch (error) {
      message.error("Something went wrong..");
    }
  };

  async function handleChargeException(id) {
    navigate("/CreateChargeException", { state: { ExceptionHeaderId: id } });
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
          <PageHeader
            title={"Charge Exception"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "1rem" }} />}
            buttonLabel={"Add Charge Exception"}
            onButtonClick={() => handleChargeException(0)}
          />
          <CustomTable
            columns={columns}
            dataSource={columnData}
            onEdit={handleEdit}
            onDelete={handledelete}
            loading={loading}
          />
        </div>
      </Layout>
    </>
  );
}

export default ChargeException;

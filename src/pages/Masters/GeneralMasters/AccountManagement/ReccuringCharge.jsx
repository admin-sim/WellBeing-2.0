import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select, Spin, Layout, Table,Tooltip, message } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlDeleteAttribute, urlDeleteRecuringCharges, urlGetAllAccomodationChargeAtribute, urlGetAllAutoChargeAsync, urlGetAllRecuringcharges } from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import PageHeader from "../../../../components/PageHeader";

function ReccuringCharge() {
  const [columnData, setColumnData] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllRecuringcharges}`);
      if (response.status === 200 && response.data.data != null) {
        const newColumnData = response.data.data?.RecurringChargesList.map(
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
      title: "Facility Name",
      dataIndex: "Facility",

    },
    {
      title: "Ward Type",
      dataIndex: "WardType",
     
    },
    {
      title: "Patient Type",
      dataIndex: "PatientTypeName",

    },
    {
      title: "Service",
      dataIndex: "ServiceName",

    },
    {
      title: "Is Provider mandatory",
      dataIndex: "IsProviderMandatory",
      render: (value) => (value === true ? "Yes" : "No"),
    },
    {
      title: "Is rule applicable",
      dataIndex: "IsRuleApplicable",
      render: (value) => (value === true ? "Yes" : "No"),
    },
    {
      title: "Effective From",
      dataIndex: "SEffectiveFrom",
    },
    {
      title: "Effective To",
      dataIndex: "SEffectiveTo",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
    
    },
    {
      title: "Rate",
      dataIndex: "Rate",
    },
    {
      title: "Charge Frequency",
      dataIndex: "ChargeFrequency",
    },
    {
      title: "Value",
      dataIndex: "Value",
      width:40
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text, record) => (record.ActiveFlag == true ? "Active" : "Hidden"),
    }
    
  ];

  const handleAddAutoCharge = () => {
    navigate("/CreateReccuringCharge");
  };

   const handleEdit = (record) => {
    navigate("/CreateReccuringCharge", { state: { RecurringChargesId: record.RecurringChargesId } });
  }


  const handledelete = async(record) => {
    debugger;
    try {
      const response = await customAxios.delete(urlDeleteRecuringCharges, {
        params: {
          ID: record.RecurringChargesId,
        }
      });
      if (response.status === 200 && response.data.data === true) {
        message.success('Deleted Successfully..');
        fetchData();
    }
    } catch (error) { }
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
          <PageHeader
          title="Recurring Charges"
          buttonLabel={"Add"}
          buttonIcon={<PlusCircleOutlined  style={{fontSize:"20px"}}/>}
          onButtonClick={handleAddAutoCharge}
          >
          </PageHeader>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              onDelete={handledelete}
              onEdit={handleEdit}
            />
          </Spin>
        </div>
      </Layout>
    </>
  );
}

export default ReccuringCharge;

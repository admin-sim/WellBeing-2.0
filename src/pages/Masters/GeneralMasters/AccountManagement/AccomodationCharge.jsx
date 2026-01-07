import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select, Spin, Layout, Table,Tooltip, message } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlDeleteAttribute, urlGetAllAccomodationChargeAtribute, urlGetAllAutoChargeAsync } from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import PageHeader from "../../../../components/PageHeader";

function AccomodationCharge() {
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
      const response = await customAxios.get(`${urlGetAllAccomodationChargeAtribute}`);
      if (response.status === 200 && response.data.data != null) {
        const newColumnData = response.data.data?.AccommodationTypeAttributeList.map(
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
      title: "Accommodation Type",
      dataIndex: "AccommodationTypeName",
     
    },
    {
      title: "Level of Service",
      dataIndex: "LevelOfService",

    },
    {
      title: "Minimum Charge Hours",
      dataIndex: "MinimumChargeHour",

    },
    {
      title: "Discharge grace hour",
      dataIndex: "DischargeGraceHour",
    },
    {
      title: "Discharge bed block hour",
      dataIndex: "DischargeBedBlockHour",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text, record) => (record.ActiveFlag == true ? "Active" : "Hidden"),
    }
    
  ];

 
  const handleEdit = (record) => {
    navigate("/CreateAccomodationCharge", { state: { AccommodationAttributeId: record.AccommodationAttributeId } });
  }


  const handledelete = async(record) => {
    debugger;
    try {
      const response = await customAxios.delete(urlDeleteAttribute, {
        params: {
          ID: record.AccommodationAttributeId,
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
            title={"Accommodation Charge Attribute"}
            buttonLabel={"Add"}
            onButtonClick={()=> navigate("/CreateAccomodationCharge")}
            buttonIcon={<PlusCircleOutlined />}></PageHeader>


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

export default AccomodationCharge;

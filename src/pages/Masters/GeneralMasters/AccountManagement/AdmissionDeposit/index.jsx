import React from "react";
import { useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Spin, Layout, message } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../../components/PageHeader";
import CustomTable from "../../../../../components/customTable";
import customAxios from "../../../../../components/customAxios/customAxios";
import {
  urlGetAdmissionDeposit,
  urlDeleteDeposit,
} from "../../../../../../endpoints";

const AdmissionDeposit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [columnData, setColumnData] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAdmissionDeposit}`);
      if (
        response.data.data &&
        Array.isArray(response.data.data.AdmissionDepositList)
      ) {
        const newColumnData = response.data.data.AdmissionDepositList.map(
          (item, index) => ({
            key: index + 1,
            AdmissionDepositId: item.AdmissionDepositId,
            FacilityType: item.Facility,
            PatientType: item.PatientTypeName,
            AccommodationType: item.AccommodationTypeName,
            AdmissionDepositList: item.DepositAmount,
            ActiveFlag: item.ActiveFlag,
          })
        );
        setColumnData(newColumnData);
      } else {
        setColumnData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setColumnData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handledelete = async (record) => {
    debugger;
    try {
      const response = await customAxios.post(urlDeleteDeposit, null, {
        params: {
          ID: record.AdmissionDepositId,
        },
      });
      if (response.status === 200 && response.data.data === true) {
        message.success("Deleted Successfully..");
        fetchData();
      }
    } catch (error) {
      message.error("Delete failed!");
    }
  };

  const columns = [
    {
      title: "Facility Name",
      dataIndex: "FacilityType",
      key: "FacilityType",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Accomodation Type",
      dataIndex: "AccommodationType",
      key: "AccommodationType",
    },
    {
      title: "Admission Deposit",
      dataIndex: "AdmissionDepositList",
      key: "AdmissionDepositList",
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      key: "ActiveFlag",
      render: (value) => (value ? "Active" : "Hidden"),
    },
  ];

  return (
    <>
      <Layout style={{ zIndex: "999999999" }}>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <PageHeader
            title={"Admission Deposit"}
            buttonLabel={"Add"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
            onButtonClick={() => navigate("/CreateAdmissionDeposit")}
          />

          <Spin spinning={loading}>
            <CustomTable
              style={{ margin: "20px" }}
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onDelete={handledelete}
            />
          </Spin>
        </div>
      </Layout>
    </>
  );
};

export default AdmissionDeposit;

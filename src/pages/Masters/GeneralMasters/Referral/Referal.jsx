import { PlusCircleOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import CustomTable from "../../../../components/customTable/index";

function Referal() {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "SlNo",
      width: 80,
    },
    {
      title: "Referrer Name",
      dataIndex: "ReferrerName",
      width: 120,
    },
    {
      title: "Referrer Type",
      dataIndex: "ReferrerType",
      width: 120,
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      width: 120,
    },
    {
      title: "Qualification",
      dataIndex: "Qualification",
      width: 120,
    },
    {
      title: "Address",
      dataIndex: "Address",
      width: 120,
    },
    {
      title: "Area",
      dataIndex: "Area",
      width: 120,
    },
    {
      title: "Pin",
      dataIndex: "Pin",
      width: 120,
    },
    {
      title: "Landline Number",
      dataIndex: "LandlineNumber",
      width: 120,
    },
    {
      title: "Mobile Number",
      dataIndex: "MobileNumber",
      width: 120,
    },
    {
      title: "Contact Email",
      dataIndex: "Email",
      width: 120,
    },
  ];
  const data = [
    {
      key: "1",
      SlNo: "1",
      ReferrerName: "Prabhu",
      ReferrerType: "Hospital",
      Gender: "Male",
      Qualification: "MBBS",
      Address: "Bengaluru",
      Area: "Kengeri",
      Pin: "560074",
      LandlineNumber: "0801234567",
      MobileNumber: "9876543210",
      Email: "abc@abc.com",
    },
    {
      key: 2,
      SlNo: "2",
      ReferrerName: "Prabhu",
      ReferrerType: "Hospital",
      Gender: "Male",
      Qualification: "MBBS",
      Address: "Bengaluru",
      Area: "Kengeri",
      Pin: "560074",
      LandlineNumber: "0801234567",
      MobileNumber: "9876543210",
      Email: "abc@abc.com",
    },
    {
      key: 3,
      SlNo: "3",
      ReferrerName: "Prabhu",
      ReferrerType: "Hospital",
      Gender: "Male",
      Qualification: "MBBS",
      Address: "Bengaluru",
      Area: "Kengeri",
      Pin: "560074",
      LandlineNumber: "0801234567",
      MobileNumber: "9876543210",
      Email: "abc@abc.com",
    },
    {
      key: 4,
      SlNo: "4",
      ReferrerName: "Prabhu",
      ReferrerType: "Hospital",
      Gender: "Male",
      Qualification: "MBBS",
      Address: "Bengaluru",
      Area: "Kengeri",
      Pin: "560074",
      LandlineNumber: "0801234567",
      MobileNumber: "9876543210",
      Email: "abc@abc.com",
    },
  ];
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
            title={"Referral"}
            buttonLabel={"Add New Referral"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={() => navigate("/Referral/CreateEdit")}
          />

          <CustomTable
            size="small"
            columns={columns}
            dataSource={data}
            onEdit={() => alert("Edit Clicked")}
            onDelete={() => alert("Delete Clicked")}
            isFilter={true}
            scroll={{
              x: 900,
            }}
          />
        </div>
      </Layout>
    </>
  );
}

export default Referal;

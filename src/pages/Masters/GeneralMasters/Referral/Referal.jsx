import { PlusCircleOutlined } from "@ant-design/icons";
import { Layout, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import CustomTable from "../../../../components/customTable/index";
import customAxios from "../../../../components/customAxios/customAxios";
import { urlDeleteReferral, urlReferralIndex } from "../../../../../endpoints";

function Referal() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(urlReferralIndex);
      const result = response.data.data.Referrals.map((item, index) => {
        return {
          ...item,
          SlNo: index + 1,
          ReferrerName: item.ReferrerFirstName,// + " " + item.ReferrerLastName,
          ReferrerType:
            item.ReferrerType == "D"
              ? "Doctor"
              : item.ReferrerType == "O"
              ? "Other"
              : "Hospital",
        };
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      dataIndex: "Address1",
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
      dataIndex: "EmailId",
      width: 120,
    },
  ];

  function handleEdit(record) {
    const id = record.ReferrerId;
    navigate("/Referral/CreateEdit", { state: { id } });
  }

  async function handleDelete(record) {
    const id = record.ReferrerId;
    try {
      const response = await customAxios.delete(
        `${urlDeleteReferral}?ReferrerId=${id}`
      );
      if (response.status === 200) {
        if (response.data.data === "Success") {
          message.success("Deleted Successfully");
          fetchData();
        } else {
          message.error("Error deleting data:");
        }
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
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
            title={"Referral"}
            buttonLabel={"Add New Referral"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={() => navigate("/Referral/CreateEdit")}
          />

          <CustomTable
            size="small"
            columns={columns}
            dataSource={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

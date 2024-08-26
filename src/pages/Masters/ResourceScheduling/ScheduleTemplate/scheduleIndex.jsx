import React, { useEffect, useState } from "react";
import { Button, Col, Layout, Row, Spin, notification } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CustomTable from "../../../../components/customTable";

import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
import {
  urlDeleteScheduleTemplate,
  urlGetAllScheduleTemplates,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import PageHeader from "../../../../components/PageHeader";

function ScheduleIndex() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [columnData, setColumnData] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllScheduleTemplates}`);
      if (response.data != null) {
        const newColumnData = response.data.data.TemplateList.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setColumnData(newColumnData);
        // setDropdown(response.data.data);
        console.log("data", newColumnData);
      } else {
        setColumnData(null);
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
      width: 80,
    },
    {
      title: "Template",
      dataIndex: "TemplateName",
      key: "TemplateName",
    },
  ];

  const HandleEditScheduleTemplate = async (record) => {
    const url = `/ScheduleTemplate/ScheduleEdit`;

    // Navigate to the new URL
    navigate(url, {
      state: {
        selectedRow: record,
        // isEditPayerRegistration: true,
      },
    });
  };

  const handleDeleteTemplate = (record) => {
    try {
      customAxios
        .delete(`${urlDeleteScheduleTemplate}?TemplateId=${record.TemplateId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const tempData = response.data.data.TemplateList.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(tempData);

            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };

  const handleAddScheduleTemplate = () => {
    const url = `/ScheduleTemplate/ScheduleCreate`;
    // Navigate to the new URL
    navigate(url);
  };

  return (
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
          title={"Schedule Template"}
          buttonLabel={"Add New Template"}
          buttonIcon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
          onButtonClick={handleAddScheduleTemplate}
        />

        <Spin spinning={loading}>
          <CustomTable
            columns={columns}
            dataSource={columnData}
            actionColumn={true}
            isFilter={true}
            onEdit={HandleEditScheduleTemplate}
            onDelete={handleDeleteTemplate}
          />
        </Spin>
      </div>
    </Layout>
  );
}

export default ScheduleIndex;

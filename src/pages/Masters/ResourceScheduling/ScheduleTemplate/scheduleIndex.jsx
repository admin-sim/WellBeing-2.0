import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Spin,
  Select,
  Space,
  Popconfirm,
  Table,
  Modal,
  notification,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CustomTable from "../../../../components/customTable";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlDeleteScheduleTemplate,
  urlGetAllScheduleTemplates,
  urlGetScheduleTemplateDetailsBasedOnId,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";

function ScheduleIndex() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [columnData, setColumnData] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
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
      width: 200,
    },
    {
      title: "Template",
      dataIndex: "TemplateName",
      key: "TemplateName",
    },
  ];

  const HandleEditScheduleTemplate = async (record) => {
    debugger;
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
    debugger;
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

            notification.error({
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
              Schedule Template
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button
              style={{ padding: "4px 8px" }}
              icon={<PlusCircleOutlined />}
              onClick={handleAddScheduleTemplate}
            >
              Add New Template
            </Button>
          </Col>
        </Row>

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

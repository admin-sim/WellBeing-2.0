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
  urlGetAllProviderSchedules,
  urlRemoveProviderScheduleBasedOnProviderId,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";

function ProviderSchedule() {
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
      const response = await customAxios.get(`${urlGetAllProviderSchedules}`);
      if (response.data != null) {
        const newColumnData = response.data.data.ProviderSchedules.map(
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
      title: "Provider Name",
      dataIndex: "ProviderName",
      key: "ProviderName",
    },
    {
      title: "Schedule Type",
      dataIndex: "ScheduleType",
      key: "ScheduleType",
    },
  ];

  const HandleEditScheduleTemplate = async (record) => {
    debugger;
    const url = `/ProviderSchedule/ProviderScheduleEdit`;
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
    setLoading(true);
    try {
      customAxios
        .delete(
          `${urlRemoveProviderScheduleBasedOnProviderId}?ProviderId=${record.ProviderId}`
        )
        .then((response) => {
          if (response.data.data !== null) {
            const schedules = response.data.data.ProviderSchedules.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(schedules);
            setLoading(false);
            notification.success({
              message: "Deleted Successfully",
            });
          }
          if (response.data === "Failure") {
            setLoading(false);
            notification.error({
              message: "Something went wrong!",
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
    const url = `/ProviderSchedule/ProviderScheduleCreate`;
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
              Provider Schedule
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button
              style={{ padding: "4px 8px" }}
              icon={<PlusCircleOutlined />}
              onClick={handleAddScheduleTemplate}
            >
              Add New Schedule
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

export default ProviderSchedule;

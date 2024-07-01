import {
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Spin,
  Layout,
  notification,
  DatePicker,
} from "antd";

import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../../components/customAxios/customAxios";
import moment from "moment/moment";
// import dayjs from "dayjs";

import {
  urlGetAllCalenderPublished,
  urlAddNewProviderCalender,
  urlGetProviderCalenderDetails,
  urlDeleteSelectedProviderCalender,
} from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable/index";
import dayjs from "dayjs";

function PublishCalender() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calenderData, setCalenderData] = useState();
  const [disabledToFromDate, setDisabledToFromDate] = useState(null);
  const [FromDate, setFromDate] = useState();
  const [ToDate, setToDate] = useState();
  const [Dropdown, setDropdown] = useState({
    Providers: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  // const today = moment(); // Get today's date
  // const lastDate = moment().add(3, "months"); // Get the date three months from now

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllCalenderPublished}`);
      if (response.data != null) {
        const newColumnData =
          response.data.data.ScheduleAvailabilityCalenderModels.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
        setColumnData(newColumnData);
        setDropdown(response.data.data);
      }

      //   setDateFormat(response.data.DateFormat);
      // console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddAreaShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setDisabledToFromDate(null);
    form.resetFields();
  };

  const handleFromDateChange = (date, dateString) => {
    debugger;
    setFromDate(dateString);
  };

  const handleToDateChange = (date, dateString) => {
    setToDate(dateString);
  };

  const disabledFromDate = (current) => {
    const today = moment().startOf("day");
    const maxDate = moment().add(3, "months").endOf("day");
    return current && (current < today || current > maxDate);
  };

  const disabledToDate = (current) => {
    debugger;
    if (!disabledToFromDate) {
      const today = dayjs().startOf("day");
      const maxDate = dayjs().add(3, "months").endOf("day");
      return current && (current < today || current > maxDate);
    }
    const minDate = dayjs(disabledToFromDate).startOf("day");
    const maxDate = dayjs().add(3, "months").endOf("day");
    return current && (current < minDate || current > maxDate);
  };

  const validateFromDate = (_, value) => {
    const toDate = form.getFieldValue("ToDate");
    if (value && toDate && value.isAfter(toDate)) {
      return Promise.reject(new Error("From Date must be less than To Date"));
    }
    return Promise.resolve();
  };

  const validateToDate = (_, value) => {
    const fromDate = form.getFieldValue("FromDate");
    if (value && fromDate && value.isBefore(fromDate)) {
      return Promise.reject(
        new Error("To Date must be greater than From Date")
      );
    }
    return Promise.resolve();
  };

  const handleEditModal = (record) => {
    debugger;
    setCalenderData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetProviderCalenderDetails}?Id=${record.ProviderId}`)
      .then((response) => {
        if (response.data !== null) {
          const calenderData = response.data.data;
          setCalenderData(calenderData);
          setIsModalOpen(true);
          const parsedStartDate = dayjs(calenderData.StartDate, "DD-MM-YYYY");
          const parsedEndDate = dayjs(calenderData.EndDate, "DD-MM-YYYY");
          form.setFieldsValue({
            Provider: calenderData.ProviderId,
            FromDate: parsedStartDate,
            ToDate: parsedEndDate,
          });
          setFromDate(calenderData.StartDate);
          setDisabledToFromDate(parsedEndDate);
          setLoading(false);
        }
      });
  };

  const handleAreaModalCancel = () => {
    setIsModalOpen(false);
    setDisabledToFromDate(null);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setCalenderData(record);
    try {
      customAxios
        .delete(`${urlDeleteSelectedProviderCalender}?Id=${record.ProviderId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const newColumnData =
              response.data.data.ScheduleAvailabilityCalenderModels.map(
                (obj, index) => {
                  return { ...obj, key: index + 1 };
                }
              );
            setColumnData(newColumnData);
            setDropdown(response.data.data);
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

  const handleSubmit = async () => {
    debugger;
    form.validateFields();
    const values = form.getFieldsValue();
    console.log("state Edit Modal Submit", values);

    try {
      // Send a POST request to the server
      const response = await customAxios.post(
        `${urlAddNewProviderCalender}?ProviderId=${values.Provider}&StartDate=${FromDate}&EndDate=${ToDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data !== null) {
        if (response.data === "Create") {
          notification.warning({
            message: "Create schedule Template for the provider",
          });
        } else if (
          response.data.data.ScheduleAvailabilityCalenderModels !== null
        ) {
          const newColumnData =
            response.data.data.ScheduleAvailabilityCalenderModels.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
          setColumnData(newColumnData);
          setDisabledToFromDate(null);
          form.resetFields();
          if (isEditing) {
            notification.success({
              message: "Updated calender successfully",
            });
          } else {
            notification.success({
              message: "Published calender successfully",
            });
          }
        } else {
          notification.error({
            message: "Publishing calender was unsuccessful",
          });
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);
      notification.error({
        message: "Publishing calender was unsuccessful",
      });
    } finally {
      setIsModalOpen(false);
      setDisabledToFromDate(null);
      form.resetFields();
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Provider Name",
      dataIndex: "ProviderName",
      key: "ProviderName",
    },
    {
      title: "From Date",
      dataIndex: "StartDate",
      key: "StartDateTime",
    },
    {
      title: "To Date",
      dataIndex: "EndDate",
      key: "EndDateTime",
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
                Publish Calender
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddAreaShowModal}
              >
                New Calender
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          <Modal
            title="Publish New Calender"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={handleAreaModalCancel}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="Provider"
                label="Provider"
                rules={[
                  {
                    required: true,
                    message: "Please select provider",
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={isEditing}
                  allowClear
                  placeholder="Select a provider"
                >
                  {Dropdown.Providers.map((option) => (
                    <Select.Option
                      key={option.ProviderId}
                      value={option.ProviderId}
                    >
                      {option.ProviderName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="FromDate"
                label="From Date"
                rules={[
                  {
                    required: true,
                    message: "Please select From Date",
                  },
                  {
                    validator: validateFromDate,
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleFromDateChange}
                  style={{ width: "100%" }}
                  disabled={isEditing}
                  disabledDate={disabledFromDate}
                ></DatePicker>
              </Form.Item>
              <Form.Item
                name="ToDate"
                label="To Date"
                rules={[
                  {
                    required: true,
                    message: "Please enter From Date",
                  },
                  {
                    validator: validateToDate,
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleToDateChange}
                  style={{ width: "100%" }}
                  disabledDate={disabledToDate}
                ></DatePicker>
              </Form.Item>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={12} span={6}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button type="default" onClick={handleAreaModalCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default PublishCalender;

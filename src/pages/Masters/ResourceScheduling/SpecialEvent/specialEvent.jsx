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
} from "antd";

import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import {
  urlGetAllSpecialEvents,
  urlAddSpecialEvent,
  urlGetSpecialEventsDetails,
  urlUpdateSpecialEvent,
  urlDeleteSpecialEvents,
} from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";

function SpecialEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calenderData, setCalenderData] = useState();
  const [DateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [FromDate, setFromDate] = useState();
  const [ToDate, setToDate] = useState();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllSpecialEvents}`);
      const newColumnData = response.data.data.SpecialEventModel.map(
        (obj, index) => {
          return { ...obj, key: index + 1 };
        }
      );
      setColumnData(newColumnData);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddAreaShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleFromDateChange = (date, dateString) => {
    debugger;
    const formattedFromDate = dayjs(date).format("DD-MM-YYYY hh:mm:ss A");
    setFromDate(formattedFromDate);
  };

  const handleToDateChange = (date, dateString) => {
    debugger;
    const formattedToDate = dayjs(date).format("DD-MM-YYYY hh:mm:ss A");
    setToDate(formattedToDate);
  };

  //   const disabledDate = (current) => {
  //     // Disable dates that are in the future
  //     return current && current > new Date();
  //   };

  const handleEditModal = (record) => {
    debugger;
    setCalenderData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSpecialEventsDetails}?Id=${record.SpecialEventsId}`)
      .then((response) => {
        if (response.data !== null) {
          const calenderData = response.data.data.NewSpecialEventModel;
          setCalenderData(calenderData);
          setIsModalOpen(true);
          const parsedStartDate = dayjs(calenderData.StartDate);
          const parsedEndDate = dayjs(calenderData.EndDate);
          handleFromDateChange(calenderData.StartDate);
          handleToDateChange(calenderData.EndDate);
          form.setFieldsValue({
            EventName: calenderData.EventName,
            FromDate: parsedStartDate,
            ToDate: parsedEndDate,
          });

          setLoading(false);
        }
      });
  };

  const handleAreaModalCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setCalenderData(record);
    try {
      customAxios
        .delete(`${urlDeleteSpecialEvents}?Id=${record.SpecialEventsId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const newColumnData = response.data.data.SpecialEventModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(newColumnData);

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
      if (isEditing) {
        const response = await customAxios.post(
          `${urlUpdateSpecialEvent}?SpecialEventsId=${calenderData.SpecialEventsId}&EditEventName=${values.EventName}&EditStartDate=${FromDate}&EditEndDate=${ToDate}&EditAbsenceReason=${values.Reason}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data !== null) {
          if (response.data.data.SpecialEventModel !== null) {
            setIsModalOpen(false);
            setIsEditing(false);
            const newColumnData = response.data.data.SpecialEventModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(newColumnData);
            form.resetFields();
            setFromDate(null);
            setToDate(null);

            notification.success({
              message: "Provider leave Noted",
            });
          }
        } else {
          if (response.data === "Failure") {
            notification.warning({
              message: "Provider leave already Not Noted",
            });
          }
          notification.error({
            message: "Something went wrong ,Try Again!",
          });
        }
      } else {
        // Send a POST request to the server
        const response = await customAxios.post(
          `${urlAddSpecialEvent}?EventName=${values.EventName}&StartDate=${FromDate}&EndDate=${ToDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data !== null) {
          if (response.data.data.SpecialEventModel !== null) {
            setIsModalOpen(false);
            const newColumnData = response.data.data.SpecialEventModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(newColumnData);
            form.resetFields();
            setFromDate(null);
            setToDate(null);
            notification.success({
              message: "Provider leave Noted",
            });
          } else {
            if (response.data === "Failure") {
              notification.warning({
                message: "Provider leave already Not Noted",
              });
            }
            notification.error({
              message: "Something went wrong ,Try Again!",
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);
      notification.warning({
        message: "Create schedule Template for the provider",
      });
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Event Name",
      dataIndex: "EventName",
      key: "EventName",
    },

    {
      title: "From Date",
      dataIndex: "StartDate",
      key: "StartDate",
    },
    {
      title: "To Date",
      dataIndex: "EndDate",
      key: "EndDate",
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
                Special Events
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddAreaShowModal}
              >
                Add New Leave
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
                name="EventName"
                label="EventName"
                rules={[
                  {
                    required: true,
                    message: "Please enter Event Name",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="FromDate"
                label="From Date"
                rules={[
                  {
                    required: true,
                    message: "Please select the start Date",
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleFromDateChange}
                  style={{ width: "100%" }}
                ></DatePicker>
              </Form.Item>
              <Form.Item
                name="ToDate"
                label="To Date"
                rules={[
                  {
                    required: true,
                    message: "Please select the end Date",
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleToDateChange}
                  style={{ width: "100%" }}
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

export default SpecialEvent;

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
  urlGetAllHolidays,
  urlAddNewHoliday,
  urlGetHolidayDetails,
  urlUpdateHoliday,
  urlDeleteHoliday,
} from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable/index";

function Holiday() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState();
  const [DateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [FromDate, setFromDate] = useState();
  const [ToDate, setToDate] = useState();
  const [Dropdown, setDropdown] = useState({
    Provider: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllHolidays}`);
      const newColumnData = response.data.data.HolidayModel.map(
        (obj, index) => {
          return { ...obj, key: index + 1 };
        }
      );
      setColumnData(newColumnData);
      setDropdown(response.data.data);
      //   setDateFormat(response.data.DateFormat);
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
    const formattedFromDate = dayjs(date).format("DD-MM-YYYY");
    setFromDate(formattedFromDate);
  };

  const handleToDateChange = (date, dateString) => {
    debugger;
    const formattedToDate = dayjs(date).format("DD-MM-YYYY");
    setToDate(formattedToDate);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const validateFromDate = (_, value) => {
    const toDate = form.getFieldValue("ToDate");
    if (value && toDate && value.isAfter(toDate)) {
      return Promise.reject(
        new Error("From Date must be less than or equal to To Date")
      );
    }
    return Promise.resolve();
  };

  const validateToDate = (_, value) => {
    const fromDate = form.getFieldValue("FromDate");
    if (value && fromDate && value.isBefore(fromDate)) {
      return Promise.reject(
        new Error("To Date must be greater than or equal to From Date")
      );
    }
    return Promise.resolve();
  };

  const handleEditModal = (record) => {
    debugger;
    setCalendarData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetHolidayDetails}?Id=${record.HolidayId}`)
      .then((response) => {
        if (response.data !== null) {
          const calendarData = response.data.data.NewHolidayModel;
          setCalendarData(calendarData);
          setIsModalOpen(true);
          const parsedStartDate = dayjs(calendarData.StartDate);
          const parsedEndDate = dayjs(calendarData.EndDate);
          handleFromDateChange(calendarData.StartDate);
          handleToDateChange(calendarData.EndDate);
          form.setFieldsValue({
            HolidayName: calendarData.HolidayName,
            // FromDateToDate: [parsedStartDate, parsedEndDate],
            FromDate: parsedStartDate,
            ToDate: parsedEndDate,
          });
          setLoading(false);
        }
      });
  };

  const handleAreaModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setCalendarData(record);
    try {
      customAxios
        .delete(`${urlDeleteHoliday}?Id=${record.HolidayId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const newColumnData = response.data.data.HolidayModel.map(
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
      if (isEditing) {
        const response = await customAxios.post(
          `${urlUpdateHoliday}?HolidayId=${calendarData.HolidayId}&EditHolidayName=${values.HolidayName}&EditStartDate=${FromDate}&EditEndDate=${ToDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data !== null) {
          if (response.data.data.HolidayModel !== null) {
            setIsModalOpen(false);
            setIsEditing(false);
            const newColumnData = response.data.data.HolidayModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(newColumnData);
            form.resetFields();
            setFromDate(null);
            setToDate(null);

            notification.success({
              message: "Holiday details updated successfully",
            });
          }
        } else {
          if (response.data === "Failure") {
            notification.warning({
              message: "Holiday already exists",
            });
          }
          notification.error({
            message: "Something went wrong ,Try Again!",
          });
        }
      } else {
        // Send a POST request to the server
        const response = await customAxios.post(
          `${urlAddNewHoliday}?HolidayName=${values.HolidayName}&StartDate=${FromDate}&EndDate=${ToDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data !== null) {
          if (response.data.data.HolidayModel !== null) {
            setIsModalOpen(false);
            const newColumnData = response.data.data.HolidayModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(newColumnData);
            form.resetFields();
            setFromDate(null);
            setToDate(null);
            notification.success({
              message: "Holiday added successfully",
            });
          } else {
            if (response.data === "Failure") {
              notification.warning({
                message: "Holiday already exists",
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
        message: "Something went wrong ,Try Again!",
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
      title: "Holiday Name",
      dataIndex: "HolidayName",
      key: "HolidayName",
    },

    {
      title: "From Date",
      dataIndex: "startDateTime",
      key: "startDateTime",
    },
    {
      title: "To Date",
      dataIndex: "endDateTime",
      key: "endDateTime",
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
                Holidays
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddAreaShowModal}
              >
                Add New Holiday
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
            title="Add New Holiday"
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
                name="HolidayName"
                label="Holiday Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Reason for leave",
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
                  {
                    validator: validateFromDate,
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleFromDateChange}
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
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
                  {
                    validator: validateToDate,
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  onChange={handleToDateChange}
                  disabledDate={disabledDate}
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

export default Holiday;

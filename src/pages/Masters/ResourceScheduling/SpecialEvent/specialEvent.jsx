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
const { RangePicker } = DatePicker;

function SpecialEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState();
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

  const disabledDate = (current) => {
    if (isEditing && calendarData) {
      const startDate = dayjs(calendarData.StartDate);
      return current && current < startDate.startOf("day");
    } else {
      return current && current < dayjs().startOf("day");
    }
  };

  const disabledRangeTime = (_, type) => {
    if (isEditing && calendarData) {
      const startDate = dayjs(calendarData.StartDate);
      return {
        disabledHours: () => {
          const hours = [];
          const currentHour = dayjs().hour();
          if (dayjs(startDate).isSame(_, "day")) {
            for (let i = 0; i < currentHour; i++) {
              hours.push(i);
            }
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          const currentMinute = dayjs().minute();
          if (
            dayjs(startDate).isSame(_, "day") &&
            selectedHour === dayjs().hour()
          ) {
            for (let i = 0; i <= currentMinute; i++) {
              minutes.push(i);
            }
          }
          return minutes;
        },
      };
    } else {
      return {
        disabledHours: () => {
          const hours = [];
          const currentHour = dayjs().hour();
          if (dayjs().isSame(_, "day")) {
            for (let i = 0; i < currentHour; i++) {
              hours.push(i);
            }
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          const currentMinute = dayjs().minute();
          if (dayjs().isSame(_, "day") && selectedHour === dayjs().hour()) {
            for (let i = 0; i <= currentMinute; i++) {
              minutes.push(i);
            }
          }
          return minutes;
        },
      };
    }
  };

  const handleEditModal = (record) => {
    debugger;
    setCalendarData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSpecialEventsDetails}?Id=${record.SpecialEventsId}`)
      .then((response) => {
        if (response.data !== null) {
          const calendarData = response.data.data.NewSpecialEventModel;
          setCalendarData(calendarData);
          setIsModalOpen(true);
          const parsedStartDate = dayjs(calendarData.StartDate);
          const parsedEndDate = dayjs(calendarData.EndDate);
          handleFromDateChange(calendarData.StartDate);
          handleToDateChange(calendarData.EndDate);
          form.setFieldsValue({
            EventName: calendarData.EventName,
            FromDateToDate: [parsedStartDate, parsedEndDate],
            // FromDate: parsedStartDate,
            // ToDate: parsedEndDate,
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
    setCalendarData(record);
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
    const formattedFromDate = values.FromDateToDate[0].format(
      "DD-MM-YYYY hh:mm:ss A"
    );
    const formattedToDate = values.FromDateToDate[1].format(
      "DD-MM-YYYY hh:mm:ss A"
    );

    try {
      if (isEditing) {
        const response = await customAxios.post(
          `${urlUpdateSpecialEvent}?SpecialEventsId=${calendarData.SpecialEventsId}&EditEventName=${values.EventName}&EditStartDate=${formattedFromDate}&EditEndDate=${formattedToDate}&EditAbsenceReason=${values.Reason}`,
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
              message: "Special event updated successfully",
            });
          }
        } else {
          if (response.data === "Failure") {
            notification.warning({
              message: "Special event already exists in records",
            });
          }
          notification.error({
            message: "Something went wrong ,Try Again!",
          });
        }
      } else {
        // Send a POST request to the server
        const response = await customAxios.post(
          `${urlAddSpecialEvent}?EventName=${values.EventName}&StartDate=${formattedFromDate}&EndDate=${formattedToDate}`,
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
              message: "Special event added successfully",
            });
          } else {
            if (response.data === "Failure") {
              notification.warning({
                message: "Special event already exists in record",
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
      notification.error({
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
      title: "Event Name",
      dataIndex: "EventName",
      key: "EventName",
    },

    {
      title: "From Date",
      dataIndex: "StartDateTime",
      key: "StartDateTime",
    },
    {
      title: "To Date",
      dataIndex: "EndDateTime",
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
              initialValues={{ FromDateToDate: [dayjs(), dayjs()] }}
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
                name="FromDateToDate"
                label="From Date - To Date"
                rules={[
                  {
                    required: true,
                    message: "Please select the start Date and End Date",
                  },
                ]}
              >
                <RangePicker
                  format={"DD-MM-YYYY hh:mm:ss A"}
                  // onChange={handleRangeChange}
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                  disabledTime={disabledRangeTime}
                  showTime
                  // defaultValue={[dayjs(), dayjs()]}
                ></RangePicker>
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

import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  message,
  notification,
  Radio,
  Space,
  Popconfirm,
  Checkbox,
  Card,
  Table,
  Modal,
} from "antd";
import Title from "antd/es/typography/Title";
import { useForm } from "antd/es/form/Form";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlGetScheduleTypesBasedOnTypeId,
  // urlGetAllProviders,
  urlGetAllQueueProviders,
  urlUpdateProviderWeeklySchedule,
  urlGetEditDayProviderSchedule,
  urlUpdateProviderScheduleOfType,
  urlAddNewProviderScheduleOfTypeDay,
  urlDeleteProviderScheduleBasedOnTypeID,
  urlAddNewProviderScheduleOfTypeWeekDay,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import WeeklyView from "./WeeklyView";

function ProviderScheduleEdit() {
  debugger;
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [weeklyView, setWeeklyView] = useState(false);
  const [dailyView, setDailyView] = useState(false);
  const [weekDayView, setWeekDayView] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [templateSessions, setTemplateSessions] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);

  const [isDailyTemplateModalOpen, setIsDailyTemplateModalOpen] =
    useState(false);
  const [isWeekDayTemplateModalOpen, setIsWeekDayTemplateModalOpen] =
    useState(false);
  const [days, setDays] = useState([]);
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [weekDays, setWeekDays] = useState([]);
  const [templateWeeklyDetails, setTemplateWeeklyDetails] = useState([]);
  const [templateDayDetails, setTemplateDayDetails] = useState([]);
  const [templatesWeekDayDetails, setTemplateWeekDayDetails] = useState([]);
  const [WeekProviderSchedule, setWeekProviderSchedule] = useState([]);
  const [templateDayData, setTemplateDayData] = useState([]);
  const [templateWeekDayData, setTemplateWeekDayData] = useState([]);
  const [isEditingDayModal, setIsEditingDayModal] = useState(false);
  const [isEditingWeekDayModal, setIsEditingWeekDayModal] = useState(false);
  const [ScheduleTypeId, setScheduleTypeId] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    debugger;
    const providerId = location.state.selectedRow.ProviderId;
    const scheduleType = location.state.selectedRow.ScheduleType;
    let typeId = 0;
    console.log("see the values of ", providerId, scheduleType);
    setSelectedScheduleType(scheduleType);
    if (scheduleType === "Week") {
      setWeeklyView(false);
      typeId = 1;
      setScheduleTypeId(typeId);
    } else if (scheduleType === "Days") {
      setDailyView(true);
      typeId = 2;
      setScheduleTypeId(typeId);
    } else {
      setWeekDayView(true);
      typeId = 3;
      setScheduleTypeId(typeId);
    }
    getProviders();
    fetchData(providerId, typeId);
  }, []);

  const getProviders = async () => {
    debugger;

    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllQueueProviders}`);
      if (response.data != null) {
        setProvidersData(response.data.data.Providers);
      } else {
        setProvidersData(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchData = async (providerId, TypeId) => {
    debugger;
    if (providerId !== undefined && TypeId !== undefined) {
      setLoading(true);
      try {
        const response = await customAxios.get(
          `${urlGetScheduleTypesBasedOnTypeId}?ProviderId=${providerId}&typeId=${TypeId}`
        );

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.ProviderSchedules)
        ) {
          if (TypeId === 1) {
            const providerSchedule = response.data.data.ProviderSchedules; // Your providerSchedule data

            let extractedData = providerSchedule.map((schedule) => {
              return {
                ProviderId: schedule.ProviderId,
                ScheduleType: schedule.ScheduleType,
                TemplateId: schedule.TemplateId,
                WeekdayId: schedule.WeekdayId,
                FacilityId: schedule.FacilityId,
              };
            });

            setWeeklyView(true);
            setTemplateWeeklyDetails(providerSchedule);
            setTemplateSessions(response.data.data.Templates);
            setWeeks(response.data.data.Weeks);
            setWeekProviderSchedule(extractedData);
            form.setFieldsValue({ Provider: providerSchedule[0].ProviderId });
          } else if (TypeId === 2) {
            const dayOptions = response.data.data.Days.map((day) => ({
              label: `Day ${day}`,
              value: day,
            }));
            const templateData = response.data.data.ProviderSchedules.map(
              (record, index) => {
                return { ...record, key: index + 1 };
              }
            );
            setDays(dayOptions);
            setTemplateDayDetails(templateData);
            setTemplateSessions(response.data.data.Templates);
            setDailyView(true);
            setWeeklyView(false);
            setWeekDayView(false);
            setSelectedScheduleType("Days");
            form.setFieldsValue({ Provider: templateData[0].ProviderId });
          } else {
            const templateData = response.data.data.ProviderSchedules.map(
              (record, index) => {
                return { ...record, key: index + 1 };
              }
            );
            setTemplateWeekDayDetails(templateData);
            setTemplateSessions(response.data.data.Templates);
            setWeeks(response.data.data.Weeks);
            setWeekDays(response.data.data.WeekDays);
            setWeekDayView(true);
            setDailyView(false);
            setWeeklyView(false);
            setSelectedScheduleType("WeekDays");
            form.setFieldsValue({ Provider: templateData[0].ProviderId });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    // setTemplateWeeklyDetails(false);
  };

  const handleBack = () => {
    form.resetFields();
    const url = `/ProviderSchedule`;
    // Navigate to the new URL
    navigate(url);
  };

  const onEditTemplate = (record) => {
    console.log("edit day template", record);
    setLoading(true);
    if (ScheduleTypeId == 2) {
      setIsEditingDayModal(true);
    } else {
      setIsEditingWeekDayModal(true);
    }

    customAxios
      .get(
        `${urlGetEditDayProviderSchedule}?providerScheduleId=${record.ProviderScheduleId}`
      )
      .then((response) => {
        if (response.data !== null) {
          if (ScheduleTypeId === 2) {
            const scheduleData = response.data.data.ProviderSchedule;
            setTemplateDayData(scheduleData);
            setIsDailyTemplateModalOpen(true);
            form.setFieldsValue({
              Day: scheduleData.DayNo,
              TemplateSession: scheduleData.TemplateId,
            });
            setLoading(false);
          } else {
            const scheduleData = response.data.data.ProviderSchedule;
            setTemplateWeekDayData(scheduleData);
            setIsWeekDayTemplateModalOpen(true);
            form.setFieldsValue({
              FrequencyDay: scheduleData.WeekDayFrequency,
              Day: scheduleData.WeekDay,
              TemplateSession: scheduleData.TemplateId,
            });
            setLoading(false);
          }
        }
      });
  };

  const onDeleteTemplate = (record) => {
    debugger;
    console.log("edit day template", record);
    setTemplateDayData(record);
    try {
      customAxios
        .delete(
          `${urlDeleteProviderScheduleBasedOnTypeID}?ProviderScheduleId=${record.ProviderScheduleId}&TypeId=${ScheduleTypeId}&ProviderId=${record.ProviderId}`
        )
        .then((response) => {
          if (response.data.data !== null) {
            if (ScheduleTypeId === 2) {
              const dayOptions = response.data.data.Days.map((day) => ({
                label: `Day ${day}`,
                value: day,
              }));
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              setDays(dayOptions);
              setTemplateDayDetails(templateData);
              setTemplateSessions(response.data.data.Templates);
            } else {
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              setTemplateWeekDayDetails(templateData);
              setTemplateSessions(response.data.data.Templates);
              setWeeks(response.data.data.Weeks);
              setWeekDays(response.data.data.WeekDays);
            }

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

  const handleAddTemplate = () => {
    if (selectedScheduleType === "Days") {
      setIsDailyTemplateModalOpen(true);
      setIsEditingDayModal(false);
    } else {
      setIsWeekDayTemplateModalOpen(true);
      setIsEditingDayModal(false);
    }
  };

  const handleCloseDayTemplateModal = () => {
    setIsDailyTemplateModalOpen(false);
  };
  const handleCloseWeekDayTemplateModal = () => {
    setIsWeekDayTemplateModalOpen(false);
  };

  const handleSubmit = async () => {
    debugger;
    const values = await form.validateFields();
    console.log("Form Values:", values, selectedSessions);
    setLoading(true);
    try {
      if (weeklyView) {
        const providerSchedules = WeekProviderSchedule.map((schedule) => {
          // Find the updated value for this schedule
          const updatedSession = selectedSessions.find(
            (value) => value.WeekdayId === schedule.WeekdayId
          );

          // If an updated value was found and it has a different TemplateId, update the schedule
          if (
            updatedSession &&
            updatedSession.TemplateId !== schedule.TemplateId
          ) {
            return { ...schedule, TemplateId: updatedSession.TemplateId };
          }

          // Otherwise, return the schedule unchanged
          return schedule;
        });

        const ProviderId = values.Provider; // Assuming values.Provider is your ProviderId

        const response = await customAxios.post(
          `${urlUpdateProviderWeeklySchedule}?ProviderId=${ProviderId}`,
          providerSchedules
        );

        if (response.data !== null) {
          if (response.data === "Success") {
            // Display success notification
            notification.success({
              message: "Schedule Template details updated Successfully",
            });
            // handleBack();
            form.resetFields();
          } else if (response.data === "Failure") {
            notification.error({
              message: "Something went wrong",
            });
            // handleBack();
            form.resetFields();
          }
        }
      }
      if (dailyView) {
        if (isEditingDayModal) {
          const response = await customAxios.post(
            `${urlUpdateProviderScheduleOfType}?ProviderScheduleId=${templateDayData.ProviderScheduleId}&TemplateId=${values.TemplateSession}&TypeId=${ScheduleTypeId}&ProviderId=${values.Provider}`
          );
          if (response.data !== null) {
            if (response.data.data !== undefined) {
              form.resetFields();
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
                // Schedule: templateData[0].ScheduleType === "Days" ? 2 : 3,
              });
              setTemplateDayDetails(templateData);
              setIsDailyTemplateModalOpen(false);
              setIsEditingWeekDayModal(false);
              notification.success({
                message: "Schedule Template details updated Successfully",
              });

              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
            }
          }
        } else {
          const response = await customAxios.post(
            `${urlAddNewProviderScheduleOfTypeDay}?DayId=${
              values.Day
            }&FacilityId=${1}&TemplateId=${values.TemplateSession}&ProviderId=${
              values.Provider
            }&ScheduleType=${selectedScheduleType}&TypeId=${ScheduleTypeId}`
          );

          if (response.data !== null) {
            if (response.data.data !== undefined) {
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
              });
              setTemplateDayDetails(templateData);
              setIsDailyTemplateModalOpen(false);
              notification.success({
                message: "Schedule Template details added Successfully",
              });

              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
            }
          }
        }
      }
      if (weekDayView) {
        if (isEditingWeekDayModal) {
          const response = await customAxios.post(
            `${urlUpdateProviderScheduleOfType}?ProviderScheduleId=${templateWeekDayData.ProviderScheduleId}&TemplateId=${values.TemplateSession}&TypeId=${ScheduleTypeId}&ProviderId=${values.Provider}`
          );
          if (response.data !== null) {
            if (response.data.data !== undefined) {
              form.resetFields();
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
                // Schedule: templateData[0].ScheduleType === "Days" ? 2 : 3,
              });
              setTemplateWeekDayDetails(templateData);
              setIsWeekDayTemplateModalOpen(false);
              setIsEditingWeekDayModal(false);
              notification.success({
                message: "Schedule Template details updated Successfully",
              });

              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
            }
          }
        } else {
          const response = await customAxios.post(
            `${urlAddNewProviderScheduleOfTypeWeekDay}?WeekDayFrequency=${
              values.FrequencyDay
            }&WeeksId=${values.Day}&FacilityId=${1}&TemplateId=${
              values.TemplateSession
            }&ProviderId=${
              values.Provider
            }&ScheduleType=${selectedScheduleType}&TypeId=${ScheduleTypeId}`
          );

          if (response.data !== null) {
            if (response.data.data !== undefined) {
              setShowRadioButtons(true);
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              setTemplateWeekDayDetails(templateData);
              setIsWeekDayTemplateModalOpen(false);
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
              });
              // Display success notification
              notification.success({
                message: "Schedule Template details added Successfully",
              });
              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
            }
          }
        }
      }

      setLoading(false);
    } catch (errorInfo) {
      console.log("Error:", errorInfo);
    }
  };

  const handleSelectChange = (dayId, sessionId) => {
    setSelectedSessions((prev) => {
      const existingEntry = prev.find((entry) => entry.WeekdayId === dayId);
      if (existingEntry) {
        // Update the session of the existing entry
        existingEntry.TemplateId = sessionId;
        return [...prev];
      } else {
        // Add a new entry
        return [...prev, { WeekdayId: dayId, TemplateId: sessionId }];
      }
    });
  };

  const DailyTemplateColumns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 120,
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      key: "TemplateName",
    },
    {
      title: "DayNo",
      dataIndex: "DayNo",
      key: "DayNo",
      width: 400,
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "4rem",
      render: (text, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => onEditTemplate(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>

          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDeleteTemplate(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const WeekDayTemplateColumns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 120,
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      key: "TemplateName",
    },
    {
      title: "Day",
      dataIndex: "WeekDayName",
      key: "WeekDayName",
      width: 400,
    },
    {
      title: "Every",
      dataIndex: "WeekDayFrequencyName",
      key: "WeekDayFrequencyName",
      width: 400,
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "4rem",
      render: (text, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => onEditTemplate(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>

          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDeleteTemplate(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </Space>
      ),
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
                Create Provider Schedule
              </Title>
            </Col>
          </Row>
          <Form
            layout="vertical"
            form={form}
            //  onFinish={handleSessionsForms}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "20px 15px" }}
              // style={{ height: "1.8rem", paddingBottom: "2rem" }}
            >
              <Col span={6}>
                <Form.Item
                  name="Provider"
                  label="Provider"
                  rules={[{ required: true, message: "Enter Template Name" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select the provider"
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    disabled
                    allowClear
                  >
                    {providersData.map((response) => (
                      <Select.Option
                        key={response.ProviderId}
                        value={response.ProviderId}
                      >
                        {response.ProviderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 15px" }}
              // style={{ height: "1.8rem", paddingBottom: "2rem" }}
            >
              {showRadioButtons && (
                <Col span={24}>
                  <Form.Item name="Schedule">
                    <Radio.Group onChange={handleRadioChange} checked>
                      <Space direction="horizontal">
                        <Radio value={1}>Weekly</Radio>

                        <Radio value={2}>Daily</Radio>

                        <Radio value={3}>Weekdays</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
            </Row> */}

            {weeklyView && (
              <>
                <Row>
                  <Col
                    span={12}
                    style={{ margin: "0px 10px", padding: "4px 20px" }}
                  >
                    <WeeklyView
                      days={weeks}
                      providerSchedule={templateWeeklyDetails || []}
                      sessionsData={templateSessions}
                      handleSelectChange={handleSelectChange}
                    />
                  </Col>
                </Row>
                <Row
                  gutter={32}
                  style={{
                    height: "1.8rem",
                    paddingBottom: "2rem",
                    margin: "20px 0px",
                  }}
                >
                  <Col offset={20} span={2}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ paddingLeft: "0px" }}>
                    <Form.Item>
                      <Button type="default" onClick={handleBack} >
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {dailyView && (
              <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                <Col span={24}>
                  <Table
                    pagination={false}
                    title={() => (
                      <>
                        <Row
                          style={{
                            backgroundColor: "#40A2E3",
                            padding: "0.3rem 0rem 0.3rem 1.5rem",
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          <Col
                            span={5}
                            style={{
                              fontWeight: 500,
                              letterSpacing: "0.5px",
                              fontSize: "1.2rem",
                            }}
                          >
                            Day Schedule
                          </Col>
                          <Col
                            offset={15}
                            span={4}
                            style={{
                              fontWeight: 500,
                              letterSpacing: "0.5px",
                              fontSize: "1.2rem",
                              // marginLeft:"0px"
                            }}
                          >
                            <Button onClick={handleAddTemplate}>
                              <PlusCircleOutlined />
                              Add Template
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                    columns={DailyTemplateColumns}
                    bordered
                    dataSource={templateDayDetails}
                    // rowKey={(row) => row.ProviderIdentityId}
                    size="small"
                    className="vitals-table"
                    style={{
                      margin: "0 0 1.5rem 0",
                      boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
                    }}
                    locale={{
                      emptyText: "There is no Provider credentials  to show",
                    }}
                  />
                </Col>
              </Row>
            )}
            {weekDayView && (
              <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                <Col span={24}>
                  <Table
                    pagination={false}
                    title={() => (
                      <>
                        <Row
                          style={{
                            backgroundColor: "#40A2E3",
                            padding: "0.3rem 0rem 0.3rem 1.5rem",
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          <Col
                            span={5}
                            style={{
                              fontWeight: 500,
                              letterSpacing: "0.5px",
                              fontSize: "1.2rem",
                            }}
                          >
                            Week Day Schedule
                          </Col>
                          <Col
                            offset={15}
                            span={4}
                            style={{
                              fontWeight: 500,
                              letterSpacing: "0.5px",
                              fontSize: "1.2rem",
                              // marginLeft:"0px"
                            }}
                          >
                            <Button onClick={handleAddTemplate}>
                              <PlusCircleOutlined />
                              Add Template
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                    columns={WeekDayTemplateColumns}
                    bordered
                    dataSource={templatesWeekDayDetails}
                    // rowKey={(row) => row.ProviderIdentityId}
                    size="small"
                    className="vitals-table"
                    style={{
                      margin: "0 0 1.5rem 0",
                      boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
                    }}
                    locale={{
                      emptyText: "There is no Provider credentials  to show",
                    }}
                  />
                </Col>
              </Row>
            )}
            {weeklyView && dailyView && (
              <Row
                gutter={32}
                style={{
                  height: "1.8rem",
                  paddingBottom: "2rem",
                  margin: "20px 0px",
                }}
              >
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </Layout>
      <Modal
        title="Add Template"
        open={isDailyTemplateModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleCloseDayTemplateModal}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="Day"
            label="Day"
            rules={[
              {
                required: true,
                message: "Please select Day",
              },
            ]}
          >
            <Select
              allowClear
              placeholder="Select a type"
              options={days}
            ></Select>
          </Form.Item>

          <Form.Item
            name="TemplateSession"
            label="Template Session"
            rules={[
              {
                required: true,
                message: "Please select State",
              },
            ]}
          >
            <Select allowClear placeholder="Select a type">
              {templateSessions.map((option) => (
                <Select.Option
                  key={option.TemplateId}
                  value={option.TemplateId}
                >
                  {option.TemplateName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={12} span={6}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditingDayModal ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button type="default" onClick={handleCloseDayTemplateModal}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Add Template"
        open={isWeekDayTemplateModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleCloseWeekDayTemplateModal}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="FrequencyDay"
            label="Frequency Day"
            rules={[
              {
                required: true,
                message: "Please select Day",
              },
            ]}
          >
            <Select allowClear placeholder="Select a type">
              {weekDays.map((option) => (
                <Select.Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Day"
            label="Day"
            rules={[
              {
                required: true,
                message: "Please select Day",
              },
            ]}
          >
            <Select allowClear placeholder="Select a type">
              {weeks.map((option) => (
                <Select.Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="TemplateSession"
            label="Template Session"
            rules={[
              {
                required: true,
                message: "Please select State",
              },
            ]}
          >
            <Select allowClear placeholder="Select a type">
              {templateSessions.map((option) => (
                <Select.Option
                  key={option.TemplateId}
                  value={option.TemplateId}
                >
                  {option.TemplateName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={12} span={6}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditingWeekDayModal ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button
                  type="default"
                  onClick={handleCloseWeekDayTemplateModal}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default ProviderScheduleEdit;

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
  Spin,
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
  const [dailyForm] = Form.useForm();
  const [weekDayForm] = Form.useForm();
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
            setLoading(false);
            setWeeklyView(true);
            setTemplateWeeklyDetails(providerSchedule);
            setTemplateSessions(response.data.data.Templates);
            setWeeks(response.data.data.Weeks);
            setWeekProviderSchedule(extractedData);
            form.setFieldsValue({ Provider: providerId });
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
            setLoading(false);
            setDays(dayOptions);
            setTemplateDayDetails(templateData);
            setTemplateSessions(response.data.data.Templates);
            setDailyView(true);
            setWeeklyView(false);
            setWeekDayView(false);
            setSelectedScheduleType("Days");
            form.setFieldsValue({ Provider: providerId });
          } else {
            const templateData = response.data.data.ProviderSchedules.map(
              (record, index) => {
                return { ...record, key: index + 1 };
              }
            );
            setLoading(false);
            setTemplateWeekDayDetails(templateData);
            setTemplateSessions(response.data.data.Templates);
            setWeeks(response.data.data.Weeks);
            setWeekDays(response.data.data.WeekDays);
            setWeekDayView(true);
            setDailyView(false);
            setWeeklyView(false);
            setSelectedScheduleType("WeekDays");
            form.setFieldsValue({ Provider: providerId });
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
            dailyForm.setFieldsValue({
              Day: scheduleData.DayNo,
              TemplateSession: scheduleData.TemplateId,
            });
            setLoading(false);
          } else {
            const scheduleData = response.data.data.ProviderSchedule;
            setTemplateWeekDayData(scheduleData);
            setIsWeekDayTemplateModalOpen(true);
            weekDayForm.setFieldsValue({
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
    // setTemplateDayData(record);
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
      setIsEditingWeekDayModal(false);
    }
  };

  const handleCloseDayTemplateModal = () => {
    setIsDailyTemplateModalOpen(false);
    dailyForm.resetFields();
  };
  const handleCloseWeekDayTemplateModal = () => {
    setIsWeekDayTemplateModalOpen(false);
    weekDayForm.resetFields();
  };

  const handleSubmit = async () => {
    debugger;
    const values = await form.validateFields();

    console.log("Form Values:", values, selectedSessions);
    setLoading(true);
    try {
      if (weeklyView) {
        // Step 1: Update provider schedules with selected sessions
        let providerSchedules = WeekProviderSchedule.map((schedule) => {
          // Find the updated session for the current schedule
          const updatedSession = selectedSessions.find(
            (session) => session.WeekdayId === schedule.WeekdayId
          );

          // If an updated session is found and its TemplateId is different, update the schedule
          if (
            updatedSession &&
            updatedSession.TemplateId !== schedule.TemplateId
          ) {
            return { ...schedule, TemplateId: updatedSession.TemplateId };
          }

          // Otherwise, return the schedule unchanged
          return schedule;
        });

        // Step 2: Add any selected sessions that don't match an existing WeekdayId in providerSchedules
        selectedSessions.forEach((session) => {
          const existingSchedule = providerSchedules.find(
            (schedule) => schedule.WeekdayId === session.WeekdayId
          );

          // If no existing schedule is found for the session's WeekdayId, add a new schedule
          if (!existingSchedule) {
            providerSchedules.push({
              WeekdayId: session.WeekdayId,
              TemplateId:
                session.TemplateId !== undefined ? session.TemplateId : 0,
              FacilityId: 1,
              ProviderId: values.Provider,
              ScheduleType: selectedScheduleType,
            });
          }
        });

        const existingWeekdayIds = new Set(
          providerSchedules.map((session) => session.WeekdayId)
        );

        weeks.forEach((week) => {
          if (!existingWeekdayIds.has(week.LookupID)) {
            providerSchedules.push({
              WeekdayId: week.LookupID,
              TemplateId: 0, // or any default value you want to set
              ProviderId: values.Provider,
              ScheduleType: selectedScheduleType,
              FacilityId: 1,
            });
            existingWeekdayIds.add(week.WeekdayId); // add the WeekdayId to the set
          }
        });

        // Ensure no undefined TemplateId
        providerSchedules = providerSchedules.map((schedule) => ({
          ...schedule,
          TemplateId:
            schedule.TemplateId !== undefined ? schedule.TemplateId : 0,
        }));

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
            handleBack();
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
        const dailyFormValues = await dailyForm.getFieldsValue();
        if (isEditingDayModal && dailyFormValues) {
          const response = await customAxios.post(
            `${urlUpdateProviderScheduleOfType}?ProviderScheduleId=${templateDayData.ProviderScheduleId}&TemplateId=${dailyFormValues.TemplateSession}&TypeId=${ScheduleTypeId}&ProviderId=${values.Provider}`
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
              dailyForm.resetFields();

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
              dailyFormValues.Day
            }&FacilityId=${1}&TemplateId=${
              dailyFormValues.TemplateSession
            }&ProviderId=${
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
              dailyForm.resetFields();

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
        const weekDayFormValues = weekDayForm.getFieldsValue();
        if (isEditingWeekDayModal && weekDayFormValues) {
          const response = await customAxios.post(
            `${urlUpdateProviderScheduleOfType}?ProviderScheduleId=${templateWeekDayData.ProviderScheduleId}&TemplateId=${weekDayFormValues.TemplateSession}&TypeId=${ScheduleTypeId}&ProviderId=${values.Provider}`
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
              weekDayForm.resetFields();

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
              weekDayFormValues.FrequencyDay
            }&WeeksId=${weekDayFormValues.Day}&FacilityId=${1}&TemplateId=${
              weekDayFormValues.TemplateSession
            }&ProviderId=${
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
              setTemplateWeekDayDetails(templateData);
              setIsWeekDayTemplateModalOpen(false);
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
              });
              weekDayForm.resetFields();
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
                    loading={Loading}
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
                        Update
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ paddingLeft: "0px" }}>
                    <Form.Item>
                      <Button type="default" onClick={handleBack}>
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {dailyView && (
              <>
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
                        emptyText:
                          "There is no Daily template sessions to show",
                      }}
                    />
                  </Col>
                </Row>
              </>
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
                      emptyText:
                        "There is no week day template sessions to show",
                    }}
                  />
                </Col>
              </Row>
            )}
            {(weekDayView || dailyView) && (
              <Row justify="end">
                <Col span={2} style={{ paddingLeft: "0px" }}>
                  <Form.Item>
                    <Button type="primary" onClick={handleBack}>
                      Cancel
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
          form={dailyForm}
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
              disabled={isEditingDayModal}
            ></Select>
          </Form.Item>

          <Form.Item
            name="TemplateSession"
            label="Template Session"
            rules={[
              {
                required: true,
                message: "Please select session",
              },
            ]}
          >
            <Select allowClear placeholder="Select a session">
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
          form={weekDayForm}
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
            <Select
              allowClear
              placeholder="Select a type"
              disabled={isEditingWeekDayModal}
            >
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
            <Select
              allowClear
              placeholder="Select a type"
              disabled={isEditingWeekDayModal}
            >
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

import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Form,
  Button,
  Select,
  notification,
  Space,
  Popconfirm,
  Table,
  Modal,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlGetScheduleTypesBasedOnTypeId,
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
import CustomTable from "../../../../components/customTable";
import PageHeader from "../../../../components/PageHeader";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../../components/customGridColumns";

function ProviderScheduleEdit() {
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
    const providerId = location.state.selectedRow.ProviderId;
    const scheduleType = location.state.selectedRow.ScheduleType;
    let typeId = 0;

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
      width: 80,
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      key: "TemplateName",
      width: 200,
    },
    {
      title: "DayNo",
      dataIndex: "DayNo",
      key: "DayNo",
      width: 80,
    },
  ];

  const WeekDayTemplateColumns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      key: "TemplateName",
      width: 180,
    },
    {
      title: "Day",
      dataIndex: "WeekDayName",
      key: "WeekDayName",
      width: 180,
    },
    {
      title: "Every",
      dataIndex: "WeekDayFrequencyName",
      key: "WeekDayFrequencyName",
      width: 180,
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
          <PageHeader
            style={{ padding: "0px" }}
            title={"Edit Provider Schedule"}
            button={false}
          />
          <Form
            layout="vertical"
            form={form}
            style={{ margin: "1rem" }}
            //  onFinish={handleSessionsForms}
          >
            <Row gutter={16}>
              <ColWithEightSpan>
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
              </ColWithEightSpan>
            </Row>

            {weeklyView && (
              <>
                <Row style={{ margin: "0 1rem 1rem 0" }}>
                  <ColWithTwelveSpan>
                    <WeeklyView
                      days={weeks}
                      providerSchedule={templateWeeklyDetails || []}
                      sessionsData={templateSessions}
                      handleSelectChange={handleSelectChange}
                    />
                  </ColWithTwelveSpan>
                </Row>
                <Row gutter={16} justify={"end"}>
                  <Col>
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
                  <Col>
                    <Form.Item>
                      <Button danger onClick={handleBack}>
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {dailyView && (
              <>
                <Row>
                  <Col span={24}>
                    <CustomTable
                      pagination={false}
                      title={() => (
                        <PageHeader
                          title={"Day Schedule"}
                          buttonLabel={"Add Template"}
                          buttonIcon={
                            <PlusCircleOutlined
                              style={{ fontSize: "1.1rem" }}
                            />
                          }
                          onButtonClick={handleAddTemplate}
                        />
                      )}
                      columns={DailyTemplateColumns}
                      onEdit={(record) => onEditTemplate(record)}
                      onDelete={(record) => onDeleteTemplate(record)}
                      dataSource={templateDayDetails}
                    />
                  </Col>
                </Row>
              </>
            )}
            {weekDayView && (
              <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                <Col span={24}>
                  <CustomTable
                    pagination={false}
                    title={() => (
                      <PageHeader
                        title={"Week Day Schedule"}
                        buttonLabel={"Add Template"}
                        buttonIcon={
                          <PlusCircleOutlined style={{ fontSize: "1.1rem" }} />
                        }
                        onButtonClick={handleAddTemplate}
                      />
                    )}
                    onDelete={(record) => onDeleteTemplate(record)}
                    onEdit={(record) => onEditTemplate(record)}
                    columns={WeekDayTemplateColumns}
                    dataSource={templatesWeekDayDetails}
                  />
                </Col>
              </Row>
            )}
            {(weekDayView || dailyView) && (
              <Row justify="end" style={{ marginRight: "0.5rem" }}>
                <Col>
                  <Form.Item>
                    <Button danger onClick={handleBack}>
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

          <Row justify={"end"} gutter={16} style={{ marginBottom: "-1.5rem" }}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditingDayModal ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleCloseDayTemplateModal}>
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

          <Row justify={"end"} gutter={16} style={{ marginBottom: "-1.5rem" }}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditingWeekDayModal ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleCloseWeekDayTemplateModal}>
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

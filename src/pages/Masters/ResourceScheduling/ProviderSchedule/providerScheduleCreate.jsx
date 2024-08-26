import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Form,
  Button,
  Select,
  notification,
  Radio,
  Space,
  Popconfirm,
  Table,
  Modal,
} from "antd";
import Title from "antd/es/typography/Title";
import CustomTable from "../../../../components/customTable/index";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  urlGetScheduleTypesBasedOnTypeId,
  urlGetEditDayProviderSchedule,
  urlDeleteProviderScheduleBasedOnTypeID,
  urlGetScheduleCreateDetails,
  urlAddNewProviderScheduleOfTypeWeek,
  urlAddNewProviderScheduleOfTypeDay,
  urlAddNewProviderScheduleOfTypeWeekDay,
  urlUpdateProviderScheduleOfType,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import WeeklyView from "./WeeklyView";
import PageHeader from "../../../../components/PageHeader";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../../components/customGridColumns";

function ProviderScheduleCreate() {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [weeklyView, setWeeklyView] = useState(false);
  const [dailyView, setDailyView] = useState(false);
  const [weekDayView, setWeekDayView] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [templateSessions, setTemplateSessions] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [showRadioButtons, setShowRadioButtons] = useState(null);
  const [isDailyTemplateModalOpen, setIsDailyTemplateModalOpen] =
    useState(false);
  const [isWeekDayTemplateModalOpen, setIsWeekDayTemplateModalOpen] =
    useState(false);

  const [days, setDays] = useState([]);
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [weekDays, setWeekDays] = useState([]);
  const [templateDayDetails, setTemplateDayDetails] = useState([]);
  const [templatesWeekDayDetails, setTemplateWeekDayDetails] = useState([]);
  const [providerSchedule, setProviderSchedule] = useState([]);
  const [templateDayData, setTemplateDayData] = useState([]);
  const [templateWeekDayData, setTemplateWeekDayData] = useState([]);
  const [isEditingDayModal, setIsEditingDayModal] = useState(false);
  const [isEditingWeekDayModal, setIsEditingWeekDayModal] = useState(false);
  const [ScheduleTypeId, setScheduleTypeId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleProviderChange();
  }, [form]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetScheduleCreateDetails}`);
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

  const handleProviderChange = (value) => {
    setShowRadioButtons(true);
    if (!value && value === undefined) {
      setShowRadioButtons(false);
    }
  };

  const handleRadioChange = async (e) => {
    form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
    const value = Number(e.target.value);
    const providerValue = await form.getFieldsValue();
    if (value != null) {
      try {
        if (providerValue != null) {
          const response = await customAxios.get(
            `${urlGetScheduleTypesBasedOnTypeId}?ProviderId=${providerValue.Provider}&typeId=${value}`
          );
          if (response.data != null) {
            if (value === 1) {
              setTemplateSessions(response.data.data.Templates);
              setWeeks(response.data.data.Weeks);
              setWeeklyView(true);
              setDailyView(false);
              setWeekDayView(false);
              setSelectedScheduleType("Week");
              setScheduleTypeId(value);
            }
            if (value === 2) {
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
              setScheduleTypeId(value);
            }
            if (value === 3) {
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
              setScheduleTypeId(value);
            }
          }
        }
      } catch (error) {
        console.error("console the error", error);
      }
    }
  };

  const handleBack = () => {
    form.resetFields();
    const url = `/ProviderSchedule`;
    // Navigate to the new URL
    navigate(url);
  };

  const onEditTemplate = (record) => {
    if (selectedScheduleType === "Days") {
      setIsEditingDayModal(true);
      setIsDailyTemplateModalOpen(true);
    } else {
      setIsEditingWeekDayModal(true);
      setIsWeekDayTemplateModalOpen(true);
    }

    customAxios
      .get(
        `${urlGetEditDayProviderSchedule}?providerScheduleId=${record.ProviderScheduleId}`
      )
      .then((response) => {
        if (response.data !== null) {
          if (selectedScheduleType === "Days") {
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
    try {
      customAxios
        .delete(
          `${urlDeleteProviderScheduleBasedOnTypeID}?ProviderScheduleId=${record.ProviderScheduleId}&TypeId=${ScheduleTypeId}&ProviderId=${record.ProviderId}`
        )
        .then((response) => {
          if (response.data.data !== null) {
            if (selectedScheduleType === "Days") {
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
      form.resetFields(["Day", "TemplateSession"]);
    } else {
      setIsEditingWeekDayModal(false);
      setIsWeekDayTemplateModalOpen(true);
      form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
    }
  };

  const handleCloseDayTemplateModal = () => {
    setIsDailyTemplateModalOpen(false);
    setIsEditingDayModal(false);
    form.resetFields(["Day", "TemplateSession"]);
  };
  const handleCloseWeekDayTemplateModal = () => {
    setIsEditingWeekDayModal(false);
    setIsWeekDayTemplateModalOpen(false);
    form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setLoading(true);

    try {
      if (weeklyView) {
        if (values) {
          let scheduleProviderWeek = selectedSessions.map((session) => ({
            ...session,
            ProviderId: values.Provider,
            ScheduleType: selectedScheduleType,
            FacilityId: 1,
          }));

          const existingWeekdayIds = new Set(
            scheduleProviderWeek.map((session) => session.WeekdayId)
          );

          // Step 3: Iterate over the weeks to add any missing entries
          weeks.forEach((week) => {
            if (!existingWeekdayIds.has(week.LookupID)) {
              scheduleProviderWeek.push({
                WeekdayId: week.LookupID,
                TemplateId: 0, // or any default value you want to set
                ProviderId: values.Provider,
                ScheduleType: selectedScheduleType,
                FacilityId: 1,
              });
              existingWeekdayIds.add(week.WeekdayId); // add the WeekdayId to the set
            }
          });
          const response = await customAxios.post(
            urlAddNewProviderScheduleOfTypeWeek,
            scheduleProviderWeek
          );

          if (response.data !== null) {
            if (response.data === "Success") {
              // Display success notification
              notification.success({
                message: "Schedule Template details added Successfully",
              });
              handleBack();
              form.resetFields();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
              form.resetFields();
            }
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
              form.resetFields(["Day", "TemplateSession"]);

              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
              form.resetFields(["Day", "TemplateSession"]);
            }
          }
        } else {
          const response = await customAxios.post(
            `${urlAddNewProviderScheduleOfTypeDay}?DayId=${
              values.Day
            }&FacilityId=${1}&TemplateId=${values.TemplateSession}&ProviderId=${
              values.Provider
            }&ScheduleType=${selectedScheduleType}&TypeId=${values.Schedule}`
          );

          if (response.data !== null) {
            if (response.data.data !== undefined) {
              // Display success notification
              setShowRadioButtons(true);
              const templateData = response.data.data.ProviderSchedules.map(
                (record, index) => {
                  return { ...record, key: index + 1 };
                }
              );
              form.setFieldsValue({
                Provider: templateData[0].ProviderId,
                Schedule: templateData[0].ScheduleType === "Days" ? 2 : 3,
              });
              setTemplateDayDetails(templateData);
              setIsDailyTemplateModalOpen(false);
              form.resetFields(["Day", "TemplateSession"]);
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
              form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);

              // handleBack();
            } else if (response.data === "AlreadyExists") {
              notification.warning({
                message: "Schedule Template already exists",
              });
              // handleBack();
              form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
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
            }&ScheduleType=${selectedScheduleType}&TypeId=${values.Schedule}`
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
                Schedule:
                  templateData[0].ScheduleType === "WeekDays" ? 3 : null,
              });
              form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
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

              form.resetFields(["FrequencyDay", "Day", "TemplateSession"]);
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
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Create Provider Schedule"} button={false} />
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
                  placeholder="Select the provider"
                  style={{ width: "100%" }}
                  onChange={handleProviderChange}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  loading={Loading}
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
          <Row
            gutter={16}
            // style={{ margin: "0 1rem" }}
            // style={{ height: "1.8rem", paddingBottom: "2rem" }}
          >
            {showRadioButtons && (
              <ColWithTwelveSpan>
                <Form.Item name="Schedule">
                  <Radio.Group onChange={handleRadioChange} checked>
                    <Space
                      direction="horizontal"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Radio value={1}>Weekly</Radio>

                      <Radio value={2}>Daily</Radio>

                      <Radio value={3}>Weekdays</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </ColWithTwelveSpan>
            )}
          </Row>

          {weeklyView && (
            <>
              <Row style={{ margin: "0px 1rem" }}>
                <ColWithTwelveSpan>
                  <WeeklyView
                    days={weeks}
                    providerSchedule={providerSchedule}
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
                      Save
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
                          <PlusCircleOutlined style={{ fontSize: "1.1rem" }} />
                        }
                        onButtonClick={handleAddTemplate}
                      />
                    )}
                    columns={DailyTemplateColumns}
                    dataSource={templateDayDetails}
                    onDelete={(record) => onDeleteTemplate(record)}
                    onEdit={(record) => onEditTemplate(record)}
                  />
                </Col>
              </Row>
              <Row justify="end">
                <Col style={{ marginRight: "0.5rem" }}>
                  <Form.Item>
                    <Button danger onClick={handleBack}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {weekDayView && (
            <>
              <Row>
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
              <Row justify="end" style={{ marginRight: "0.5rem" }}>
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
        </Form>
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
              disabled={isEditingDayModal}
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

          <Row gutter={16} justify={"end"} style={{ marginBottom: "-1.5rem" }}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
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
          form={form}
          onFinish={handleSubmit}
          weekDays
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
                  Submit
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

export default ProviderScheduleCreate;

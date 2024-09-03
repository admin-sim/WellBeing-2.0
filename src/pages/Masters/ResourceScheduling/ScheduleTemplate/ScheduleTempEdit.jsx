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
} from "antd";
import Title from "antd/es/typography/Title";
import { useForm } from "antd/es/form/Form";
import SessionsForms from "./sessionsForms";
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlAddOrUpdateScheduleTemplateSessions,
  urlGetScheduleTemplateDetailsBasedOnId,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import moment from "moment";
import PageHeader from "../../../../components/PageHeader";
import { ColWithSixSpan } from "../../../../components/customGridColumns";

const ScheduleTemplateEdit = () => {
  const [form] = Form.useForm();
  const [NumOfForms, setNumOfForms] = useState();
  const [templateData, setTemplateData] = useState();
  const [formData, setFormData] = useState({});
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const record = location.state.selectedRow.TemplateId;
    if (record != null) {
      HandleEditScheduleTemplate(record);
    }
  }, []);

  const HandleEditScheduleTemplate = async (record) => {
    // console.log("the schedule Template", record);
    setLoading(true);
    try {
      const response = await customAxios.get(
        `${urlGetScheduleTemplateDetailsBasedOnId}?TemplateId=${record}`
      );

      if (response.data != null) {
        console.log("the response", response.data.data.AddNewScheduleTemplate);
        console.log(
          "the response of sessions",
          response.data.data.ScheduleTemplateSessionList
        );
        const tempData = response.data.data.AddNewScheduleTemplate;
        setTemplateData(tempData);
        form.setFieldsValue({
          TemplateName: tempData.TemplateName,
        });
        setNumOfForms(response.data.data.ScheduleTemplateSessionList.length);
        const formData = {
          sessions: response.data.data.ScheduleTemplateSessionList.map(
            (session, index) => ({
              StartTime: moment(session.StartTime, "HH:mm:ss"),
              EndTime: moment(session.EndTime, "HH:mm:ss"),
              SlotDuration: session.SlotDuration,
              PatientsInSlot: session.PatientsInslot,
              OverbookingSlots: session.OverbookingSlots,
              OverbookingEndSlots: session.OverbookingEndSlots,
              PatientsMaxSlot: session.PatientsMaxSlot,
              TemplateSessionId: session.TemplateSessionId,
              SessionNo: session.SessionNo,
            })
          ),
        };
        console.log("Updated formData:", formData);
        setLoading(false);
        setFormData(formData);
      }
    } catch (error) {
      console.log("catching the error", error);
    }
  };

  // useEffect(() => {
  //   const formData = {
  //     sessions: response.data.data.ScheduleTemplateSessionList.map(
  //       (session, index) => ({
  //         StartTime: moment(session.StartTime, "HH:mm:ss"),
  //         EndTime: moment(session.EndTime, "HH:mm:ss"),
  //         SlotDuration: session.SlotDuration,
  //         PatientsInSlot: session.PatientsInslot,
  //         OverbookingSlots: session.OverbookingSlots,
  //         OverbookingEndSlots: session.OverbookingEndSlots,
  //         PatientsMaxSlot: session.PatientsMaxSlot,
  //         TemplateSessionId: session.TemplateSessionId,
  //         SessionNo: session.SessionNo,
  //       })
  //     ),
  //   };
  //   form.setFieldsValue(formData);
  // }, [response, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log("Form Values:", values);
      const sessionData = values.sessions.map((obj, index) => {
        return {
          ...obj,
          TemplateSessionId: formData.sessions[index].TemplateSessionId,
          SessionNo: formData.sessions[index].SessionNo,
          StartTime: values.sessions[index].StartTime.format("HH:mm:ss"),
          EndTime: values.sessions[index].EndTime.format("HH:mm:ss"),
        };
      });

      const schedule = {
        TemplateId: templateData.TemplateId,
        TemplateName: values.TemplateName,
      };

      const scheduleTemplate = {
        AddNewScheduleTemplate: schedule,
        ScheduleTemplateSessionList: sessionData,
      };

      const response = await customAxios.post(
        urlAddOrUpdateScheduleTemplateSessions,
        scheduleTemplate
      );

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      if (response.data !== null) {
        if (response.data === "True") {
          // Display success notification
          notification.success({
            message: "Schedule Template Sessions details updated Successfully",
          });
          handleBack();
          form.resetFields();
        }
      }

      setLoading(false);
    } catch (errorInfo) {
      console.log("Error:", errorInfo);
    }
  };

  // useEffect(() => {
  //   form.setFieldsValue(formData);
  // }, [NumOfForms, formData]);

  const handleBack = () => {
    form.resetFields();
    const url = `/ScheduleTemplate`;
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
        <PageHeader title={"Edit Template"} button={false} />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ margin: "1rem" }}
        >
          <Row gutter={16}>
            <ColWithSixSpan>
              <Form.Item
                name="TemplateName"
                label="Template Name"
                rules={[{ required: true, message: "Enter Template Name" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row>
            <Col span={24}>
              <SessionsForms
                numForms={NumOfForms}
                form={form}
                formData={formData}
                // setFormData={setFormData}
              ></SessionsForms>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col style={{ marginRight: "1rem" }}>
              <Form.Item>
                <Button size="middle" type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={handleBack}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default ScheduleTemplateEdit;

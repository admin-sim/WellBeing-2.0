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
import { useNavigate } from "react-router-dom";
import {
  urlAddOrUpdateScheduleTemplateSessions,
  urlGetScheduleTemplateDetailsBasedOnId,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import PageHeader from "../../../../components/PageHeader";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithThreeSpan,
} from "../../../../components/customGridColumns";
import { JsonRequestError } from "fullcalendar/index.js";

function ScheduleCreateOrUpdate() {
  const [form] = Form.useForm();
  const [NumOfForms, setNumOfForms] = useState();
  const [addSession, setAddSessions] = useState();
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessions: [
      {
        StartTime: "",
        EndTime: "",
        SlotDuration: "",
        PatientsInSlot: "",
        OverbookingSlots: "",
        OverbookingEndSlots: "",
        PatientsMaxSlot: "",
      },
    ],
  });

  const handleSessionsForms = (values) => {
    debugger;
    if (Number(values.NumOfSessions) > 0) {
      console.log(values);
      setNumOfForms(values.NumOfSessions);
      setAddSessions(true);
    }
  };

  const handleBack = () => {
    setNumOfForms(0);
    setAddSessions(false);
    form.resetFields();
    const url = `/ScheduleTemplate`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleSubmit = async () => {
    debugger;
    setLoading(true);
    try {
      const values = await form.validateFields();

      console.log("Form Values:", values);
      const sessionData = values.sessions.map((obj, index) => {
        return {
          ...obj,
          TemplateSessionId: 0,
          StartTime: values.sessions[index].StartTime.format("HH:mm:ss"),
          EndTime: values.sessions[index].EndTime.format("HH:mm:ss"),
        };
      });

      const schedule = {
        TemplateId: 0,
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
            message: "Schedule Template details added Successfully",
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
        <PageHeader title={"Create Template"} button={false} />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSessionsForms}
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
            <ColWithSixSpan>
              <Form.Item
                name="NumOfSessions"
                label="No. of sessions"
                rules={[
                  { required: true, message: "Enter the No. of sessions" },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithThreeSpan
              // xl={6}
              // lg={6}
              // md={6}
              // sm={24}
              // xs={24}
              // span={6}
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-around",
              }}
            >
              <Form.Item style={{ marginRight: "1rem" }}>
                <Button type="primary" htmlType="submit">
                  Add Sessions
                </Button>
              </Form.Item>

              {!addSession && (
                <Form.Item>
                  <Button type="default" danger onClick={handleBack}>
                    Back
                  </Button>
                </Form.Item>
              )}
            </ColWithThreeSpan>
          </Row>
          {addSession && (
            <>
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
                    <Button type="default" danger onClick={handleBack}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    </Layout>
  );
}

export default ScheduleCreateOrUpdate;

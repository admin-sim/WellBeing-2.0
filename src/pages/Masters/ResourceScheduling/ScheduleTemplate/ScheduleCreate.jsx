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
              Create Template
            </Title>
          </Col>
        </Row>
        <Form layout="vertical" form={form} onFinish={handleSessionsForms}>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "20px 0px" }}
            // style={{ height: "1.8rem", paddingBottom: "2rem" }}
          >
            <Col span={6}>
              <Form.Item
                name="TemplateName"
                label="Template Name"
                rules={[{ required: true, message: "Enter Template Name" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="NumOfSessions"
                label="No. of sessions"
                rules={[
                  { required: true, message: "Enter the No. of sessions" },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={3} style={{ margin: "30px 0px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Sessions
                </Button>
              </Form.Item>
            </Col>
            {!addSession && (
              <Col span={2} style={{ margin: "30px 0px" }}>
                <Form.Item>
                  <Button type="default" onClick={handleBack}>
                    Back
                  </Button>
                </Form.Item>
              </Col>
            )}
          </Row>
          {addSession && (
            <>
              <Row>
                <Col
                  span={24}
                  style={{ margin: "0px 10px", padding: "4px 20px" }}
                >
                  <SessionsForms
                    numForms={NumOfForms}
                    form={form}
                    formData={formData}
                    // setFormData={setFormData}
                  ></SessionsForms>
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
                      Save
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
        </Form>
      </div>
    </Layout>
  );
}

export default ScheduleCreateOrUpdate;

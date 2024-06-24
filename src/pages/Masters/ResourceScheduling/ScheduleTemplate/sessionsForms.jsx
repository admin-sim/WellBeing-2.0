import React from "react";
import {
  Layout,
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  TimePicker,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
//import { useForm } from "antd/es/form/Form";

const SessionsForms = ({ numForms, form }) => {
  const numberPattern = /^\d*$/;
  //const [form] = useForm();

  // useEffect(() => {
  //   if (form) {
  //     form.setFieldsValue(formData);
  //   }
  // }, [form, formData]);

  let forms = [];
  for (let i = 0; i < numForms; i++) {
    forms.push(
      <div key={i}>
        <strong> Session: {i + 1} </strong>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "20px 0px" }}
        >
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "StartTime"]}
              label="Start Time"
              rules={[
                { required: true, message: "Select the Start Time" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (i === 0) return Promise.resolve(); // No previous session for the first one
                    const prevEndTime = getFieldValue([
                      "sessions",
                      i - 1,
                      "EndTime",
                    ]);
                    if (!value || (prevEndTime && value.isAfter(prevEndTime))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Start Time must be after the previous session's End Time"
                      )
                    );
                  },
                }),
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                changeOnScroll
                needConfirm={false}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "EndTime"]}
              label="End Time"
              rules={[
                { required: true, message: "Select the End Time" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startTime = getFieldValue([
                      "sessions",
                      i,
                      "StartTime",
                    ]);
                    if (!value || (startTime && value.isAfter(startTime))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End Time must be after Start Time")
                    );
                  },
                }),
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                changeOnScroll
                needConfirm={false}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "SlotDuration"]}
              label="Slot Duration"
              rules={[
                { required: true, message: "Enter Slot Duration" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "PatientsInSlot"]}
              label="No. of patient/slot"
              rules={[
                { required: true, message: "Enter No. of patient" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "20px 0px" }}
        >
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "OverbookingSlots"]}
              label="Overbooking slots(begin)"
              rules={[
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "OverbookingEndSlots"]}
              label="Overbooking slots(end)"
              rules={[
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "PatientsMaxSlot"]}
              label="Maximum No. of slot"
              rules={[
                { required: true, message: "Enter the value" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
  return <>{forms}</>;
};

export default SessionsForms;

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
//import { useForm } from "antd/es/form/Form";

const SessionsForms = ({ numForms, form }) => {

  const numberPattern = /^\d*$/;
  //const [form] = useForm();

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
              rules={[{ required: true, message: "Select the Start Time" }]}
            >
              <TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "EndTime"]}
              label="End Time"
              rules={[{ required: true, message: "Select the Start Time" }]}
            >
              <TimePicker style={{ width: "100%" }} />
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

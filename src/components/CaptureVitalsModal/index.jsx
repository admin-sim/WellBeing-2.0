import { Col, Form, Input, Modal, Radio, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import React, { useState } from "react";
import { FaBed, FaRegClock } from "react-icons/fa";
import { BsPersonStanding } from "react-icons/bs";
import TextArea from "antd/es/input/TextArea";
import { ColWithSixSpan } from "../customGridColumns";

function CaptureVitalsModal({ open, close, onSubmit }) {
  const [form] = useForm();
  const currentDate = new Date();
  const currentTimeString = currentDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const [MAPValues, setMAPValues] = useState({
    SystolicBP: "",
    DiastolicBP: "",
    MeanAtrialPressure: "",
  });

  const [heightWeightValues, setHeightWeightValues] = useState({
    Height: "",
    Feet: "",
    Inch: "",
    Weight: "",
    BMI: "",
  });

  const onHeightChange = (e) => {
    const height = e.target.value;
    const feet = Math.floor(height / 30.48); // 1 foot = 30.48 cm
    const inch = Math.floor((height / 30.48 - feet) * 12); // 1 inch = 2.54 cm

    setHeightWeightValues((prevState) => ({
      ...prevState,
      Height: height,
      Feet: feet,
      Inch: inch,
    }));
    form.setFieldsValue({
      Feet: feet,
      Inch: inch,
    });
    calculateBMI(height, heightWeightValues.Weight);
  };

  const onWeightChange = (e) => {
    const weight = e.target.value;
    setHeightWeightValues((prevState) => ({
      ...prevState,
      Weight: weight,
    }));
    calculateBMI(heightWeightValues.Height, weight);
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) {
      // If either height or weight is not provided, set BMI to 0
      setHeightWeightValues((prevState) => ({
        ...prevState,
        BMI: 0,
      }));
      form.setFieldsValue({
        BodyMassIndex: 0,
      });
      return; // Exit the function early if either height or weight is missing
    }

    // Calculate BMI only if both height and weight are provided
    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
    setHeightWeightValues((prevState) => ({
      ...prevState,
      BMI: bmi,
    }));
    form.setFieldsValue({
      BodyMassIndex: bmi,
    });
  };

  const onSystolicBPChange = (e) => {
    const systolicBP = e.target.value;
    setMAPValues((prevState) => ({
      ...prevState,
      SystolicBP: systolicBP,
    }));

    calculateMAP(systolicBP, MAPValues.DiastolicBP);
  };

  const onDiastolicBPChange = (e) => {
    const diastolicBP = e.target.value;
    setMAPValues((prevState) => ({
      ...prevState,
      DiastolicBP: diastolicBP,
    }));

    calculateMAP(MAPValues.SystolicBP, diastolicBP);
  };

  const calculateMAP = (systolicBP, diastolicBP) => {
    if (!systolicBP || !diastolicBP) {
      //if either systolicBP or diastolicBP are not provided then set MeanAtrialPressure to 0

      setMAPValues((prevState) => ({
        ...prevState,
        MeanAtrialPressure: 0,
      }));
      form.setFieldsValue({ MeanAtrialPressure: 0 });
    }

    if (systolicBP && diastolicBP) {
      const MAP = (
        parseInt(systolicBP) / 3 +
        (2 * parseInt(diastolicBP)) / 3
      ).toFixed(2);

      setMAPValues((prevState) => ({
        ...prevState,
        MeanAtrialPressure: MAP,
      }));
      // setMAPValues({ ...MAPValues, MeanAtrialPressure: MAP });
      form.setFieldsValue({ MeanAtrialPressure: MAP });
    }
  };

  function handleCancel() {
    form.resetFields();
    close();
  }
  const tempOptions = (
    <Select defaultValue="celsius">
      <Select.Option key="celsius">°C</Select.Option>
      <Select.Option key="fahrenheit">°F</Select.Option>
    </Select>
  );

  return (
    <div>
      <Modal
        centered
        width="70%"
        title="CAPTURE VITALS"
        open={open}
        onOk={onSubmit}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        maskClosable={false}
      >
        <div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <div
                style={{
                  backgroundColor: "#d6e4ff",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                You are capturing vitals for the above patient on &nbsp;
                {currentTimeString}
                <FaRegClock style={{ marginLeft: "5px" }} />
              </div>
            </Col>
          </Row>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              onSubmit(values);
            }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 10px" }}
            >
              <ColWithSixSpan>
                <Form.Item
                  name="Height"
                  label="Height"
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for height",
                    },
                  ]}
                >
                  <Input addonAfter="cm" onChange={onHeightChange} />
                </Form.Item>
              </ColWithSixSpan>
              <Col span={3}>
                <Form.Item name="Feet" label="Feet">
                  <Input disabled value={heightWeightValues.Feet} />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="Inch" label="Inch">
                  <Input disabled value={heightWeightValues.Inch} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="Weight"
                  label="Weight"
                  rules={[
                    {
                      pattern: /^\d{1,3}$/,
                      message: "Please enter valid input for weight",
                    },
                  ]}
                >
                  <Input addonAfter="Kg" onChange={onWeightChange} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="BodyMassIndex" label="Body Mass Index">
                  <Input disabled value={heightWeightValues.BMI} />
                </Form.Item>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 10px" }}
            >
              <Col span={8}>
                <Form.Item
                  name="HeadCircumference"
                  label="Head Circumference"
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message:
                        "Please enter valid input for head circumference",
                    },
                  ]}
                >
                  <Input addonAfter="cm" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Temperature"
                  label="Temperature"
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for Temperature",
                    },
                  ]}
                >
                  <Input addonAfter={tempOptions} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="HeartRate"
                  label="Heart Rate"
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for Heart Rate",
                    },
                  ]}
                >
                  <Input addonAfter="bpm" />
                </Form.Item>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 10px" }}
            >
              <Col span={6}>
                <Form.Item
                  name="SystolicBP"
                  label="Systolic BP "
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for Systolic BP",
                    },
                  ]}
                >
                  <Input addonAfter="mmHg" onChange={onSystolicBPChange} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="DiastolicBP"
                  label="Diastolic BP "
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for Diastolic BP",
                    },
                  ]}
                >
                  <Input addonAfter="mmHg" onChange={onDiastolicBPChange} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="MeanAtrialPressure"
                  label="Mean Atrial Pressure"
                >
                  <Input
                    disabled
                    addonAfter="mmHg"
                    value={MAPValues.MeanAtrialPressure}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <p style={{ margin: "2px" }}>Position</p>
                <div
                  style={{
                    // border: "1px solid #d6e4ff",
                    padding: "10px 10px",
                  }}
                >
                  <Form.Item name="position">
                    <Radio.Group>
                      <Radio value="sitting">
                        <MdAirlineSeatReclineNormal style={{ fontSize: 18 }} />
                      </Radio>
                      <Radio value="supine">
                        <FaBed style={{ fontSize: 18 }} />
                      </Radio>
                      <Radio value="standing">
                        <BsPersonStanding style={{ fontSize: 18 }} />
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 10px" }}
            >
              <Col span={6}>
                <Form.Item
                  name="RespiratoryRate"
                  label="Respiratory Rate "
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for Respiratory Rate",
                    },
                  ]}
                >
                  <Input addonAfter="(C/M)" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="OxygenSaturation"
                  label="SPO2 %"
                  rules={[
                    {
                      pattern: /^\d{2,3}$/,
                      message: "Please enter valid input for SPO2",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={3}>
                <div style={{ marginLeft: "10px" }}>
                  <p>Oedema</p>
                  <Form.Item name="oedema">
                    <Switch size="large" style={{ margin: "0px 5px" }}></Switch>
                  </Form.Item>
                </div>
              </Col>
              <Col span={3}>
                <div>
                  <p>Pallor</p>
                  <Form.Item name="pallor" style={{ margin: "0px 0px" }}>
                    <Switch size="large"></Switch>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              // style={{ margin: "0px 10px" }}
            >
              <Col span={12} style={{ marginLeft: "25px" }}>
                <Form.Item name="otherComments" label="Other Comments (if any)">
                  <TextArea
                    placeholder="Add your thoughts on capturing vitals"
                    autoSize={{
                      minRows: 2,
                      maxRows: 6,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default CaptureVitalsModal;

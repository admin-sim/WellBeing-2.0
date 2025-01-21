import {
  Button,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import { PiInfo } from "react-icons/pi";
import CustomRadioGroup from "../../../components/customRadioGroup";
import lungs from "../../../assets/lungs.svg";
import stethoscope from "../../../assets/stethoscope.svg";
import heart from "../../../assets/heart.svg";
import gastro from "../../../assets/gastro.svg";
import bones from "../../../assets/bones.svg";
import {
  ColWithSixSpan,
  ColWithThreeSpan,
} from "../../../components/customGridColumns";

function PhysicalExamination() {
  const [form] = useForm();
  const [form1] = useForm();

  const UpperLimbColumns = [
    {
      title: "Name of the Joint",
      dataIndex: "name",
      key: "1",
      width: "20%",
    },
    {
      title: "Range of Motion",
      key: "2",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item
            style={{ width: "100%" }}
            name={`RangeMotion${record.name}`}
          >
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Strength",
      key: "3",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Strength${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Wasting",
      key: "4",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Wasting${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Sensation",
      width: "16%",
      key: "5",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Sensation${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Reflexes",
      key: "6",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Reflexes${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  const UpperLimbData = [
    {
      key: "1",
      name: "Shoulder",
    },
    {
      key: "2",
      name: "Elbow",
    },
    {
      key: "3",
      name: "Wrist",
    },
    {
      key: "4",
      name: "Hand",
    },
  ];

  const LowerLimbColumns = [
    {
      title: "Name of the Joint",
      dataIndex: "name",
      key: "1",
      width: "20%",
    },
    {
      title: "Range of Motion",
      key: "2",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item
            style={{ width: "100%" }}
            name={`RangeMotion${record.name}`}
          >
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Strength",
      key: "3",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Strength${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Wasting",
      key: "4",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Wasting${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Sensation",
      width: "16%",
      key: "5",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Sensation${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Reflexes",
      key: "6",
      width: "16%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Reflexes${record.name}`}>
            <Select
              size="middle"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  const LowerLimbData = [
    {
      key: "1",
      name: "Hip",
    },
    {
      key: "2",
      name: "Knee",
    },
    {
      key: "3",
      name: "Ankle",
    },
    {
      key: "4",
      name: "Foot",
    },
  ];

  const generalExaminationForm = (
    <>
      <Form
        form={form}
        onFinish={(values) => {
          debugger
          console.log("Physical Examination", values);
        }}
        layout="vertical"
      >
        <Row gutter={32}>
          <Col span={5}>
            <CustomRadioGroup
              name="Conscious"
              label="Conscious"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Cooperative"
              label="Cooperative"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Comfortable"
              label="Comfortable"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Toxic"
              label="Toxic"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={4}>
            <CustomRadioGroup
              name="Dyspneic"
              label="Dyspneic"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={10}>
            <CustomRadioGroup
              name="Build"
              label="Build"
              options={[
                { value: "Moderate", label: "Moderate" },
                { value: "Heavy", label: "Heavy" },
                { value: "Thin", label: "Thin" },
              ]}
            />
          </Col>
          <Col span={10}>
            <CustomRadioGroup
              name="Nourishment"
              label="Nourishment"
              options={[
                { value: "Obese", label: "Obese" },
                { value: "Well", label: "Well" },
                { value: "Cachectic", label: "Cachectic" },
              ]}
            />
          </Col>
          <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
            <span style={{ fontWeight: 600, fontSize: "1rem" }}>Pickel</span>
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Pallor"
              label="Pallor"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Icterus"
              label="Icterus"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Cyanosis"
              label="Cyanosis"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Clubbing"
              label="Clubbing"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={4}>
            <CustomRadioGroup
              name="Koilonychia"
              label="Koilonychia"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Lymphadenopathy"
              label="Lymphadenopathy"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Pedal Edema"
              label="Pedal Edema"
              options={[
                { value: "Y", label: "Yes" },
                { value: "N", label: "No" },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={32} justify={"end"} style={{ margin: "0 0 1rem 0" }}>
          <Col>
            <Button
              size="middle"
              type="primary"
              onClick={() => form.submit()}
            >
              Save
            </Button>
          </Col>
          <Col>
            <Button size="middle" danger onClick={() => form.submit()}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );

  const [activeButtons, setActiveButtons] = useState({
    Respiratory: false,
    Auscultation: false,
    CardiovascularSystem: false,
    GastrointestinalSystem: false,
    MusculoskeletalExamination: false,
  });

  const handleButtonClick = (buttonName) => {
    setActiveButtons((prev) => ({
      ...prev,
      [buttonName]: !prev[buttonName],
    }));
  };

  const systemicExamination = (
    <>
      <div
        style={{
          padding: "0.4rem",
          margin: "0",
          backgroundColor: "#D6E4FF",
          display: "flex",
          alignItems: "center",
          borderRadius: "0.5rem",
        }}
      >
        <PiInfo style={{ fontSize: "1.2rem" }} /> &nbsp;Select the type of
        physical examination to enter details
      </div>
      <Form
          form={form1}
          onFinish={(values) => {
            debugger
            console.log("Physical Examination", values);
          }}
          layout="vertical"
        >
          
        </Form>
      <Row
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "1rem",
        }}
        gutter={32}
      >
        <Col>
          <Button
            size="middle"
            type={activeButtons.Respiratory ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("Respiratory")}
          >
            Respiratory
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.Auscultation ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("Auscultation")}
          >
            Auscultation
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.CardiovascularSystem ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("CardiovascularSystem")}
          >
            Cardiovascular System
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.GastrointestinalSystem ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("GastrointestinalSystem")}
          >
            Gastrointestinal System
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={
              activeButtons.MusculoskeletalExamination ? "primary" : "default"
            }
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("MusculoskeletalExamination")}
          >
            Musculoskeletal Examination
          </Button>
        </Col>
      </Row>

      {activeButtons.Respiratory && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={lungs}
              alt="Respiratory"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Respiratory
          </div>
          <Col span={4}>
            <Form.Item name="rate" label="Respiratory Rate">
              <Select placeholder="Select Rate" allowClear></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="observed"
              label="Observed&nbsp;Respiratory&nbsp;Rate"
            >
              <Select placeholder="Select Rate" allowClear></Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Tachypnea" label="Tachypnea">
              <Select allowClear></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              style={{ marginTop: "-0.6rem" }}
              name="accessory"
              label={
                <span>Accessory Muscles (Strenocleidomastoid)</span>
                //   <Tooltip title="Accessory Muscles&nbsp;(Strenocleidomastoid)">
                //     Accessory&nbsp;Muscles&nbsp;(Strenocleidomastoid)
                //   </Tooltip>
              }
            >
              <Select allowClear></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="intercostal" label="Intercostal Retractions">
              <Select allowClear></Select>
            </Form.Item>
          </Col>
        </Row>
      )}
      {activeButtons.Auscultation && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={stethoscope}
              alt="stethescope"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Auscultation
          </div>
          <ColWithSixSpan>
            <Form.Item name="clear" label="Lungs Clear on Auscultation">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ronchi" label="Ronchi">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="wheezes" label="Wheezes">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Crepitations" label="Crepitations">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="airway" label="Airway Entry">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="movements" label="Breath Movements Rt/Lt">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="sounds" label="Breath Sounds Rt/Lt">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.CardiovascularSystem && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={heart}
              alt="Heart"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Cardiovascular System
          </div>
          <ColWithSixSpan>
            <Form.Item name="pulse" label="Pulse Rate">
              <Input placeholder="Enter Here" allowClear></Input>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="rrr" label="Regular Rate & Rhythm(RRR)">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ObservedRRR" label="Observed RRR">
              <Input placeholder="Select" allowClear></Input>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Tachycardia" label="Tachycardia">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="airway" label="Bradycardia">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="jugular" label="Jugular Venous Pulse">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="s1s2" label="S1 S2 Heard">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="s1s2" label="No Added Sounds and Murmurs">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.GastrointestinalSystem && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={gastro}
              alt="Heart"
              height="2rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Gastrointestinal System
          </div>
          <ColWithSixSpan>
            <Form.Item name="inspection" label="Inspection">
              <Select placeholder="Enter Here" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="palpation" label="Palpation">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="tender" label="Tender">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="TendernessIn" label="Tenderness in">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="hepatomegaly" label="Hepatomegaly">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="splenomegaly" label="Splenomegaly">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="hernia" label="Hernia">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="bowelSounds" label="Bowel Sounds">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="murphysign" label="Murphy's Sign">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="mcburney" label="McBurney's Point">
              <Select placeholder="Select" allowClear></Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.MusculoskeletalExamination && (
        <>
          <Row style={{ marginTop: "2rem" }} gutter={32}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.3rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                width: "100%",
              }}
            >
              <Image
                src={bones}
                alt="Heart"
                height="2.5rem"
                width="auto"
                style={{ marginRight: "1.2rem" }}
              />
              Musculoskeletal Examination
            </div>
            <Col span={24} style={{ margin: "0.5rem 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Ambulatory
              </span>
            </Col>
            <ColWithSixSpan>
              <Form.Item name="freelyAmbulatory" label="Freely Ambulatory">
                <Select placeholder="Enter Here" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="assistant" label="with Assistant (Support)">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="wheelchair" label="With WheelChair">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="walkingStick" label="With Walking Stick">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Gait" label="Gait">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ocular" label="Extra-Ocular Movements">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>Neck</span>
            </Col>
            <ColWithSixSpan>
              <Form.Item name="Flexion" label="Flexion">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="bending" label="Lateral Bending">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Extension" label="Extension">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="spurling" label="Spurling's Sign">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="movementRange" label="Range of Movement">
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row>
            <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Right Upper Limb
              </span>
            </Col>
            <Col span={24}>
              <Table
                columns={UpperLimbColumns}
                dataSource={UpperLimbData}
                pagination={false}
              />
            </Col>
            <Col span={24} style={{ margin: "1.5rem 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Left Upper Limb
              </span>
            </Col>
            <Col span={24}>
              <Table
                columns={UpperLimbColumns}
                dataSource={UpperLimbData}
                pagination={false}
              />
            </Col>
            <Col span={24} style={{ margin: "1.5rem 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Right Lower Limb
              </span>
            </Col>
            <Col span={24}>
              <Table
                columns={LowerLimbColumns}
                dataSource={LowerLimbData}
                pagination={false}
              />
            </Col>
            <Col span={24} style={{ margin: "1.5rem 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Left Lower Limb
              </span>
            </Col>
            <Col span={24}>
              <Table
                columns={LowerLimbColumns}
                dataSource={LowerLimbData}
                pagination={false}
              />
            </Col>
            <ColWithSixSpan>
              <Form.Item
                style={{ marginTop: "1rem" }}
                name="slrTest"
                label="SLR (Straight Leg Rise test)"
              >
                <Select placeholder="Select" allowClear></Select>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
        </>
      )}
      {(activeButtons.MusculoskeletalExamination || activeButtons.GastrointestinalSystem ||
        activeButtons.CardiovascularSystem || activeButtons.Auscultation || activeButtons.Respiratory) && (
          <Row gutter={32} justify={"end"} style={{ margin: "0 0 1rem 0" }}>
            <Col>
              <Button
                size="middle"
                type="primary"
                onClick={() => form.submit()}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button size="middle" danger onClick={() => form.submit()}>
                Cancel
              </Button>
            </Col>
          </Row>
        )}
    </>
  );

  const items = [
    {
      key: "1",
      label: (
        <span style={{ fontSize: "1rem", fontWeight: 700 }}>
          General Examination
        </span>
      ),
      children: generalExaminationForm,
    },
    {
      key: "2",
      label: (
        <span style={{ fontSize: "1rem", fontWeight: 700 }}>
          Physical Examination / Systemic Examination
        </span>
      ),
      children: systemicExamination,
    },
  ];

  return (
    <>
      <Row
        style={{ display: "flex", justifyContent: "space-between" }}
        gutter={32}
      >
        <Col style={{ fontSize: "1rem" }}>Physical Examination</Col>
        <Col>
          <Button
            size="middle"
            disabled
            style={{
              borderRadius: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Previous Physical Examination
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <div
        style={{
          margin: "1rem 0",
          border: "1px solid grey",
          borderRadius: "0.5rem",
          backgroundColor: "#fff",
        }}
      >
        <Form
          form={form}
          onFinish={(values) => {
            debugger
            console.log("Physical Examination", values);
          }}
          layout="vertical"
        >
          <Collapse items={items} bordered={false} ghost size="large" />
          {/* <Row gutter={32} justify={"end"} style={{ margin: "0 0 1rem 0" }}>
            <Col>
              <Button
                size="middle"
                type="primary"
                onClick={() => form.submit()}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button size="middle" danger onClick={() => form.submit()}>
                Cancel
              </Button>
            </Col>
          </Row> */}
        </Form>
      </div>
    </>
  );
}

export default PhysicalExamination;

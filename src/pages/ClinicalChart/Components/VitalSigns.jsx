import { LoginOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import CaptureVitalsModal from "../../../components/CaptureVitalsModal";

function VitalSigns() {
  const [showCaptureVitalsModal, setShowCaptureVitalsModal] = useState(false);

  function handleSubmit(values) {
    console.log("CaptureVitals : ", values);
  }

  return (
    <>
      <Row gutter={32}>
        <Col span={5}>
          <Button
            className="dfja"
            type="primary"
            size="middle"
            onClick={()=>setShowCaptureVitalsModal(true)}
          >
            <PlusCircleOutlined
              className="dfja"
              style={{ fontSize: "1.1rem" }}
            />
            Capture Vitals
          </Button>
        </Col>
        <Col span={6}>
          <Button size="middle">
            Previous Vital Details
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <CaptureVitalsModal
        open={showCaptureVitalsModal}
        close={() => setShowCaptureVitalsModal(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default VitalSigns;

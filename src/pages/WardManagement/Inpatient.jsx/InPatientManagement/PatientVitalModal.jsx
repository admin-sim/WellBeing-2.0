import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
} from "antd";
import React, { useState } from "react";

import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import CaptureVitalsModal from "../../../../components/CaptureVitalsModal";
import { useSearchParams } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FaHistory } from "react-icons/fa";
import { urlAddNewPatientVital1, urlDeletePatientVital, urlGetPatientVitalForEdit } from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import dayjs from "dayjs";

function PatientVitalModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [showCaptureVitalsModal, setShowCaptureVitalsModal] = useState(false)
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({})

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  async function handleEdit(params) {
    debugger
    const response = await customAxios.get(`${urlGetPatientVitalForEdit}?PatientVitaId=${params.PatientVitalId}`)
    if (response.status == 200) {
      setFormData(response.data.data)
      setShowCaptureVitalsModal(true)
    }
  }

  async function handleDelete(params) {
    debugger
    const response = await customAxios.delete(`${urlDeletePatientVital}?PatientVitalId=${params.PatientVitalId}&PatientId=${patient.PatientId}&EncounterId=${patient.EncounterId}`)
    if (response.status == 200) {
      setTableData(response.data.data)
    }
  }

  async function handleSubmit(values) {
    debugger
    const vital = {
      PatientId: patient.PatientId,
      EncounterId: patient.EncounterId,
      Height: values.Height,
      Weight: values.Weight,
      BodyMassIndex: values.BodyMassIndex === 0 ? "0" : null,
      MeanAtrialPressure: values.MeanAtrialPressure === 0 ? "0" : null,
      Temperature: values.Temperature,
      HeartRate: values.HeartRate,
      SystolicBP: values.SystolicBP,
      DiastolicBP: values.DiastolicBP,
      Position: values.position,
      RespiratoryRate: values.RespiratoryRate,
      Oxygensaturation: values.OxygenSaturation,
      PvDate1: dayjs().format('DD-MM-YYYY'),
      Time: dayjs().format('HH:mm:ss'),
      Oedema: values.oedema,
      pallor: values.pallor,
      HeadCircumference: values.HeadCircumference,
      OtherComments: values.otherComments,
      PatientVitalId: values.PatientVitalId ? values.PatientVitalId : 0
    }
    const response = await customAxios.post(urlAddNewPatientVital1, vital, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      message.success('Success')
      setTableData(response.data.data)
      setShowCaptureVitalsModal(false)
    }
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "DateOfBirthstring",
      key: "DateOfBirthstring",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Weight",
      dataIndex: "Weight",
      key: "Weight",
    },
    {
      title: "Temperature",
      dataIndex: "Temperature",
      key: "Temperature",
    },
  ];

  return (
    <div>
      <Modal
        width={"60%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Patient Vitals
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Row gutter={32} style={{ marginTop: '20px' }}>
          <Col span={5}>
            <Button
              className="dfja"
              type="primary"
              size="middle"
              onClick={() => setShowCaptureVitalsModal(true)}
            >
              <PlusCircleOutlined
                className="dfja"
                style={{ fontSize: "1.1rem" }}
              />
              Capture Vitals
            </Button>
          </Col>
          {/* <Col span={6}>
            <Button size="middle">
              Previous Vital Details
              <FaHistory style={{ marginLeft: "0.5rem" }} />
            </Button>
          </Col> */}
        </Row>
        <CaptureVitalsModal onSet={formData}
          open={showCaptureVitalsModal}
          close={() => setShowCaptureVitalsModal(false)}
          onSubmit={handleSubmit}
        />
        <CustomTable dataSource={tableData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
      </Modal>
    </div>
  );
}

export default PatientVitalModal;

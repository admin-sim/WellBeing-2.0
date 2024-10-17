import { LoginOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Spin, Row, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import CaptureVitalsModal from "../../../components/CaptureVitalsModal";
import dayjs from "dayjs";
import { urlAddNewPatientVital1, urlGetPatientVitals, urlDeletePatientVital, urlGetPatientVitalForEdit } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";

function VitalSigns(Patient) {
  const [showCaptureVitalsModal, setShowCaptureVitalsModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const response = await customAxios.get(`${urlGetPatientVitals}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}`)
    if (response.status == 200) {
      setTableData(response.data.data)
      setLoading(false)
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

  async function handleSubmit(values) {
    debugger
    const vital = {
      PatientId: Patient.Patient.PatientId,
      EncounterId: Patient.Patient.Encounter,
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

  async function handleDelete(params) {
    debugger
    const response = await customAxios.delete(`${urlDeletePatientVital}?PatientVitalId=${params.PatientVitalId}&PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}`)
    if (response.status == 200) {
      setTableData(response.data.data)
    }
  }

  async function handleEdit(params) {
    debugger
    const response = await customAxios.get(`${urlGetPatientVitalForEdit}?PatientVitaId=${params.PatientVitalId}`)
    if (response.status == 200) {
      setFormData(response.data.data)
      setShowCaptureVitalsModal(true)
    }
  }

  return (
    <>
      <Row gutter={32}>
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
        <Col span={6}>
          <Button size="middle">
            Previous Vital Details
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <CaptureVitalsModal onSet={formData}
        open={showCaptureVitalsModal}
        close={() => setShowCaptureVitalsModal(false)}
        onSubmit={handleSubmit}
      />
      {/* <Spin loading={loading}> */}
      <CustomTable columns={columns} dataSource={tableData} onDelete={handleDelete} onEdit={handleEdit} />
      {/* </Spin> */}
    </>
  );
}

export default VitalSigns;

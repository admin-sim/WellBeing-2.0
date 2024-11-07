import { LoginOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Spin, Row, Select, message, Table } from "antd";
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
  const [formData, setFormData] = useState({})
  const [prevVitalsTable, setPrevVitalsTable] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOkPrev = () => setIsModalOpen(false)

  const showModal = async (params) => {
    debugger
    try {
      const response = await customAxios.get(
        `${urlGetPatientVitals}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&RangeString=${params}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data;
        setPrevVitalsTable(detailsheader);
        setIsModalOpen(true);
      }
    } catch (error) { }
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
      Patient.handleVitals(response.data.data)
      setShowCaptureVitalsModal(false)
    }
  }

  async function handleDelete(params) {
    debugger
    const response = await customAxios.delete(`${urlDeletePatientVital}?PatientVitalId=${params.PatientVitalId}&PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}`)
    if (response.status == 200) {
      Patient.handleVitals(response.data.data)
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
          <Button size="middle" onClick={() => showModal(dayjs().subtract(1, "month").format('DD-MM-YYYY'))}>
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
      <CustomTable columns={columns} dataSource={Patient.initialData.PatientVital} onDelete={handleDelete} onEdit={handleEdit} />
      <Modal
        title="Previous Allergies"
        open={isModalOpen}
        onOk={handleOkPrev}
        onCancel={handleOkPrev}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOkPrev}>
            Close
          </Button>,
        ]}
      >
        <div>
          <span>Previous Deatils : </span>
          <Select
            defaultValue={dayjs().subtract(1, "month").format('DD-MM-YYYY')}
            onChange={(value) => showModal(value)}
            placeholder="Select Range"
            style={{
              margin: "0.5rem",
              width: "40%",
            }}
            options={[
              { value: dayjs().subtract(6, "year").format('DD-MM-YYYY'), label: "Previous All" },
              { value: dayjs().subtract(7, "day").format('DD-MM-YYYY'), label: "Last One Week" },
              { value: dayjs().subtract(15, "day").format('DD-MM-YYYY'), label: "Last 15 Days" },
              { value: dayjs().subtract(1, "month").format('DD-MM-YYYY'), label: "Last 1 Month" },
              { value: dayjs().subtract(3, "month").format('DD-MM-YYYY'), label: "Last 3 Months" },
              { value: dayjs().subtract(6, "month").format('DD-MM-YYYY'), label: "Last 6 Months" },
              { value: dayjs().subtract(1, "year").format('DD-MM-YYYY'), label: "Last 1 Year" },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columns}
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <span
          //       style={{
          //         margin: 0,
          //       }}
          //     >
          //       {record.Temperature}
          //     </span>
          //   ),
          //   // rowExpandable: (record) => record.name !== "Not Expandable",
          // }}
          dataSource={prevVitalsTable}
        />
      </Modal>
    </>
  );
}

export default VitalSigns;

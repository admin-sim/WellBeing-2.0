import {
  Avatar,
  Badge,
  Button,
  Col,
  Spin,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  TimePicker,
  Card,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/customTable/index";
import PatientHeader from "../../../../components/PatientHeader";
import CkEditor from "../../../../components/CKEditor/index";
import dayjs from "dayjs";
import { PlusCircleOutlined } from "@ant-design/icons";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlAddNewNrNote, urlViewOrEditNrNote, urlDeleteNrNote } from "../../../../../endpoints.js";

function NrNoteModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [templateEditorData, setTemplateEditorData] = useState("");
  const [openCKModel, setOpenCKModel] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('Save')
  const handleCancel = () => {
    handleClose();
  };

  const handleCancel1 = () => {
    setOpenCKModel(false)
    form.resetFields()
    setOpenCKModel(false)
    setButtonTitle('Save')
    setReadOnly(false)
  }

  useEffect(() => {
    setFilteredData(Dropdown.NrNotesList);
  }, [Dropdown.NrNotesList]);

  const columns = [
    {
      title: "Date",
      dataIndex: "datestring",
      key: "datestring",
      sorter: (a, b) => a.datestring - b.datestring,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
      sorter: (a, b) => a.Time - b.Time,
      sortDirections: ["descend", "ascend"],
    },
  ]

  const handleView = async (value, flag) => {
    setTemplateEditorData('')
    const response = await customAxios.get(
      `${urlViewOrEditNrNote}?NoteId=${value.NrNoteId}&EncounterId=${bed.EncounterId}&PatientId=${bed.PatientId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setButtonTitle('Update')
      setTemplateEditorData(response.data.data.NrNote);
      form.setFieldsValue({ 'NrNoteId': response.data.data.NrNoteId })
      setOpenCKModel(true)
      if (flag == 1) {
        setReadOnly(true)
      }
    }
  }

  const handleDelete = async (value) => {
    const response = await customAxios.get(
      `${urlDeleteNrNote}?NoteId=${value.NrNoteId}&EncounterId=${bed.EncounterId}&PatientId=${bed.PatientId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setFilteredData(response.data.data.NrNotesList)
      form.resetFields()
      setTemplateEditorData('')
    }
  }

  return (
    <div>
      <Modal
        width={"60%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Nurse Notes
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Row justify="end" style={{ marginTop: '10px' }}>
          <Col>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setOpenCKModel(true)}>
              Add Notes
            </Button>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <CustomTable
            dataSource={filteredData}
            columns={columns}
            isFilter={true}
            bordered
            onView={(record) => handleView(record, 1)}
            onDelete={handleDelete}
            onEdit={handleView}
          />
        </Spin>
      </Modal>
      <Modal
        width={"70%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>            
            {buttonTitle == 'Save' ? 'Add New Nurse Note' : 'Update Nurse Note'}
          </span>
        }
        open={openCKModel}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel1}
      >
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              Date: dayjs()
            }}
            onFinish={async (values) => {
              debugger
              if (templateEditorData == '') {
                message.warning('No data to Save')
                return false
              }
              const note = {
                NrNoteId: values.NrNoteId ? values.NrNoteId : 0,
                PatientId: bed.PatientId,
                EncounterId: bed.EncounterId,
                datestring: values.Date ? values.Date.format('DD-MM-YYYY') : '',
                timestring: values.Date ? values.Date.format('HH:mm:ss') : '',
                NrNote: templateEditorData
              }
              const response = await customAxios.post(urlAddNewNrNote, note, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (response.status === 200 && response.data.data != null) {
                message.success('Success')
                setFilteredData(response.data.data.NrNotesList)
                form.resetFields()
                setTemplateEditorData('')
                setButtonTitle('Save')
                setReadOnly(false)
              }
              handleCancel1();
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={12}>
                <Form.Item name="Date" label="Date" rules={[{ required: true, message: "Please input!" }]}>
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "hh:mm A" }}
                    format="dddd , DD-MM-YYYY , hh:mm A"
                  />
                </Form.Item>
                <Form.Item name='NrNoteId'>
                  <Input hidden />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name='BP' label='BP'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name='HeartRate' label='Heart Rate'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name='Temperature' label='Temperature'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name='RR' label='RR (in C/M)'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name='Spo2' label='Spo2'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name='Height' label='Height'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name='Weight' label='Weight'>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
              <Col>
                <Form.Item label='Nr Notes' disabled={readOnly}>
                  <CkEditor
                    initialData={templateEditorData}
                    printButton={true}
                    setData={setTemplateEditorData}
                  />
                </Form.Item>
              </Col>
            <Row justify="end">
              <Col>
                <Form.Item hidden={readOnly}>
                  <Button type="primary" htmlType="submit">{buttonTitle}</Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" onClick={handleCancel1}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}

export default NrNoteModal;

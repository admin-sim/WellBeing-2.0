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
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  urlAddNewDrNote,
  urlViewOrEditDrNote,
  urlDeleteDrNote,
} from "../../../../../endpoints.js";
import { set } from "lodash";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns/index.jsx";

function DrNoteModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [templateEditorData, setTemplateEditorData] = useState("");
  const [openCKModel, setOpenCKModel] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [key, setKey] = useState(null);
  const [customKey, setCustomKey] = useState(filteredData?.length + 1000);

  const handleCancel = () => {
    handleClose();
  };

  const handleCancel1 = () => {
    setCustomKey(customKey + 1);
    setTemplateEditorData("");
    form.resetFields();
    setOpenCKModel(false);
    setButtonTitle("Save");
    setReadOnly(false);
  };

  useEffect(() => {
    setFilteredData(Dropdown.DrNotesList);
  }, [Dropdown.DrNotesList]);

  const columns = [
    {
      title: "Date",
      dataIndex: "datestring",
      key: "datestring",
      width: 250,
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
      width: 250,
    },
  ];

  const handleView = async (value, flag) => {
    setTemplateEditorData("");
    const response = await customAxios.get(
      `${urlViewOrEditDrNote}?NoteId=${value.DrNoteId}&EncounterId=${bed.EncounterId}&PatientId=${bed.PatientId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setButtonTitle("Update");
      setTemplateEditorData(response.data.data.DrNote);
      setKey(response.data.data.DrNoteId);
      form.setFieldsValue({ DrNoteId: response.data.data.DrNoteId });
      setOpenCKModel(true);
      if (flag == 1) {
        setReadOnly(true);
      }
    }
  };

  const handleDelete = async (value) => {
    const response = await customAxios.get(
      `${urlDeleteDrNote}?NoteId=${value.DrNoteId}&EncounterId=${bed.EncounterId}&PatientId=${bed.PatientId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setFilteredData(response.data.data.DrNotesList);
      form.resetFields();
      setTemplateEditorData("");
    }
  };

  return (
    <div>
      <Modal
        width={"auto"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Doctor Notes
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Row justify="end" style={{ marginTop: "1rem" }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setKey(null);
                setTemplateEditorData("");
                setOpenCKModel(true);
              }}
            >
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
            {buttonTitle == "Save"
              ? "Add New Doctor Note"
              : "Update Doctor Note"}
          </span>
        }
        open={openCKModel}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel1}
      >
        <Form
          form={form}
          // layout="vertical"
          variant="outlined"
          initialValues={{
            Date: dayjs(),
          }}
          onFinish={async (values) => {
            if (templateEditorData == "") {
              message.warning("No data to Save");
              return false;
            }
            const note = {
              DrNoteId: values.DrNoteId ? values.DrNoteId : 0,
              PatientId: bed.PatientId,
              EncounterId: bed.EncounterId,
              datestring: values.Date ? values.Date.format("DD-MM-YYYY") : "",
              timestring: values.Date ? values.Date.format("HH:mm:ss") : "",
              DrNote: templateEditorData,
            };
            const response = await customAxios.post(urlAddNewDrNote, note, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.status === 200 && response.data.data != null) {
              message.success("Success");
              setFilteredData(response.data.data.DrNotesList);
              form.resetFields();
              setTemplateEditorData("");
              setButtonTitle("Save");
              setReadOnly(false);
            }
            handleCancel1();
          }}
        >
          <Row gutter={16} style={{ margin: "1.5rem 0 -1rem 0" }}>
            <ColWithEightSpan>
              <Form.Item
                name="Date"
                label="Date"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime={{ format: "hh:mm A" }}
                  format="dddd , DD-MM-YYYY , hh:mm A"
                />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          <CkEditor
            key={key ? key : customKey} //added default key to 123456 so that it is unique for adding new notes
            initialData={templateEditorData}
            printButton={true}
            setData={setTemplateEditorData}
          />
          <Row justify="end" gutter={16} style={{ margin: "1rem 0.5rem 0 0" }}>
            <Col>
              <Form.Item hidden={readOnly}>
                <Button type="primary" htmlType="submit">
                  {buttonTitle}
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleCancel1}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default DrNoteModal;

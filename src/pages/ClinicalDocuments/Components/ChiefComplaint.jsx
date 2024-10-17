import { Button, Col, message, Modal, Row, Select, Input, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import Form from "antd/es/form";
import { urlChiefComplaints, urlDeleteChief, urlGetChiefBasedonRange } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";
import dayjs from "dayjs";
import { values } from "lodash";

function ChiefComplaint(Patient) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [prevChiefTable, setPrevChiefTable] = useState([])

  const showModal = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetChiefBasedonRange}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&Range=${dayjs()}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.ChiefList;
        setPrevChiefTable(detailsheader);
      }
    } catch (error) { }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "DateString",
      key: "DateString",
    },
    {
      title: "Medical Officer",
      dataIndex: "ProviderName",
      key: "ProviderName",
    },
  ];

  const columns1 = [
    {
      title: "Date and Time",
      dataIndex: "DateString",
      key: "1",
      width: 200,
    },
    {
      title: "Chief Complaint",
      dataIndex: "PresentingComplint",
      key: "2",
    },
  ];

  const handleDelete = async (record) => {
    debugger
    try {
      const response = await customAxios.delete(urlDeleteChief, {
        params: {
          Id: record.CFID,
          PatientId: Patient.Patient.PatientId,
          EncounterId: Patient.Patient.Encounter
        }
      });
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data;
        GetUpdate(detailsheader)
        message.success('Deleted')
      }
    } catch (error) { }
  }

  const handleEdit = async (record) => {
    debugger
    form.setFieldsValue({ 'CFID': record.CFID })
    form.setFieldsValue({ 'Complaint': record.PresentingComplint });
  }

  const GetUpdate = (value) => {
    debugger
    Patient.handleUpdate(value);
  }

  return (
    <>
      <Row gutter={32}>
        <Col span={18}>
          <Form
            layout="vertical"
            onFinish={async (value) => {
              debugger
              if (value.Complaint) {
                const chief = {
                  PresentingComplint: value.Complaint,
                  EncounterId: Patient.Patient.Encounter,
                  PatientId: Patient.Patient.PatientId,
                  CFID: value.CFID ? value.CFID : 0
                }
                try {
                  const response = await customAxios.post(urlChiefComplaints, chief, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (response.status === 200) {
                    message.success('Saved Success')
                    form.resetFields()
                    GetUpdate(response.data.data)
                  }
                } catch (error) { }
              } else {
                message.warning('No Data for Save')
              }
            }}
            // variant="outlined"
            form={form}>
            <Form.Item name='Complaint'>
              <TextArea
                rows={5}
                placeholder="Patient Complaints"
                allowClear
                onClear={() => form.resetFields()}
              />
            </Form.Item>
            <Form.Item name='CFID' hidden>
              <Input />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "1rem 0.5rem",
              }}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Col>
        <Col
          span={6}
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            size="middle"
            className="d-flex allignCenter"
            onClick={showModal}
          >
            Previous Complaints <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row >
      <Row>
        <Col span={18}>
          <CustomTable
            // actionColumn={false}
            dataSource={Patient.initialData.ChiefList}
            columns={columns1}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Col>
      </Row>
      <Modal
        title="Previous Complaints"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            Close
          </Button>,
        ]}
      >
        <div>
          <span>Previous Deatils : </span>
          <Select
            defaultValue={["lastOneMonth"]}
            placeholder="Select Range"
            style={{
              margin: "0.5rem",
              width: "40%",
            }}
            options={[
              {
                value: "previousAll",
                label: "Previous All",
              },
              {
                value: "lastOneWeek",
                label: "Last One Week",
              },
              {
                value: "last15days",
                label: "Last 15 Days",
              },
              {
                value: "lastOneMonth",
                label: "Last 1 Month",
              },
              {
                value: "lastThreeMonths",
                label: "Last 3 Months",
              },
              {
                value: "lastSixMonths",
                label: "Last 6 Months",
              },
              {
                value: "lastOneYear",
                label: "Last 1 Year",
              },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <span
                style={{
                  margin: 0,
                }}
              >
                {record.PresentingComplint}
              </span>
            ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={prevChiefTable}
        />
      </Modal>
    </>
  );
}

export default ChiefComplaint;

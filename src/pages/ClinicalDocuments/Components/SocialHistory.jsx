import { Button, Col, Input, Modal, Row, message, Form, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import { urlSaveSocial, urlGetSocailBasedonRange, urlDeleteSocial } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import CustomTable from "../../../components/customTable";

function SocialHistory(Patient) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prevSocialTable, setPrevSocialTable] = useState([])
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('Save')

  const showModal = async (params) => {
    debugger
    try {
      const response = await customAxios.get(
        `${urlGetSocailBasedonRange}?PatientId=${Patient.Patient.PatientId}&EncounterId=${0}&RangeString=${encodeURIComponent(params)}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.SocialHistoryList;
        setPrevSocialTable(detailsheader);
        setIsModalOpen(true);
      }
    } catch (error) { }
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
      title: "Social History",
      dataIndex: "Description",
      key: "2",
    },
  ];

  const handleDelete = async (record) => {
    debugger
    try {
      const response = await customAxios.delete(urlDeleteSocial, {
        params: {
          Id: record.HeaderId,
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
    form.setFieldsValue({ 'SHID': record.HeaderId })
    form.setFieldsValue({ 'SocialHistory': record.Description });
    setButtonTitle('Update')
  }

  function handleClr() {
    setButtonTitle('Save')
    form.resetFields()
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
              setLoading(true)
              debugger
              if (value.SocialHistory) {
                const Social = {
                  Description: value.SocialHistory,
                  HeaderId: value.SHID ? value.SHID : 0,
                  PatientId: Patient.Patient.PatientId,
                  EncounterId: Patient.Patient.Encounter,
                }
                try {
                  const response = await customAxios.post(urlSaveSocial, Social, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (response.status === 200) {
                    message.success('Saved Success')
                    handleClr()
                    GetUpdate(response.data.data)
                    setLoading(false)
                  }
                } catch (error) { }
              } else {
                message.warning('No Data for Save')
                setLoading(false)
              }
            }}
            // variant="outlined"
            form={form}>
            <Form.Item name='SocialHistory'>
              <TextArea
                rows={5}
                placeholder="Social Medical History"
                allowClear
              //   onChange={onChange}
              />
            </Form.Item>
            <Form.Item name='SHID' hidden>
              <Input></Input>
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "1rem 0.5rem",
              }}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {buttonTitle}
                </Button>
              </Form.Item>
              <Form.Item hidden={buttonTitle == 'Save' ? true : false}>
                <Button type="primary" onClick={handleClr}>
                  Clear
                </Button>
              </Form.Item>
            </div>
          </Form>
          {/* <TextArea rows={5} placeholder="Social History" allowClear />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem 0.5rem",
            }}
          >
            <Button type="primary">Save</Button>
          </div> */}
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
            onClick={() => showModal(dayjs().subtract(1, "month").format('DD-MM-YYYY'))}
          >
            Previous Social History
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={18}>
          <CustomTable
            // actionColumn={false}
            dataSource={Patient.initialData.SocialHistoryList}
            columns={columns1}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Col>
      </Row>
      <Modal
        title="Previous Social History"
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
          expandable={{
            expandedRowRender: (record) => (
              <span
                style={{
                  margin: 0,
                }}
              >
                {record.Description}
              </span>
            ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={prevSocialTable}
        />
      </Modal>
    </>
  );
}

export default SocialHistory;

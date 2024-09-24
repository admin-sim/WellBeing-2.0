import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { ColWithEightSpan } from "../../../../components/customGridColumns";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlEditBed, urlUpdateBed } from "../../../../../endpoints.js";

function EditBed() {
  const [form] = useForm();
  const [form1] = useForm();
  const [generateBedsModal, setGenerateBedsModal] = useState(false);
  const [tableData, setTableData] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const BedInfo = location.state;
  const [dropDown, setDropDown] = useState({
    FacilityDeptServiceLocation: [],
    Wards: [],
    ExistWards: []
  })

  useEffect(() => {
    debugger
    const fetchData = () => {
      if (BedInfo) {
        try {
          customAxios.get(`${urlEditBed}?WardId=${BedInfo.WardID}&ServiceLocationId=${BedInfo.ServiceLocationId}`).then((response) => {
            const apiData = response.data.data;
            if (response.status === 200 && apiData != null) {
              form.setFieldsValue({ 'Ward': BedInfo.WardName })
              form.setFieldsValue({ 'ServiceLocation': BedInfo.ServiceLocation })
              form.setFieldsValue({ 'WardID': BedInfo.WardID })
              form.setFieldsValue({ 'ServiceLocationId': BedInfo.ServiceLocationId })
              const newTable = apiData.BedModel.map((item, index) => {
                return {
                  ...item,
                  SlNo: index + 1,
                  key: index
                }
              })
              setTableData(newTable)
            }
          });
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    }
    fetchData()
  }, [])

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 80,
    },
    {
      title: "Bed Number",
      dataIndex: "BedNo",
      key: "2",
      width: 150,
      render: (text, record) => (
        <>
          <Form.Item name={[record.key, 'BedNo']} rules={[{ required: true, message: "Please enter" }]} initialValue={text}>
            <Input disabled={!!record.BedID} defaultValue={text} />
          </Form.Item>
          <Form.Item name={[record.key, 'BedID']} initialValue={record.BedID} hidden>
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      key: "3",
      width: 300,
      render: (text, record) => (
        <Form.Item name={[record.key, 'ActiveFlag']} initialValue={text}>
          <Select
            style={{ width: "50%" }}
            defaultValue={text}
            onChange={(value) => {
              const new1 = tableData.map((item) => {
                if (item.key === record.key) {
                  return {
                    ...item,
                    Status: value
                  }
                }
                return item
              })
              setTableData(new1)
            }}
            options={[
              {
                value: true,
                label: "Active",
              },
              {
                value: false,
                label: "Hidden",
              },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="link"
          icon={
            <PlusCircleOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={async () => {
                await form.validateFields()
                setTableData([
                  ...tableData,
                  { SlNo: tableData.length + 1, BedID: 0, BedNo: null, ActiveFlag: true, key: tableData.length },
                ]);
              }}
            />
          }
        />
      ),
      key: "4",
      width: 60,
    },
  ];

  const handleSubmit = async (values) => {
    debugger
    const bed = tableData.map((item) => {
      return {
        ...item,
        BedID: item.BedID,
        BedNo: values[item.key].BedNo,
        WardID: values.WardID,
        FacilityId: 1,
        ActiveFlag: values[item.key].ActiveFlag
      }
    })

    const response = await customAxios.post(urlUpdateBed, bed, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      if (response.data === 'Success') {
        message.success("Updated Success");
        navigate("/Bed")
      } else {
        message.warning(`${response.data} Bed is Already Exists`)
      }
    }
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Edit Bed"} button={false} />
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Select disabled />
              </Form.Item>
              <Form.Item hidden name="ServiceLocationId">
                <Input />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="Ward"
                label="Ward"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Select disabled />
              </Form.Item>
              <Form.Item hidden name="WardID">
                <Input />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          <Table columns={columns} dataSource={tableData} bordered />
          <Row gutter={16} justify="end" style={{ marginTop: "1.5rem" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Update
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={() => navigate("/Bed")}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          title="Generate Beds"
          open={generateBedsModal}
          maskClosable={false}
          footer={null}
        // onCancel={handleCancel}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form1}
            onFinish={handleSubmit}
          >
            <Row gutter={32}>
              <Col span={24}>
                <Form.Item
                  name="NumberOfBeds"
                  label="Number of Beds"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Number Of Beds",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="PrefixWith"
                  label="Prefix With"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Prefix With",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="StartingBedNo"
                  label="Starting Bed No"
                  rules={[
                    { required: true, message: "Please enter Starting Bed No" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32} justify="end" style={{ marginBottom: "-2rem" }}>
              <Col>
                <Form.Item>
                  <Button
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "1rem" }}
                  >
                    Generate
                  </Button>
                  <Button
                    size="middle"
                    type="default"
                    danger
                  // onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default EditBed;

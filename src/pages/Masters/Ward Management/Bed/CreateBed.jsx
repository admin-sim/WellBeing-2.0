import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { ColWithEightSpan } from "../../../../components/customGridColumns";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlCreateBed, urlGetWard, urlSaveNewBed } from "../../../../../endpoints.js";

function CreateBed() {
  const [form] = useForm();
  const [form1] = useForm();
  const [generateBedsModal, setGenerateBedsModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [dropDownLoading, setDropDownLoading] = useState(true)
  const [dropDown, setDropDown] = useState({
    FacilityDeptServiceLocation: [],
    Wards: [],
    ExistWards: []
  })

  const navigate = useNavigate();

  useEffect(() => {
    try {
      customAxios.get(urlCreateBed, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          setDropDown(apiData)
          setDropDownLoading(false)
        }
      });
    } catch (error) {
      console.error("Error fetching details:", error);
    }
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
      dataIndex: "BedNumber",
      key: "2",
      width: 150,
      render: (text, record) => (
        <>
          <Form.Item name={[record.key, 'BedNumber']}>
            <Input disabled defaultValue={text} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "3",
      width: 300,
      render: (text, record) => (
        <>
          <Form.Item name={[record.key, 'Status']}>
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
        </>
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
                setGenerateBedsModal(true);
              }}
            />
          }
        />
      ),
      key: "4",
      width: 60,
    },
  ];

  function handleCancel() {
    form1.resetFields();
    setGenerateBedsModal(false);
  }

  function handleSubmit(values) {
    console.log(values);
    const tableData = [];
    for (let i = 1; i <= values.NumberOfBeds; i++) {
      tableData.push({
        SlNo: i,
        BedNumber: `${values.PrefixWith}${values.StartingBedNo++}`,
        Status: true,
        key: i - 1
      });
      console.log(tableData);
    }
    setTableData(tableData);
    form1.resetFields();
    setGenerateBedsModal(false);
  }

  const handleLocation = (value) => {
    try {
      customAxios.get(`${urlGetWard}?ServiceLocationId=${value}`).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          setDropDown(prevState => ({
            ...prevState,
            Wards: response.data.data.Wards
          }));
        }
      });
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  const handleWard = (value) => {
    setTableData([])
    form1.resetFields()
    setShowTable(true)
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
        <PageHeader title={"Create Bed"} button={false} />
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            const bed = tableData.map((item) => {
              return {
                BedNo: item.BedNumber,
                WardId: values.Ward,
                FacilityId: 1,
                ActiveFlag: item.Status
              }
            })
            const response = await customAxios.post(urlSaveNewBed, bed, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.status === 200 && response.data.data != null) {
              if (response.data.data === 'Success') {
                message.success("Success");
                navigate("/Bed")
              } else {
                message.warning(`${response.data.data} Bed is Already Exists`)
              }
            }
          }}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Select onChange={handleLocation} loading={dropDownLoading}
                  onSelect={() => { form.setFieldsValue({ 'Ward': '' }), setTableData([]), form1.resetFields() }}>
                  {dropDown.FacilityDeptServiceLocation.map((option) => (
                    <Select.Option
                      key={option.FacilityDepartmentServiceLocationId}
                      value={option.FacilityDepartmentServiceLocationId}
                    >
                      {option.ServiceLocationName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="Ward"
                label="Ward"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Select loading={dropDownLoading} onSelect={handleWard}>
                  {(dropDown.Wards || [])
                    .filter(option => !dropDown.ExistWards?.some(existing => option.WardID === existing.WardId))
                    .map(option => (
                      <Select.Option
                        key={option.WardID}
                        value={option.WardID}
                      >
                        {option.WardName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          {showTable && <Table columns={columns} dataSource={tableData} bordered />}
          <Row gutter={16} justify="end" style={{ marginTop: "1.5rem" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Save
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
          onCancel={handleCancel}
          width={500}
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
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div >
    </>
  );
}

export default CreateBed;

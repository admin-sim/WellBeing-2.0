import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, message, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import CustomTable from "../../../../components/customTable";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlCreateDischargeClearanceSetup, urlEditDischargeClearanceSetup, urlSaveNewDischargeClearanceSetup, urlUpdateDischargeClearanceSetup } from "../../../../../endpoints.js";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import { BsFillPlusSquareFill } from "react-icons/bs";

function CreateEditDischargeClearanceSetup() {
  const [form] = useForm();
  const [dropDownLoading, setDropDownLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState()
  const initialData = [
    {
      key: 0,
      UserRole: ''
    }
  ]
  const [tableData, setTableData] = useState([]);
  const [dropDown, setDropDown] = useState({
    ClearanceType: [],
    PatientType: [],
    UserRoles: []
  })

  const location = useLocation();

  const record = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    try {
      customAxios.get(urlCreateDischargeClearanceSetup, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          setDropDown(apiData)
          setDropDownLoading(false)
        }
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, [])

  useEffect(() => {
    if (record) {
      setPageLoading(true)
      debugger
      try {
        customAxios.get(`${urlEditDischargeClearanceSetup}?Id=${record.DischargeClearanceSetupId}`).then((response) => {
          const apiData = response.data.data;
          const newTable = apiData.DischargeClearanceSetupRole.map((item, index) => {
            return {
              ...item,
              key: index,
              UserRole: item.UserRole
            }
          })
          setTableData(newTable)
          // DischargeClearanceSetupId
          apiData.DischargeClearanceSetupRole.map((item, index) => {
            form.setFieldsValue({
              [index]:
              {
                UserRole: item.UserRole,
                DischargeClearanceSetupApplicableRolesId: item.DischargeClearanceSetupApplicableRolesId,
                ActiveFlag: item.ActiveFlag
              }
            })
          })

          if (response.status === 200 && apiData != null) {
            const newData = apiData.NewDischargeClearanceSetupModel
            form.setFieldsValue({
              DischargeClearanceSetupId: newData.DischargeClearanceSetupId,
              ClearanceType: newData.ClearanceTypeId,
              ShortName: newData.ShortName,
              LongName: newData.LongName,
              ClearanceSequence: newData.ClearanceSequence,
              PatientType: newData.PatientTypeId,
              Status: newData.ActiveFlag,
              SelfAccess: newData.SelfAccess,
              Remarks: newData.Remarks
            });
          }
          setPageLoading(false)
        });
      } catch (error) {
        console.error("Error fetching purchase order details:", error);
      }
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const columns = [
    {
      title: "Applicable Roles",
      dataIndex: "UserRole",
      key: 'key',
      width: 150,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "UserRole"]}
            rules={[
              {
                required: true,
                message: "Please select Role",
              },
            ]}
            initialValue={record.UserRole}
          >
            <Select loading={dropDownLoading} placeholder='Please Select' allowClear>
              {dropDown.UserRoles?.map((option) => (
                <Select.Option
                  key={option.LookupID}
                  value={option.LookupID}
                >
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={[record.key, "DischargeClearanceSetupApplicableRolesId"]} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name={[record.key, "ActiveFlag"]} hidden>
            <Input />
          </Form.Item>
        </>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    debugger
    const Discharge = {
      ShortName: values.ShortName,
      LongName: values.LongName,
      ClearanceSequence: values.ClearanceSequence,
      ClearanceTypeId: values.ClearanceType,
      PatientTypeId: values.PatientType,
      ActiveFlag: values.Status,
      Remarks: values.Remarks,
      DischargeClearanceSetupId: values.DischargeClearanceSetupId
    }

    const newTable = tableData.map((item, index) => {
      if (values[index]) {
        return {
          ...item,
          UserRole: values[index].UserRole,
          DischargeClearanceSetupApplicableRolesId: values[index].DischargeClearanceSetupApplicableRolesId ? values[index].DischargeClearanceSetupApplicableRolesId : 0,
          ActiveFlag: values[index].ActiveFlag ? values[index].ActiveFlag : false
        }
      }
      return item
    })
    // const Details = []
    // for (let i = 0; i < tableData.length; i++) {
    //   if (values[i]) {
    //     const details = {
    //       UserRole: values[i].UserRole,
    //       DischargeClearanceSetupApplicableRolesId: values[i].DischargeClearanceSetupApplicableRolesId ? values[i].DischargeClearanceSetupApplicableRolesId : 0,
    //       ActiveFlag: values[i].ActiveFlag ? values[i].ActiveFlag : false
    //     }
    //     Details.push(details)
    //   }
    // }

    const DischargeViewModel = {
      NewDischargeClearanceSetupModel: Discharge,
      DischargeClearanceSetupDetails: newTable
    }

    const url = Discharge.DischargeClearanceSetupId ? urlUpdateDischargeClearanceSetup : urlSaveNewDischargeClearanceSetup
    const response = await customAxios.post(url, DischargeViewModel, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.data != null) {
      if (response.data.data === 'Success') {
        message.success("Success");
        navigate('/DischargeClearanceSetup')
      } else {
        message.warning('Clearance Type for this patient type already exists.')
      }
    }
  }

  function handleDelete(record) {
    debugger
    const newData = tableData.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setTableData(newData);
  }

  if (pageLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
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
        <PageHeader
          title={
            record
              ? "Edit Discharge Clearance Setup"
              : "Create Discharge Clearance Setup"
          }
          button={false}
        />
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            Status: true,
            // ClearanceSequence: 0,
            SelfAccess: false
          }}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                name="ShortName"
                label="Short Name"
                rules={[{ required: true, message: "Please enter Short Name" }]}
              >
                <Input allowClear />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="LongName"
                label="Long Name"
                rules={[{ required: true, message: "Please enter Long Name" }]}
              >
                <Input allowClear />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item name="Remarks" label="Remarks">
                <TextArea rows={2} allowClear />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithSixSpan>
              <Form.Item
                name="ClearanceType"
                label="Clearance Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Clearance Type",
                  },
                ]}
              >
                <Select loading={dropDownLoading} placeholder='Please Select' allowClear>
                  {dropDown.ClearanceType?.map((option) => (
                    <Select.Option
                      key={option.LookupID}
                      value={option.LookupID}
                    >
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ClearanceSequence" label="Clearance Sequence"
                rules={[{ required: true, message: "Please enter Short Name" }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Status" label="Status"
                rules={[
                  {
                    required: true,
                    message: "Please select Status",
                  },
                ]}
              >
                <Select allowClear placeholder='Please Select'
                  style={{ width: "100%" }}
                  //   onChange={handleChange}
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
              <Form.Item name="DischargeClearanceSetupId" hidden>
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="PatientType" label="Patient Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Patient Type",
                  },
                ]}
              >
                <Select loading={dropDownLoading} placeholder='Please Select' allowClear>
                  {dropDown.PatientType?.map((option) => (
                    <Select.Option
                      key={option.LookupID}
                      value={option.LookupID}
                    >
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="SelfAccess" valuePropName='checked'>
                <Checkbox>Is Self Access Only</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row gutter={16}>
            <ColWithEightSpan>
              <CustomTable
                columns={columns}
                dataSource={tableData.length > 0 ? tableData.filter((item) => item.ActiveFlag !== false) : initialData}
                onDelete={handleDelete}
                actionColumnName={
                  <Button
                    type="link"
                    icon={
                      <BsFillPlusSquareFill
                        style={{ fontSize: "1.5rem" }}
                        onClick={async () => {
                          await form.validateFields([[tableData.length - 1, 'UserRole']]);
                          setTableData([
                            ...tableData,
                            { key: tableData.length, UserRole: '' },
                          ]);
                        }}
                      />
                    }
                  />
                }
              />
            </ColWithEightSpan>
          </Row>
          <Row gutter={16} justify="end">
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  {record ? "Update" : "Save"}
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={() => navigate("/DischargeClearanceSetup")}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default CreateEditDischargeClearanceSetup;

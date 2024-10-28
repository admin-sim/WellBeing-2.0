import { Button, Col, DatePicker, message, Form, Input, Row, Table, AutoComplete, InputNumber, Select, Descriptions } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CustomTable from "../../../components/customTable";
import { render } from "react-dom";
import customAxios from "../../../components/customAxios/customAxios";
import { urlGetAllIcd, urlSaveDiagnosis, urlGetAllDiagnosis, urlEditDiagnosis, urlDeleteDiagnosis } from "../../../../endpoints";

function ProvisionalDiagnosis(Patient) {
  const [productOptions, setProductOptions] = useState([]);
  const [form] = useForm();
  const initialData = [{ key: 0, name: "ICDCode", ICDCode: '', ActiveFlag: true }]
  const [data, setData] = useState(initialData)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    async function fetch() {
      const response = await customAxios.get(`${urlGetAllDiagnosis}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&$Range=${dayjs()}`)
      if (response.status == 200) {
        const groupedData = [];
        response.data.data.ClinicalAdvices.forEach((item) => {
          const existingWard = groupedData.find(
            (icd) => icd.ADID === item.ADID
          );

          if (existingWard) {
            existingWard.Details.push(item.ICD_Code + '-' + item.ICD_Desc);
          } else {
            groupedData.push({
              ...item,
              Details: [item.ICD_Code + '-' + item.ICD_Desc]
            });
          }
        });

        const newData = groupedData.map((icd, index) => ({
          ...icd,
          key: index + 1,
          Details: icd.Details.join(', '),
        }));
        setTableData(newData);
      }
    }
    fetch()
  }, [])

  const handleSearch = async (searchText) => {
    debugger;
    if (searchText) {
      const response = await customAxios.get(
        `${urlGetAllIcd}?Product=${searchText}`
      );
      const apiData = response.data.data;
      const newdata = apiData.map((item) => {
        return {
          label: item.IcdCode + ' - ' + item.IcdDescription,
          Description: item.IcdDescription,
          value: item.IcdCode,
          id: item.IcdCode,
        };
      });
      setProductOptions(newdata);
    }
  };

  const handleInputChange = async (value, record, option) => {
    debugger
    const newdata = data.map((item) => {
      if (item.key == record.key) {
        return {
          ...item,
          ICDCode: option.value,
          Description: option.Description,
        };
      }
      return {
        ...item
      }
    });
    setData(newdata);
    form.setFieldsValue({ [record.key]: { Description: option.Description } });
  };

  const columns = [
    {
      title: `ICD Code`,
      key: 'ICDCode',
      dataIndex: 'ICDCode',
      render: (_, record) => {
        return <Form.Item style={{ width: "100%" }} name={[record.key, 'ICDCode']}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <AutoComplete
            // disabled={!!record.PrescriptionLineId}
            options={productOptions}
            onSearch={handleSearch}
            onSelect={(value, option) =>
              handleInputChange(value, record, option)
            }
          />
        </Form.Item>
      }
    },
    {
      title: `Description`,
      key: 'Description',
      dataIndex: 'Description',
      render: (_, record) => {
        return <Form.Item style={{ width: "100%" }} name={[record.key, 'Description']}>
          <Input />
        </Form.Item>
      }
    }
  ]

  function handleAddRow() {
    debugger
    const newData = {
      key: data.length + 1,
      name: `ICDCode`,
      ActiveFlag: true
    };
    setData([...data, newData]);
  };

  function handleDelete(record) {
    debugger
    const newData = data.map((item) => {
      if (item.key == record.key) {
        return {
          ...item, ActiveFlag: false
        }
      }
      return item
    })
    setData(newData)
  }

  const columns1 = [
    {
      title: `Date`,
      key: 'DiagDate',
      dataIndex: 'DiagDate',
    },
    {
      title: `Time`,
      key: 'Diagnosis_time',
      dataIndex: 'Diagnosis_time',
    },
    {
      title: `Description`,
      key: 'Diagnosis_Desc',
      dataIndex: 'Diagnosis_Desc',
    },
    {
      title: `Follow Up`,
      key: 'Follow_Up',
      dataIndex: 'Follow_Up',
    },
    {
      title: `ICD Details`,
      key: 'Details',
      dataIndex: 'Details',
    }
  ]

  async function handleDelete1(params) {
    debugger
    const response = await customAxios.delete(`${urlDeleteDiagnosis}?id=${params.ADID}&PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}`)
    if (response.status == 200) {
      // setTableData(response.data.data.ClinicalAdvices)
      const groupedData = [];
      response.data.data.ClinicalAdvices.forEach((item) => {
        const existingWard = groupedData.find(
          (icd) => icd.ADID === item.ADID
        );

        if (existingWard) {
          existingWard.Details.push(item.ICD_Code + '-' + item.ICD_Desc);
        } else {
          groupedData.push({
            ...item,
            Details: [item.ICD_Code + '-' + item.ICD_Desc]
          });
        }
      });

      const newData = groupedData.map((icd, index) => ({
        ...icd,
        key: index + 1,
        Details: icd.Details.join(', '),
      }));
      setTableData(newData);
    }
  }

  async function handleEdit(params) {
    debugger
    const response = await customAxios.get(`${urlEditDiagnosis}?id=${params.ADID}`)
    if (response.status == 200) {
      const apiData = response.data.data
      form.setFieldsValue({
        DiagnosisDate: dayjs(dayjs(apiData[0].DiagDate, 'DD-MM-YYYY')),
        DiagnosisDescription: apiData[0].Diagnosis_Desc,
        FollowUp: apiData[0].Follow_Up,
        ADID: apiData[0].ADID
      })
      const newData = apiData.map((item, index) => {
        return {
          key: index,
          ICDCode: item.ICD_Code,
          Description: item.ICD_Desc,
          ActiveFlag: true
        }
      })
      setData(newData)
      apiData.map((item, index) => {
        form.setFieldsValue({
          [index]:
          {
            ICDCode: item.ICD_Code,
            Description: item.ICD_Desc
          }
        })
      })
    }
  }

  function handleClear() {
    setData(initialData)
    form.resetFields()
  }

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>
        Provisional Diagnosis
      </span>
      <Row>
        <Col span={18} style={{ margin: "1rem" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              debugger
              const icd = []
              const diagnosis = {
                DiagDate: values.DiagnosisDate.format('DD-MM-YYYY'),
                Diagnosis_Desc: values.DiagnosisDescription,
                Diagnosis_time: values.DiagnosisDate.format('HH:mm:ss'),
                EncounterId: Patient.Patient.Encounter,
                PatientId: Patient.Patient.PatientId,
                Follow_Up: values.FollowUp.toString(),
                ADID: values.ADID ? values.ADID : 0
              }
              data.map((item) => {
                if (item.ActiveFlag == true) {
                  const i = {
                    IcdCode: item.ICDCode,
                    IcdDescription: item.Description
                  }
                  icd.push(i)
                }
              })
              const response = await customAxios.post(urlSaveDiagnosis, { ClinicalAdvice: diagnosis, icdcode: icd }, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              if (response.status == 200) {
                form.resetFields()
                setData(initialData)
                const groupedData = [];
                response.data.data.ClinicalAdvices.forEach((item) => {
                  const existingWard = groupedData.find(
                    (icd) => icd.ADID === item.ADID
                  );

                  if (existingWard) {
                    existingWard.Details.push(item.ICD_Code + '-' + item.ICD_Desc);
                  } else {
                    groupedData.push({
                      ...item,
                      Details: [item.ICD_Code + '-' + item.ICD_Desc]
                    });
                  }
                });

                const newData = groupedData.map((icd, index) => ({
                  ...icd,
                  key: index + 1,
                  Details: icd.Details.join(', '),
                }));
                setTableData(newData);
              }
            }}
            initialValues={{
              DiagnosisDate: dayjs(),
              ADID: 0
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label='Diagnosis Date' name='DiagnosisDate'
                  rules={[
                    {
                      required: true,
                      message: 'please Pick Date'
                    }
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "hh:mm A" }}
                    format="DD-MM-YYYY , hh:mm A"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='Diagnosis Description' name='DiagnosisDescription'>
                  <Input allowClear />
                </Form.Item>
                <Form.Item hidden name='ADID'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='Next Follow Up After' name='FollowUp'>
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <CustomTable columns={columns} dataSource={data.filter((item) => item.ActiveFlag == true)}
              actionColumnName={<PlusOutlined onClick={handleAddRow} />} onDelete={handleDelete}
              actionColumn={true} />
            <Form.Item>
              <Button type="primary" size="middle" htmlType="submit">
                {/* {form.getFieldValue('ADID') ? 'Save Provisional Diagnosis' : 'Update Provisional Diagnosis'} */}
                Save Provisional Diagnosis
              </Button>&nbsp;&nbsp;
              <Button type="basic" size="middle" onClick={handleClear}>
                Clear
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          span={5}
          style={{
            margin: "0 0 0 0.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ borderRadius: "1rem" }}
            size="middle"
            className="d-flex allignCenter"
            disabled
          >
            Previous Provisional Diagnosis
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row >
      <CustomTable columns={columns1} dataSource={tableData}
        onDelete={handleDelete1} onEdit={handleEdit}
        actionColumn={true} />
    </>
  );
}

export default ProvisionalDiagnosis;

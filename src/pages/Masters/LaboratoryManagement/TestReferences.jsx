import React, { useState, useRef, useEffect } from "react";

import Layout from "antd/es/layout/layout";
import {
  Spin,
  Skeleton,
  Tag,
  InputNumber,
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  Card,
  message,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';

import { v4 as uuidv4 } from "uuid";
import {
  urlTestReferencesIndex,
  urlSaveTestReference,
  urlLoadTestReferenceGrid,
  urlEditTestRef,
  urlDeleteTestRef,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import TextArea from "antd/es/input/TextArea";
import CustomTable from "../../../components/customTable";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const TestMethods = () => {
  const [testReferenceIndex, setReferenceIndex] = useState({
    SingleTests: [],
    Gender: [],
    Durations: [],
    ListTestMethodModel: [],
  });
  const [form] = Form.useForm();

  
  const { Title } = Typography;

  const [filteredData, setFilteredData] = useState([]);
  const [testReferenceId, setTestReferenceId] = useState(0);
  const [disable, setDisable] = useState(false);
  const [disableHeader, setDisableHeader] = useState(false);

  useEffect(() => {
    try {
      customAxios.get(urlTestReferencesIndex).then((response) => {
        debugger;
        const apiData = response.data.data;

        setReferenceIndex(apiData);
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
  }, []);
  useEffect(() => {
    if (testReferenceIndex.Gender?.length > 0) {
      form.setFieldsValue({ Gender: testReferenceIndex.Gender[0].LookupID });
    }
    if (testReferenceIndex.Durations?.length > 0) {
      form.setFieldsValue({
        PeriodsId: testReferenceIndex.Durations[0].LookupID,
      });
    }
  }, [testReferenceIndex]);

  const LoadTestReferenceGrid = async () => {
    debugger;
    const values = form.getFieldsValue();
    const mth = values.TestMethodId ? values.TestMethodId : "";
    const response = await customAxios.get(
      `${urlLoadTestReferenceGrid}?TestId=${values.TestId}&TestMethodId=${mth}&GenderId=${values.Gender}`
    );
    if (response.status === 200 && response.data != null) {
      const apiData = response.data.ListTestReferenceModel.map(
        (item, index) => ({
          ...item,
          key: uuidv4(),
        })
      );
      setFilteredData(apiData);
    }
  };

  const onFinish = async (values) => {
    debugger;
    const postData = {
      TestRefId:testReferenceId > 0 ? testReferenceId : 0,
      TestId: values.TestId,
      TestMethodId: values.TestMethodId ? values.TestMethodId : null,
      PeriodsID: values.PeriodsId,
      FromAge: values.FromAge,
      ToAge: values.ToAge,
      Low: values.Low,
      High: values.High,
      Description: values.Description,
      Gender: values.Gender,
      OperatorType: values.OperatorType,
    };
    const response = await customAxios.post(urlSaveTestReference, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 && response.data != null) {
      message.success(response.data.data.Status);
      form.setFieldsValue({
        High: null, // Reset specific field to null or any default value
        PeriodsId: testReferenceIndex?.Durations[0].LookupID,
        FromAge:null,
        ToAge: null,
        OperatorType: "<>",
        Low:null,
        Description:null
      });
      setTestReferenceId(0);
      EnableHeaderInputs();
      LoadTestReferenceGrid();
    }
  };

  const handletest = (value) => {
    debugger;

    LoadTestReferenceGrid();
  };

  const handleDelete =async (value) => {
    const response = await customAxios.delete(
      `${urlDeleteTestRef}?TestId=${value.TestId}&TestRefId=${value.TestRefId}`
    );
    if(response.status===200){
      setTestReferenceId(0);
      message.success(response.data.data.Status);
      LoadTestReferenceGrid();
    }
  };

  const handleEdit =async (value) => {
    debugger;
    const response = await customAxios.get(
      `${urlEditTestRef}?TestId=${value.TestId}&TestRefId=${value.TestRefId}`
    );
    if(response.status===200){
      const data=response.data.data.TestReferenceModel;
      form.setFieldsValue({
        High: data.High, // Reset specific field to null or any default value
        PeriodsId:data.PeriodsID,
        FromAge:data.FromAge,
        ToAge: data.ToAge,
        OperatorType:data.OperatorType,
        Low:data.Low,
        Description:data.Description
      });
      setTestReferenceId(data.TestRefId);
      setDisable(data.OperatorType !== '<>');
      DisableHeaderInputs();
    }

  };


  const DisableHeaderInputs =()=>{
    setDisableHeader(true);
  }
  const EnableHeaderInputs =()=>{
    setDisableHeader(false);
  }

  const columns = [
    {
      title: "Duration",
      dataIndex: "PeriodName",
    },
    {
      title: "From Age",
      dataIndex: "FromAge",
    },
    {
      title: "To Age",
      dataIndex: "ToAge",
    },
    {
      title: "Low",
      dataIndex: "Low",
    },
    {
      title: "High",
      dataIndex: "High",
    },
    {
      title: "Description",
      dataIndex: "Description",
    },
  ];
  const filterOption = (input, option) =>
    option.children.toLowerCase().includes(input.toLowerCase());

  const handleOperatorChange =(value)=>{
    debugger;
    setDisable(value !== '<>');

  }

  return (
    <Layout style={{ zIndex: "999999999" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <Row
          style={{
            padding: "0.5rem 2rem 0.5rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0px 0px ",
          }}
        >
          <Col span={16}>
            <Title
              level={4}
              style={{
                color: "white",
                fontWeight: 500,
                margin: 0,
                paddingTop: 0,
              }}
            >
              Test Reference Management
            </Title>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              OperatorType: "<>",

            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="TestId"
                  label="Tests"
                  rules={[{ required: true, message: "Please select Payer " }]}
                >
                  <Select
                  disabled={disableHeader}
                    filterOption={filterOption} // Add this line to enable searching
                    showSearch
                    onChange={handletest}
                  >
                    {testReferenceIndex.SingleTests?.map((option) => (
                      <Select.Option
                        key={option.ServiceId}
                        value={option.ServiceId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item name="TestMethodId" label="Method Name">
                  <Select disabled={disableHeader} allowClear onChange={handletest}>
                    {testReferenceIndex.ListTestMethodModel?.map((option) => (
                      <Select.Option
                        key={option.TestMethodID}
                        value={option.TestMethodID}
                      >
                        {option.MethodName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="Gender"
                  label="Gender"
                  initialValue={
                    testReferenceIndex?.Gender?.length > 0
                      ? testReferenceIndex.Gender[0].LookupID
                      : undefined
                  }
                >
                  <Select disabled={disableHeader} onChange={handletest}>
                    {testReferenceIndex.Gender.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row
              gutter={16}
              style={{
                backgroundColor: "#EAEAEC",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
            >
              <Col className="gutter-row" span={6}>
                <Form.Item label="Durations" name="PeriodsId">
                  <Select>
                    {testReferenceIndex.Durations.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="FromAge"
                  label="From Age"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber allowClear min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="ToAge"
                  label="To Age"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber allowClear min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="OperatorType" label="Operators">
                  <Select onChange={handleOperatorChange}>
                    <Select.Option value="<>">between (&lt;&gt;)</Select.Option>
                    <Select.Option value="<">less Than (&lt;)</Select.Option>
                    <Select.Option value=">">greater Than (&gt;)</Select.Option>
                    <Select.Option value="<=">
                      less Than or Equal (&lt;=)
                    </Select.Option>
                    <Select.Option value=">=">
                      greater Than or Equal (&gt;=)
                    </Select.Option>
                    <Select.Option value="==">equals to (==)</Select.Option>
                    <Select.Option value="!=">not equals to (!=)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="Low"
                  label="Low"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item  name="High" label="High">
                  <InputNumber disabled={disable} min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="Description" label="Description">
                  <TextArea />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: 30 }}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <CustomTable
          dataSource={filteredData}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </Layout>
  );
};

export default TestMethods;

import React, { useState, useRef, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
  DatePicker,
  Card,
  Divider,
  Tooltip,
  Table,
  AutoComplete,
  message,
  Popconfirm,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import {
  urlTestMethodIndex,
  urlLoadTestMethodGridData,
  urlSaveTestMethod,
  urlDeleteTestMethod,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";

const TestMethods = () => {
  const [subTestMappingIndex, setSubTestMappingIndex] = useState({
    AllDiagnosticTests: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const { Title } = Typography;
  const hasEffectRun = useRef(false);

  useEffect(() => {
    if (!hasEffectRun.current) {
      try {
        customAxios.get(urlTestMethodIndex).then((response) => {
          debugger;
          const apiData = response.data.data;
          const MainOptions = apiData.AllDiagnosticTests.map((item) => ({
            value: item.ServiceId,
            label: item.LongName,
          }));
          setSubTestMappingIndex((prevState) => ({
            ...prevState,
            AllDiagnosticTests: [
              ...prevState.AllDiagnosticTests,
              ...MainOptions,
            ],
          }));
        });
      } catch (error) {
        //console.error("Error fetching purchase order details:", error);
      }
      hasEffectRun.current = true;
    }
  }, []);

  const onFinish = async (values) => {
    debugger;

    const TestMethodModel = {
      TestId: values.Tests,
      MethodName: values.MethodsName,
      Unit: values.Unit,
    };

    const postData = {
      TestMethodModel: TestMethodModel,
    };
    const response = await customAxios.post(urlSaveTestMethod, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    message.success(response.data.data.Status);
    onChange(values.Tests);
    form.resetFields(["MethodsName", "Unit"]);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (value) => {
    debugger;
    if (value) {
      try {
        customAxios
          .get(`${urlLoadTestMethodGridData}?TestId=${value}`)
          .then((response) => {
            debugger;
            const apiData = response.data.data.ListTestMethodModel;
            setFilteredData(apiData);
          });
      } catch (error) {
        //console.error("Error fetching purchase order details:", error);
      }
    }else{
        form.resetFields();
        setFilteredData([]);
    }
  };

  const handleDelete = (row) => {
    debugger;
    try {
      customAxios
        .delete(`${urlDeleteTestMethod}?testmethodId=${row.TestMethodID}`)
        .then((response) => {
          debugger;
          if (response.data.data.Status == "Failed To Delete Record.") {
            message.error(response.data.data.Status);
          } else {
            message.success(response.data.data.Status);
          }
          onChange(row.TestID);
          form.setFieldsValue({ MethodsName: undefined });
          form.setFieldsValue({ Unit: undefined });
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
  };

  const columns = [
    {
      title: "Method Name",
      dataIndex: "MethodName",
    },
    {
      title: "Unit",
      dataIndex: "Unit",
    },
  ];

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
              Test Method Management
            </Title>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  label="Tests"
                  name="Tests"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={onChange}
                    // onSearch={onSearch}
                    filterOption={filterOption}
                    options={subTestMappingIndex.AllDiagnosticTests}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="MethodsName"
                  label="Method Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="Unit" label="Unit">
                  <Input allowClear placeholder="Ex: mg/dl" />
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
          isFilter={true}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default TestMethods;

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
  Checkbox,
  message,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import {
  urlLoadContInfoGrid,
  urlLoadSubTestMapGridData,
  urlUpdateContainerInfo,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { render } from "react-dom";
import FormItem from "antd/es/form/FormItem/index.js";
import TextArea from "antd/es/input/TextArea";
import PageHeader from "../../../components/PageHeader";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const ContainerDefinition = () => {
  const [subTestMappingIndex, setSubTestMappingIndex] = useState({
    SingleTests: [],
    Gender: [],
    Durations: [],
    ListTestMethodModel: [],
  });
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);
  const { Title } = Typography;
  const hasEffectRun = useRef(false);

  useEffect(() => {
    if (!hasEffectRun.current) {
      try {
        customAxios.get(urlLoadContInfoGrid).then((response) => {
          debugger;
          const apiData = response.data.data;
          setFilteredData(apiData);
          setUpdatedData(apiData);
        });
      } catch (error) {
        //console.error("Error fetching purchase order details:", error);
      }
      hasEffectRun.current = true;
    }
  }, []);

  const navigate = useNavigate();

  const handleCancel = () => {
    setFilteredData(updatedData);
  };

  const onFinish = async (values) => {
    debugger;
    setIsSearchLoading(true);
    setLoading(true);
    const updatedRecord = filteredData.filter((item) =>
      updatedData.some((i) =>
        i.CDID === item.CDID ? i.IsActive !== item.IsActive : false
      )
    );
    if (updatedRecord.length === 0) {
      message.warning("No changes made to the container definition.");
      setLoading(false);
      return;
    }
    try {
      customAxios
        .post(urlUpdateContainerInfo, updatedRecord, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          debugger;
          if (response.data.data === "Data Updated Successfully.") {
            message.success("Container Definition updated successfully");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSearchLoading(false);
  };

  function handleCheck(e, record) {
    debugger;
    const { checked } = e.target;
    const updatedData = filteredData.map((item) => {
      if (item.CDID === record.CDID) {
        return { ...item, IsActive: checked };
      }
      return item;
    });
    setFilteredData(updatedData);
  }

  const columns = [
    {
      title: "Container ID",
      dataIndex: "CDID",
      key: "CDID",
    },
    {
      title: "Container Name",
      dataIndex: "ContainerName",
      key: "ContainerName",
    },
    {
      title: "Container Value",
      dataIndex: "ValuesName",
      key: "ValuesName",
    },
    {
      title: "Is Active",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (IsActive, record) => (
        <Checkbox checked={IsActive} onChange={(e) => handleCheck(e, record)} />
      ),
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
        <PageHeader title={"Container Definition"} button={false} />
        <Form
          form={form}
          layout="vertical"
          variant="outlined"
          style={{
            margin: "1rem",
          }}
          initialValues={{
            FromDate: dayjs().subtract(1, "day"),
            ToDate: dayjs(),
            DocumentType: 0,
            GRNStatus: "",
          }}
          onFinish={onFinish}
        >
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              onChange: (current, pageSize) => {
                setPage(current);
                setPaginationSize(pageSize);
              },
              defaultPageSize: 10,
              hideOnSinglePage: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            rowKey={(row) => row.AppUserId}
            size="small"
            bordered
          />
          <Row justify="end" style={{ padding: "0rem 1rem" }}>
            <Col style={{ marginRight: "10px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default ContainerDefinition;

import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  AutoComplete,
  Spin,
  Tag,
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
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import CustomTable from "../../components/customTable/index.jsx";
import {
  urlGetPurshaseOrderDetails,
  urlSearchPatientIssue,
  urlSearchUHID,
  urlGetLastEncounter,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PatientIssue = () => {
  const [PatientIssueDropdown, setPatientIssueDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
    Patient: [],
  });
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isTable, setIsTable] = useState(false);
  const { Title } = Typography;
  const [patientName, setPatientName] = useState();
  const [encounter, setEncounter] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPatientIssueDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
  }, []);

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
  };

  const handleIndentId = (text, record, index) => {
    const IndentId = record.IndentId;
    if (record.Exists == "Exists") {
      alert(
        "Indent Issue with same Indent Number already exists!!Please finalize previous Indent Issue."
      );
    } else {
      navigate("/UpdatePatientIssue", { state: { IndentId } });
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "Issue Number",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "IndentNumber",
      sorter: (a, b) => a.IndentNumber.localeCompare(b.IndentNumber),
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (
          (record.IndentStatus == "Pending" ||
            record.IndentStatus == "Partially Pending" ||
            record.IndentStatus == "Completed") &&
          record.IssueStatus != "Finalize"
        ) {
          return (
            <Button
              type="link"
              onClick={() => handleIndentId(text, record, index)}
            >
              {text}
            </Button>
          );
        } else if (
          record.IssueStatus == "Finalize" ||
          record.IndentStatus == "Completed"
        ) {
          return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
        }
      },
    },
    {
      title: "Order Date",
      dataIndex: "IndentDate",
      key: "IndentDate",
      sorter: (a, b) => new Date(a.IndentDate) - new Date(b.IndentDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
      sorter: (a, b) => a.UhId.localeCompare(b.UhId),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
      sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Order By",
      // dataIndex: "OrderBy",
      // key: "OrderBy",
      // sorter: (a, b) => a.OrderBy.localeCompare(b.OrderBy),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Priority",
      dataIndex: "IndentType",
      key: "IndentType",
      sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
      key: "IndentStatus",
      sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issue Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
      sortDirections: ["descend", "ascend"],
    },
    {
      render: (_, row) => <Button type="link">Report</Button>,
    },
  ];

  const getPanelValue = async (searchText) => {
    try {
      customAxios
        .get(`${urlSearchUHID}?Uhid=${searchText}`)
        .then((response) => {
          const apiData = response.data.data;
          const newOptions = apiData.map((item) => ({
            value: item.UhId,
            key: item.UhId,
            PatientId: item.PatientId,
            Name: item.PatientFirstName + " " + item.PatientLastName,
          }));
          setAutoCompleteOptions(newOptions);
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
  };

  const handleSelect = (value, option) => {
    form.setFieldsValue({ PatientName: option.Name });
    form.setFieldsValue({ PatientId: option.PatientId });
    setPatientName(option.Name);
    try {
      customAxios
        .get(`${urlGetLastEncounter}?Uhid=${option.key}`)
        .then((response) => {
          const apiData = response.data.data;
          if (apiData.length > 0) {
            setEncounter(apiData);
            form.setFieldsValue({ Encounter: apiData[0].EncounterId });
            form.setFieldsValue({ PatientId: option.PatientId });
          } else {
            setEncounter([]);
            form.setFieldsValue({ Encounter: "" });
            form.setFieldsValue({ PatientId: "" });
          }
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
  };

  const handleUHId = (value) => {
    if (value == undefined) {
      setEncounter([]);
      form.setFieldsValue({ Encounter: undefined });
      form.setFieldsValue({ PatientId: undefined });
      form.setFieldsValue({ PatientName: undefined });
    }
  };
  const disableFromDate = (current) => {
    // Disable dates that are after today
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableToDate = (current) => {
    // Disable dates that are before the selected fromDate or after today
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const onFinish = async (values) => {
    debugger;
    setLoading(true);
    // const postData1 = {
    //   IssueNumber: values.OrderId ? values.OrderId : "" ,
    //   IndentNumber: values.IndentNumber ?  values.IndentNumber : "" ,
    //   IndentType: values.IndentType ?  values.IndentType : "",
    //   IssueingStoreId: values.IssuingStore ? values.IssuingStore : "",
    //   PatientType: values.PatientType ? values.PatientType : "",
    //   FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
    //   ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
    //   PatientId: values.PatientId ? values.PatientId  : "" ,
    //   EncounterId: values.Encounter ? values.Encounter : "",
    //   PatientName: values.PatientName  ?  values.PatientName  : "",
    //   IndentStatus: values.IndentStatus  ? values.IndentStatus : "",
    //   IssueStatus: values.IssueStatus ? values.IssueStatus : "",
    // };
    // try {
    //   const response = await customAxios.post(urlSearchPatientIssue, postData1);
    //   const ApiData = response.data.data.newIndentIssueModel.filter(
    //     (item) =>
    //       item.IndentStatus != "Created" &&
    //       item.IndentCategory == "PatientIndent"
    //   );
    //   const ApiData1 = ApiData.map((item, index) => {
    //     return {
    //       ...item,
    //       key: index + 1,
    //     };
    //   });
    //   setFilteredData(ApiData1);
    // } catch (error) {}
    try {
      const postData1 = {
        IssueNumber: values.IssueNumber ? values.IssueNumber : "",
        IndentNumber: values.IndentNumber ? values.IndentNumber : "",
        IndentType: values.IndentType ? values.IndentType : "",
        IssueingStoreId: values.IssuingStore ? values.IssuingStore : "",
        PatientType: values.PatientType ? values.PatientType : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        PatientId: values.PatientId ? values.PatientId : "",
        EncounterId: values.Encounter ? values.Encounter : "",
        PatientName: values.PatientName ? values.PatientName : "",
        IndentStatus: values.IndentStatus ? values.IndentStatus : "",
        IssueStatus: values.IssueStatus ? values.IssueStatus : "",
      };
      customAxios
        .get(
          `${urlSearchPatientIssue}?IndentNumber=${postData1.IndentNumber}&IssueNumber=${postData1.IssueNumber}&IndentType=${postData1.IndentType}&PatientType=${postData1.PatientType}&IssuingStoreId=${postData1.IssueingStoreId}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}&PatientId=${postData1.PatientId}&EncounterId=${postData1.EncounterId}&PatientName=${postData1.PatientName}&IssueStatus=${postData1.IssueStatus}&IndentStatus=${postData1.IndentStatus}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const ApiData = response.data.data.newIndentIssueModel.filter(
            (item) =>
              item.IndentStatus != "Created" &&
              item.IndentCategory == "PatientIndent"
          );
          const ApiData1 = ApiData.map((item, index) => {
            return {
              ...item,
              key: index + 1,
            };
          });
          setFilteredData(ApiData1);
          setLoading(false);
        })
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

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
              Patient Issue
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
            initialValues={{
              FromDate: dayjs().subtract(1, "day"),
              ToDate: dayjs(),
              IndentType: 0,
              PatientType: 0,
              IndentStatus: 0,
              IssueStatus: 0,
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Issuing Store" name="IssuingStore">
                  <Select allowClear placeholder="Select Value">
                    {PatientIssueDropdown.StoreDetails.map((option) => (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="UHID" label="UHID">
                  <AutoComplete
                    options={autoCompleteOptions}
                    onSearch={getPanelValue}
                    onSelect={(value, option) => handleSelect(value, option)}
                    onChange={handleUHId}
                    placeholder="Search for a Uhid"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="PatientName" label="Patient Name">
                  <Input
                    disabled={!!form.getFieldValue("PatientId")}
                    allowClear
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item name="Encounter" label="Encounter">
                  <Select
                    allowClear
                    disabled={encounter.length > 1 ? false : true}
                  >
                    {encounter.map((option) => (
                      <Select.Option
                        key={option.EncounterId}
                        value={option.EncounterId}
                      >
                        {option.GeneratedEncounterId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="IssueNumber" label="OrderId">
                  <Input allowClear style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item label="Indent Number" name="IndentNumber">
                  <Input allowClear style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Indent Type" name="IndentType">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option
                      key="Effective"
                      value="Effective"
                    ></Select.Option>
                    <Select.Option
                      key="Consumption Based"
                      value="Consumption Based"
                    ></Select.Option>
                    <Select.Option key="Urgent" value="Urgent"></Select.Option>
                    <Select.Option
                      key="Record Level Based"
                      value="Record Level Based"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={disableFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={disableToDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Patient Type" name="PatientType">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    {PatientIssueDropdown.Patient.map((option) => (
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
              <Col className="gutter-row" span={4}>
                <Form.Item label="Indent Status" name="IndentStatus">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Pending"
                      value="Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Partially Pending"
                      value="Partially Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Completed"
                      value="Completed"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item label="Issue Status" name="IssueStatus">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    loading={isSearchLoading}
                    htmlType="submit"
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" onClick={onReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Spin spinning={loading}>
            <CustomTable
              dataSource={filteredData}
              columns={columns}
              isFilter={true}
              size="small"
              bordered
            />
          </Spin>
          {/* <Table display={setIsTable} dataSource={filteredData} columns={columns}
                        pagination={{
                            onChange: (current, pageSize) => {
                                setPage(current);
                                setPaginationSize(pageSize);
                            },
                            defaultPageSize: 5,
                            hideOnSinglePage: true,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        }}
                        rowKey={(row) => row.AppUserId}
                        size="small"
                        bordered
                    /> */}
        </Card>
      </div>
    </Layout>
  );
};

export default PatientIssue;

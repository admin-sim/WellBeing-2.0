import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PageHeader from "../../components/PageHeader/index.jsx";
import dayjs from 'dayjs';
import {
  Spin,
  Skeleton,
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
  AutoComplete,
  Table,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import CustomTable from "../../components/customTable/index.jsx";
import { urlGetPurshaseOrderDetails, urlSearchPatientConsumption, urlSearchUHID, urlGetLastEncounter } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import { render } from "react-dom";
import UhidSelectComponent from "../../components/UhidSelectComponent/index.jsx";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PatientConsumption = () => {
  const [PatientConsumptionDropdown, setPatientConsumptionDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });

  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'day'));
  const [toDate, setToDate] = useState(dayjs());
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [encounter, setEncounter] = useState([])

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPatientConsumptionDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit()
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = (IndentId) => {
    navigate("/CreatePatientConsumption", { state: { IndentId } });
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (toDate && date && date.isAfter(toDate)) {
      setToDate(null);
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const disabledFromDate = (current) => {
    return current && current.isAfter(dayjs().endOf('day'));
  };

  const disabledToDate = (current) => {
    return current && (current.isBefore(fromDate, 'day') || current.isAfter(dayjs().endOf('day')));
  };

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const handleIssueNumber = (IssueId) => {
    navigate("/CreatePatientConsumption", { state: { IssueId } });
  }
  // const GetModelDetails = (text, record, index) => {
  //   debugger;
  //   console.log("welcome");
  // };

  const columns = [
    {
      title: "Sl No",
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: "Issue ID",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.IssueStatus == "Finalize") {
          return <Tag style={{ marginLeft: '15px' }}>{text}</Tag>;
        }
        return <Button type='link' onClick={() => handleIssueNumber(record.IssueId)}>{text}</Button>
      }
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      sorter: (a, b) => a.IssueDate.localeCompare(b.IssueDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split('T')[0].split('-');
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
      sorter: (a, b) => new Date(a.UhId) - new Date(b.UhId),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text;
      },
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
      sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issueing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
      sortDirections: ["descend", "ascend"],
    },
    {
      render: (_, row) => (
        <Button type="link">Report</Button>
      ),
    },
  ];




  const onFinish = async (values) => {
    debugger;
    setIsSearchLoading(true);
    setLoading(true);
    try {
      const postData1 = {
        IssueingStoreId: values.IssuingStore ? values.IssuingStore : 0,
        PatientName: values.PatientName ? values.PatientName : undefined,
        EncounterId: values.Encounter ? values.Encounter : 0,
        FromDateString: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        IssueStatus: values.IssueStatus === 0 ? undefined : values.IssueStatus,
        PatientId: values.PatientId ? values.PatientId : 0
      };
      const response = await customAxios.post(urlSearchPatientConsumption, postData1);
      debugger;
      const ApiData = response.data.data.newIndentIssueModel.map((item, index) => {
        return {
          ...item,
          key: index + 1
        }
      })
      setFilteredData(ApiData);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    setIsSearchLoading(false);
  };

  const onReset = () => {
    setIsTable(false)
    setFilteredData([]);
    form.resetFields();
  };

  const getPanelValue = async (searchText) => {
    try {
      customAxios.get(`${urlSearchUHID}?Uhid=${searchText}`).then((response) => {
        const apiData = response.data.data;
        const newOptions = apiData.map(item => ({ value: item.UhId, key: item.UhId, PatientId: item.PatientId, Name: item.PatientFirstName + ' ' + item.PatientLastName }));
        setAutoCompleteOptions(newOptions);
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  }

  function handleSelect2(value, option) {
    debugger
    if (value) {
      form.setFieldsValue({ PatientName: option.data.PatientFirstName + ' ' + option.data.PatientLastName })
      form.setFieldsValue({ PatientId: option.data.PatientId })
      try {
        customAxios.get(`${urlGetLastEncounter}?patientId=${option.data.PatientId}`).then((response) => {
          const apiData = response.data;
          if (apiData.length > 0) {
            setEncounter(apiData);
            form.setFieldsValue({ Encounter: apiData[0].EncounterId });
            form.setFieldsValue({ EncounterId: apiData[0].EncounterId });
            form.setFieldsValue({ PatientId: option.data.PatientId });
          } else {
            setEncounter([]);
            form.setFieldsValue({ Encounter: '' });
            form.setFieldsValue({ EncounterId: '' });
            form.setFieldsValue({ PatientId: '' });
          }
        });
      } catch (error) {
        //console.error("Error fetching purchase order details:", error);        
      }
    } else {
      setEncounter([]);
      form.setFieldsValue({ EncounterId: '' });
      form.setFieldsValue({ Encounter: '' });
      form.setFieldsValue({ PatientId: '' });
      form.setFieldsValue({ PatientName: '' });
    }
  }

  const handleUHId = (value) => {
    debugger
    if (value == undefined) {
      setEncounter([])
      form.setFieldsValue({ Encounter: undefined });
      form.setFieldsValue({ PatientId: undefined });
      form.setFieldsValue({ PatientName: undefined });
    }
  }

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <PageHeader
          title={"Patient Consumption"}
          buttonLabel="Add Patient Consumption"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={() => handleIssueNumber(0)}
        />
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              FromDate: dayjs().subtract(1, 'day'),
              ToDate: dayjs(),
              IssueStatus: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="From Date"
                  name="FromDate"
                >
                  <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY'
                    value={fromDate} onChange={handleFromDateChange} disabledDate={disabledFromDate} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="ToDate"
                  label="To Date"
                >
                  <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }}
                    value={toDate} onChange={handleToDateChange} disabledDate={disabledToDate} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="IssuingStore"
                  label="Issuing Store"
                >
                  <Select allowClear placeholder='Select Value'>
                    {PatientConsumptionDropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="IssueStatus"
                  label="IssueStatus"
                >
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
                    <Select.Option key='Created' value='Created'></Select.Option>
                    <Select.Option key='Draft' value='Draft'></Select.Option>
                    <Select.Option key='Finalize' value='Finalize'></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="UHID" label="UHID">
                  {/* <AutoComplete
                    options={autoCompleteOptions}
                    // options={autoCompleteOptions[record.key]}
                    onSearch={getPanelValue}
                    onSelect={(value, option) => handleSelect(value, option)}
                    onChange={handleUHId}
                    placeholder="Search for a Uhid"
                    allowClear
                  /> */}
                  <UhidSelectComponent handleSelectUHID={handleSelect2} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="PatientName"
                  label="Patient Name"
                >
                  <Input disabled style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="Encounter" label="Encounter">
                  <Select allowClear disabled={encounter.length > 1 ? false : true}>
                    {encounter.map((option) => (
                      <Select.Option key={option.EncounterId} value={option.EncounterId}>
                        {option.GeneratedEncounterId}
                      </Select.Option>
                    ))}
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
        </Card>
      </div>
    </Layout>
  );
};

export default PatientConsumption;

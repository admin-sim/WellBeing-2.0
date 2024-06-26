import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import male from "../../assets/m.png";
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
  Tooltip,
  Table,
  AutoComplete,
  Avatar
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import { urlSearchUHID, urlGetLastEncounter } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const MedicalReturn = () => {
  const [MedicalReturnDropdown, setMedicalReturnDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isDisabled, setIsDisable] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [encounter, setEncounter] = useState([])
  const { Title } = Typography;
  const [patientName, setPatientName] = useState();

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
  };

  const getPanelValue = async (searchText) => {
    debugger;
    form.setFieldsValue({ Name: searchText != '' ? '' : searchText })
    if (searchText === '') {
      setEncounter([])
    }
    try {
      customAxios.get(`${urlSearchUHID}?Uhid=${searchText}`).then((response) => {
        const apiData = response.data.data;
        const newOptions = apiData.map(item => ({ value: item.UhId, key: item.UhId, Name: item.PatientFirstName + ' ' + item.PatientLastName }));
        setAutoCompleteOptions(newOptions);
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  }

  const handleSelect = (value, option) => {
    debugger;
    form.setFieldsValue({ Name: option.Name })
    // setPatientName(option.Name);
    try {
      customAxios.get(`${urlGetLastEncounter}?Uhid=${option.key}`).then((response) => {
        debugger;
        setEncounter(response.data.data);
        if (response.data.data.length > 1) {
          setIsDisable(false)
        }else{
          setIsDisable(true)
        }
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  }

  const GetModelDetails = (text, record, index) => {
    debugger;
    console.log("welcome");
  };
  const columns = [
    {
      title: "Sl No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "PO Number",
      dataIndex: "PONumber",
      key: "PONumber",
      sorter: (a, b) => a.PONumber - b.PONumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => (
        <Button
          type="link"
          onClick={() => GetModelDetails(text, record, index)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Document Type",
      dataIndex: "DocumentTypeName",
      key: "DocumentTypeName",
      sorter: (a, b) => a.DocumentTypeName.localeCompare(b.DocumentTypeName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Date",
      dataIndex: "PoDate",
      key: "PoDate",
      sorter: (a, b) => new Date(a.PoDate) - new Date(b.PoDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        //const poDate = new Date(text);
        //const formattedDate = text;
        return text;
      },
    },
    {
      title: "Supplier Name",
      dataIndex: "SupplierName",
      key: "SupplierName",
      sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Store Name",
      dataIndex: "StoreName",
      key: "StoreName",
      sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "PO Raised By",
      dataIndex: "PORaisedBy",
      key: "PORaisedBy",
      sorter: (a, b) => a.MedicalReturnId.localeCompare(b.MedicalReturnId),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        // let color = text === 'Pending' ? 'volcano' : text === 'Completed' ? 'green' : text === '';
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(row)}
            />
          </Tooltip>
        </>
      ),
    },
  ];
  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   if (value === '') {
  //     setFilteredData(loadUsers);
  //   } else {
  //     const filtered = loadUsers.filter(entry =>
  //       Object.values(entry).some(val =>
  //         val && val.toString().toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  /* const validateUserRole = (rule, value) => {
     if (value) {
       const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
       if (!existsInOptions) {
         return Promise.reject('Please select a valid UserRole from the list.');
       }
     }
     return Promise.resolve();
   };*/

  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);

    console.log("Form Values:", values);
    //const uhid = selectedUhId ? selectedUhId.UhId : '';

    // ... Repeat for other parameters
  };
  const [formatedFromDate, setFormatedFromDate] = useState();
  const [formatedToDate, setFormatedToDate] = useState();
  function formatDate(inputDate) {
    const dateParts = inputDate.split("/");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }
  const onFinish = async (values) => {
    debugger;
    setIsSearchLoading(true);
    setLoading(true);
    try {
      const postData1 = {
        DocumentType:
          values.DocumentType === undefined ? "" : values.DocumentType, // Set to empty string when left blank
        Supplier: values.Supplier === undefined ? "" : values.Supplier,
        ProcurementStore:
          values.ProcurementStore === undefined ? "" : values.ProcurementStore,
        POStatus: values.POStatus === undefined ? "" : values.POStatus,
        FromDate:
          values.FromDate === undefined || values.FromDate === null
            ? ""
            : (
              values.FromDate.$D.toString().padStart(2, "0") +
              "-" +
              (values.FromDate.$M + 1).toString().padStart(2, "0") +
              "-" +
              values.FromDate.$y
            ).toString(),
        ToDate:
          values.ToDate === undefined || values.ToDate === null
            ? ""
            : (
              values.ToDate.$D.toString().padStart(2, "0") +
              "-" +
              (values.ToDate.$M + 1).toString().padStart(2, "0") +
              "-" +
              values.ToDate.$y
            ).toString(), // A sample value
        PONumber: values.PONumber === undefined ? "" : values.PONumber, // A sample value
      };
      customAxios
        .get(
          `${urlSearchMedicalReturn}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.POStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          console.log("Response:", response.data);
          //resetForm();
          setFilteredData(response.data.data.MedicalReturnDetails);
          // setCurrentPage1(1);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    setIsSearchLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Medical Return
            </Title>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            size="Default"
            style={{
              maxWidth: 1500,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={4}>
                <Form.Item label="UHID" name="UHID"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoComplete
                    options={autoCompleteOptions}
                    // options={autoCompleteOptions[record.key]}
                    onSearch={getPanelValue}
                    onSelect={(value, option) => handleSelect(value, option)}
                    placeholder="Search for a Uhid"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="Name" label="Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="Encounter" label="Encounter"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select disabled={isDisabled}>
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
                  <Button type="primary" loading={isSearchLoading} htmlType="submit">
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
        </Card>
        <Row gutter={32}>
          <Col span={18}>
            <div
              style={{
                padding: "5px 30px",
                borderRadius: "4px",
                margin: "4px 30px",
                display: "flex",
                justifyContent: "space-between",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={3}>
                  <Avatar
                    shape="square"
                    size={64}
                    src={<img src={male} alt="avatar" />}
                  />
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <Col span={12}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID&nbsp;:
                  </span>
                  <span>273</span>
                </Col>

                <Col span={12}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Name&nbsp;:
                  </span>
                  <span>Nitish</span>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-evenly",
                }}
              >
                <Col span={12}>
                  <span style={{ fontWeight: "bold" }}>Gender&nbsp;:&nbsp;</span>
                  <span>Male</span>
                </Col>

                <Col span={12}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId&nbsp;:
                  </span>
                  <span>15</span>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <Col span={12}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age&nbsp;:
                  </span>
                  <span>28</span>
                </Col>
                <Col span={12}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Dob&nbsp;:
                  </span>
                  <span>27/09/1995</span>
                </Col>
              </Row>
            </div>
          </Col>
          {/* <Col
            span={6}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="default"
              style={{ display: "flex", alignItems: "center" }}
              danger
              size="large"
            >
              End Consultation{" "}
              <RxExit style={{ marginLeft: "5px", fontSize: "1.3rem" }} />
            </Button>
          </Col> */}
        </Row>
        {loading ? (
          <Skeleton active />
        ) : (
          // <Spin tip="Loading" size="large">
          //   <div className="content" />
          // </Spin>
          <div>
            {isTable && (
              <Table display={setIsTable}
                dataSource={filteredData}
                columns={columns}
                pagination={{
                  onChange: (current, pageSize) => {
                    setPage(current);
                    setPaginationSize(pageSize);
                  },
                  defaultPageSize: 5, // Set your default pagination size
                  hideOnSinglePage: true,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                }}
                rowKey={(row) => row.AppUserId} // Specify the custom id property here
                size="small"
                bordered
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicalReturn;

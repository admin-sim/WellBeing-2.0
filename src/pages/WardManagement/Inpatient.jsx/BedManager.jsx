import React, { useState, useEffect } from 'react';
import {
  Row, Col, Select, Button, Card, message, Form, Table, Tabs, Tag, Space, Empty, Segmented, Collapse, Spin, Divider, Layout
} from 'antd';
import { DatabaseTwoTone , AppstoreTwoTone  ,FieldTimeOutlined   } from '@ant-design/icons'; 
import PageHeader from '../../../components/PageHeader';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { urlGetAllEncounterByPatientId , urlGetWardCategory1, urlShowWards , urlShowAwaitingPatients1 ,urlShowRequests } from '../../../../endpoints.js';
import WardBed from './InPatientManagement/WardBed'; 
import { useNavigate } from "react-router"; 
import dayjs from 'dayjs'; 
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';

const BED_STATUS_OPTIONS = {
  Both: 'Both',
  Empty: 'Empty',
  Occupied: 'Occupied'
};  

function BedManager() {
  const [wardCategory, setWardCategory] = useState('');
  const [bedStatus, setBedStatus] = useState(BED_STATUS_OPTIONS.Both);
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState([]);
  const [view, setView] = useState('Tabular');
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('bedManager');
  const [searched, setSearched] = useState(false); 
  const [awaitingPatients, setAwaitingPatients] = useState([]);
  const [requests, setRequests] = useState([]);


  const [dropDown, setDropDown] = useState({
    WardCategory: [],
    BedStatus: [
      { id: 1, value: BED_STATUS_OPTIONS.Both, label: 'Both' },
      { id: 2, value: BED_STATUS_OPTIONS.Empty, label: 'Empty' },
      { id: 3, value: BED_STATUS_OPTIONS.Occupied, label: 'Occupied' }
    ]
  });


  // Fetch Ward Category Dropdown from backend...
  const fetchWardCategories = async () => {
    try {
      const response = await customAxios.get(`${urlGetWardCategory1}?WardCategoryId=0&BedStatus="Hi"`);
      if (response.status === 200 && response.data) {
        setDropDown(prev => ({
          ...prev,
          WardCategory: response.data.data.WardCategory || []
        }));
      } else {
        message.error('Failed to fetch ward categories');
      }
    } catch (error) {
      message.error('Error fetching ward categories');
    }
  };

  useEffect(() => {
    fetchWardCategories();
  }, []);

  // Fetch beds from backend...
  const handleSearch = async (values) => {
    if (values.WardCategoryId === undefined || values.WardCategoryId === null) {
      message.warning('Please select a ward category');
      return;
    }
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlShowWards}?WardCategoryId=${values.WardCategoryId}&BedStatus=${values.BedStatus || BED_STATUS_OPTIONS.Both}`);
      setSearched(true);
      const bedsArr = (response.data?.Beds || response.data?.data?.Beds || []);
      const bedsWithEncounter = await Promise.all(bedsArr.map(fetchEncounterForBed));
      setBeds(bedsWithEncounter);

      setBanner({
        TotalBeds: bedsWithEncounter.length,
        Occupied: bedsWithEncounter.filter(b => b.PatientStatus === "Occupied").length,
        Available: bedsWithEncounter.filter(b => b.PatientStatus === "Available").length,
        Blocked: bedsWithEncounter.filter(b => b.PatientStatus === "Blocked").length,
        NewAdmissionsCount: 0,
        DischargedPatientsCount: 0,
        TransferInCount: 0,
        TransferOutCount: 0,
      });

      // Fetch Awaiting Patients here...
      await fetchAwaitingPatients(values.WardCategoryId, values.BedStatus || BED_STATUS_OPTIONS.Both);
      await fetchRequests(values.WardCategoryId, values.BedStatus || BED_STATUS_OPTIONS.Both);

    } catch {
      setSearched(true);
      message.error('Error fetching beds');
      setBeds([]);
      setBanner({
        TotalBeds: 0,
        Occupied: 0,
        Available: 0,
        Blocked: 0,
        NewAdmissionsCount: 0,
        DischargedPatientsCount: 0,
        TransferInCount: 0,
        TransferOutCount: 0,
      });
      setAwaitingPatients([]);
    } finally {
      setLoading(false);
    }
  };

// Fetch AwaitingPatients  from backend...
const fetchAwaitingPatients = async (WardCategoryId, BedStatus) => {
  try {
    const response = await customAxios.get(
      `${urlShowAwaitingPatients1}?WardCategoryId=${WardCategoryId}&BedStatus=${BedStatus}`
    );
    if (response.status === 200 && response.data) {
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      setAwaitingPatients(data.AwaitingPatients || []);
    } else {
      setAwaitingPatients([]);
      message.error("Failed to fetch awaiting patient list.");
    }
  } catch (error) {
    setAwaitingPatients([]);
    message.error("Error fetching awaiting patient list");
  }
};

// Fetch ShowRequests  from backend...
const fetchRequests = async (WardCategoryId, BedStatus) => {
  try {
    const response = await customAxios.get(
      `${urlShowRequests}?WardCategoryId=${WardCategoryId}&BedStatus=${BedStatus}`
    );
    if (response.status === 200 && response.data) {
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      setRequests(data.data?.IncomingRequestForTransfer || []);
      console.log("Transfer Requests:", data.IncomingRequestForTransfer);
    } else {
      setRequests([]);
      message.error("Failed to fetch transfer requests.");
    }
  } catch (error) {
    setRequests([]);
    message.error("Error fetching transfer requests");
  }
};

  // Group beds by WardName for pictorial view...
  const groupBedsByWard = () => {
    return beds.reduce((groups, bed) => {
      const wardName = bed.WardName || "Unknown Ward";
      if (!groups[wardName]) {
        groups[wardName] = [];
      }
      groups[wardName].push(bed);
      return groups;
    }, {});
  };

  // Table columns (tabular view) - Adjusted as per your request..
  const columns = [
    {
      title: "Sl.No",
      dataIndex: "slno",
      key: "slno",
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
       render: (text) => text || 'N/A',
    },
   { 
      title: "Encounter",
      dataIndex: "GeneratedEncounterId",
      key: "GeneratedEncounterId",
      render: (text, record) => (
        <Button type="link" onClick={() => handleSelectPatient(record)}>
          {record.GeneratedEncounterId || 'N/A'}
        </Button>
      ),
    },

    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "PatientName",
      render: (text) => text || 'N/A',
    },
    {
  title: "Consultant",
  dataIndex: "ProviderName",
  key: "ProviderName",
  render: (text) => text || 'N/A',
    },
    {
      title: "Bed Number",
      dataIndex: "BedNo",
      key: "BedNo",
    },
   
    {
      title: "Bed Status",
      dataIndex: "PatientStatus",
      key: "PatientStatus",
      render: (status) => {
        switch (status) {
          case "Available":
            return <Tag color="#C5EBAA" style={{ color: "black" }}>{status}</Tag>;
          case "Occupied":
            return <Tag color="#FFBABA" style={{ color: "black" }}>{status}</Tag>;
          case "Blocked":
            return <Tag color="#FF8356" style={{ color: "black" }}>{status}</Tag>;
          case "Transfer Requested":
            return <Tag color="#F0A8D0" style={{ color: "black" }}>{status}</Tag>;
          case "Request Confirmed":
            return <Tag color="#D1E9F6" style={{ color: "black" }}>{status}</Tag>;
          case "Discharge Initiated":
            return <Tag color="#CADABF" style={{ color: "black" }}>{status}</Tag>;
          case "Movement":
            return <Tag color="#C8A1E0" style={{ color: "black" }}>{status}</Tag>;
          default:
            return <Tag color="default" style={{ color: "black" }}>{status || "N/A"}</Tag>;
        }
      }
    },
  ];

  // Handler for viewing patient/bed details (kept as a placeholder, not linked to a column anymore)
  const handleViewDetails = (record) => {
    message.info(`Viewing details for bed ${record.BedNo}`);
  };

  // Pictorial view: simple card for each bed....
  const renderBedCards = () => {
    const groupedBeds = groupBedsByWard();
    return (
      <Row style={{ padding: "0 1rem" }}>
        <Col span={24}>
          <Collapse defaultActiveKey={Object.keys(groupedBeds)[0]} ghost>
            {Object.keys(groupedBeds).map((wardName) => (
              <Collapse.Panel header={wardName} key={wardName}>
                <Row gutter={[16, 16]}>
                  {groupedBeds[wardName].map((bed, idx) => (
                    // Make sure WardBed component can handle all bed properties
                    <WardBed key={bed.BedID ? String(bed.BedID) : `${wardName}-${bed.BedNo || idx}`} bed={bed} ReLoad={fetchBeds} />
                  ))}
                </Row>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    );
  };


  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  // Add this state for summary banner define.... 
  const [banner, setBanner] = useState({
    TotalBeds: 0, // Initialize with 0
    Occupied: 0,
    Available: 0,
    Blocked: 0,
    NewAdmissionsCount: 0,
    DischargedPatientsCount: 0,
    TransferInCount: 0,
    TransferOutCount: 0,
  });

  const fetchBeds = () => {
    form
      .validateFields()
      .then(handleSearch)
      .catch(() => {});
  };

  // Example: navigate or show modal
  const handleSelectPatient = (record) => {
    message.info(`Selected Encounter: ${record.GeneratedEncounterId}`);
  };

  // fetch function  for encounter  a bed
  const fetchEncounterForBed = async (bed) => {
    if (!bed.PatientId) return { ...bed, GeneratedEncounterId: null };
    try {
      const response = await customAxios.get(`${urlGetAllEncounterByPatientId}?PatientId=${bed.PatientId}`);
      if (response.status === 200 && response.data?.data?.length > 0) {
        return { ...bed, GeneratedEncounterId: response.data.data[0].GeneratedEncounterId };
      }
      return { ...bed, GeneratedEncounterId: null };
    } catch {
      return { ...bed, GeneratedEncounterId: null };
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        borderRadius: "10px",
        overflowY: "auto"
      }}
    >
     <PageHeader title={"Bed Manager"} button={false} />
      <div style={{ padding: 24 }}>
        <Card style={{ boxShadow: "none", borderRadius: 8 }}>
          {/* Search Form */}
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            initialValues={{
              BedStatus: BED_STATUS_OPTIONS.Both
            }}
            style={{ marginBottom: 20 }}
          >
            <Form.Item
              name='WardCategoryId'
              label="Ward Category"
              rules={[{ required: true, message: 'Please select a ward category' }]}
              style={{ minWidth: 250 }}
            >
              <Select
                placeholder="Select Ward Category"
                style={{ width: 200 }}
                onChange={(value) => {
                  setWardCategory(value);
                  form.setFieldsValue({ WardCategoryId: value });
                }}
                loading={loading}
                showSearch
                optionFilterProp="children"
              >
                <Select.Option key={0} value={0}>ALL</Select.Option>
                {(dropDown.WardCategory || []).map(category => (
                  <Select.Option key={category.LookupID} value={category.LookupID}>
                    {category.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='BedStatus'
              label="Bed Status"
              style={{ minWidth: 200 }}
            >
              <Select
                placeholder="Select Bed Status"
                style={{ width: 150 }}
                onChange={(value) => {
                  setBedStatus(value);
                  form.setFieldsValue({ BedStatus: value });
                }}
              >
                {dropDown.BedStatus.map(option => (
                  <Select.Option key={option.id} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Search
              </Button>
            </Form.Item>
          </Form>

          {/* Summary start */}
          {searched && (
            <Row
              gutter={24}
              style={{
                border: "2px solid lavender",
                margin: "0 0 10px 0",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: "#f8faff",
                alignItems: "center",
              }}
            >
              <Col xl={3} lg={3} md={4} sm={4} xs={24} style={{ marginBottom: 8 }}>
                As on : <strong>{dayjs().format("DD-MM-YYYY")}</strong>
              </Col>
              <Col
                xl={10}
                lg={10}
                md={10}
                sm={24}
                xs={24}
                style={{
                  borderLeft: "1px solid #e0e0e0",
                  borderRight: "1px solid #e0e0e0",
                  padding: "0 16px",
                  marginBottom: 8,
                }}
              >
                <Row>
                  <Col span={24} style={{ marginBottom: "0.5rem" }}>
                    Total Beds : <strong>{banner.TotalBeds}</strong>
                  </Col>
                  <Col span={8}>
                    Occupied : <strong>{banner.Occupied}</strong>
                  </Col>
                  <Col span={8}>
                    Available : <strong>{banner.Available}</strong>
                  </Col>
                  <Col span={8}>
                    Blocked : <strong>{banner.Blocked}</strong>
                  </Col>
                </Row>
              </Col>
              <Col xl={11} lg={11} md={10} sm={24} xs={24}>
                <Row gutter={0}>
                  <Col span={24} style={{ marginBottom: "0.5rem" }}>
                    Todays :
                  </Col>
                  <Col xl={6} lg={6} md={12} xs={24} span={12}>
                    New Admission:&nbsp;
                    <strong>{banner.NewAdmissionsCount}</strong>
                  </Col>
                  <Col xl={6} lg={6} md={12} xs={24} span={12}>
                    Discharges:&nbsp;
                    <strong>{banner.DischargedPatientsCount}</strong>
                  </Col>
                  <Col xl={6} lg={6} md={12} xs={24} span={12}>
                    Transfer In:&nbsp;<strong>{banner.TransferInCount}</strong>
                  </Col>
                  <Col xl={6} lg={6} md={12} xs={24} span={12}>
                    Transfer Out:&nbsp;
                    <strong>{banner.TransferOutCount}</strong>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          {/* Summary end */}

          {/* Color Legend */}
          {searched && (
            <Row
              gutter={16}
              style={{
                border: "2px solid lavender",
                margin: "0 0 10px 0",
                borderRadius: "0.75rem",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#f8faff",
                padding: "0.5rem 0",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Col style={{ backgroundColor: "#C5EBAA", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Available</Col>
              <Col style={{ backgroundColor: "#FFBABA", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Occupied</Col>
              <Col style={{ backgroundColor: "#FF8356", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Blocked</Col>
              <Col style={{ backgroundColor: "#F0A8D0", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Transfer Requested</Col>
              <Col style={{ backgroundColor: "#D1E9F6", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Request Confirmed</Col>
              <Col style={{ backgroundColor: "#CADABF", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Discharge Initiated</Col>
              <Col style={{ backgroundColor: "#C8A1E0", flex: 1, margin: "0 4px", borderRadius: 4, padding: "0.2rem" }}>Movement</Col>
            </Row>
          )}

          {/* Tabs BELOW search and legend */}
          {searched && (
            <Tabs
              tabPosition="left"
              activeKey={activeTab}
              onChange={key => {
                setActiveTab(key);
                if (key === "indent") {
                  navigate("/Indent");
                }
              }}
              items={[
                {
                  key: "bedManager",
                  label: "Bed Manager",
                  children: (
                    <Row gutter={24} style={{ marginTop: 8 }}>
                      <Col xs={24} md={18}>
                        <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
                          <Segmented
                            options={[
                             { label: "Tabular", value: "Tabular", icon: <DatabaseTwoTone /> },
                             { label: "Pictorial", value: "Pictorial", icon: <AppstoreTwoTone /> }
                            ]}
                            value={view}
                            onChange={setView}
                          />
                        </div>
                        <Spin spinning={loading}>
                          {view === "Tabular" ? (
                            <Card style={{ boxShadow: "none" }}>
                              <Table
                                columns={columns}
                                dataSource={beds}
                                rowKey={record => record.BedID ? String(record.BedID) : `${record.UhId || ''}-${record.BedNo || ''}`}
                                locale={{ emptyText: <Empty description="No beds found" /> }}
                                pagination={{
                                  ...pagination,
                                  total: beds.length,
                                  onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                                }}
                              />
                            </Card>
                          ) : (
                            renderBedCards()
                          )}
                        </Spin>
                      </Col>
                      <Col xs={24} md={6}>
                        <Card
                          style={{
                            background: "#f4faff",
                            borderRadius: 12,
                            boxShadow: "0 2px 8px #e6f7ff",
                            border: "1px solid #e6f7ff",
                            marginTop: 8,
                            marginBottom: 16, // add spacing between cards
                          }}
                          bodyStyle={{ padding: 18 }}
                        >
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                            <UserOutlined style={{ fontSize: 22, color: "#1890ff", marginRight: 8 }} />
                            <span style={{ fontWeight: 600, fontSize: 18, color: "#1890ff" }}>Awaiting Patients</span>
                          </div>
                          {awaitingPatients.length === 0 ? (
                            <Empty
                              description={
                                <span style={{ color: "#888" }}>
                                  No awaiting patients at the moment.
                                </span>
                              }
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          ) : (
                            <div>
                              {awaitingPatients.map((patient, idx) => (
                                <Card
                                  key={patient.PatientId || idx}
                                  size="small"
                                  style={{
                                    marginBottom: 12,
                                    borderRadius: 8,
                                    border: "1px solid #e6f7ff",
                                    boxShadow: "0 1px 3px #f0f0f0",
                                    background: "#fff",
                                  }}
                                  bodyStyle={{ padding: 12, display: "flex", alignItems: "center" }}
                                >
                                  <UserOutlined style={{ fontSize: 20, color: "#52c41a", marginRight: 12 }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{patient.PatientName}</div>
                                    <div style={{ color: "#888", fontSize: 13 }}>
                                      UHID: <span style={{ fontWeight: 500 }}>{patient.UhId || 'N/A'}</span>
                                    </div>
                                    {patient.Reason && (
                                      <div style={{ color: "#faad14", fontSize: 13, marginTop: 2 }}>
                                        <FileTextOutlined style={{ marginRight: 4 }} />
                                        Reason: {patient.Reason}
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </Card>

                        <Card
                          style={{
                            background: "#fff7e6",
                            borderRadius: 12,
                            boxShadow: "0 2px 8px #ffe7ba",
                            border: "1px solid #ffe7ba",
                            marginTop: 0,
                          }}
                          bodyStyle={{ padding: 18 }}
                        >
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                            <FieldTimeOutlined style={{ fontSize: 22, color: "#faad14", marginRight: 8 }} />
                            <span style={{ fontWeight: 600, fontSize: 18, color: "#faad14" }}>Transfer Requests</span>
                          </div>
                          {requests.length === 0 ? (
                            <Empty
                              description={
                                <span style={{ color: "#888" }}>
                                  No transfer requests at the moment.
                                </span>
                              }
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          ) : (
                            <div>
                              {requests.map((req, idx) => (
                                <Card
                                  key={req.RequestId || idx}
                                  size="small"
                                  style={{
                                    marginBottom: 12,
                                    borderRadius: 8,
                                    border: "1px solid #ffe7ba",
                                    boxShadow: "0 1px 3px #f0f0f0",
                                    background: "#fff",
                                  }}
                                  bodyStyle={{ padding: 12, display: "flex", alignItems: "center" }}
                                >
                                  <FieldTimeOutlined style={{ fontSize: 20, color: "#faad14", marginRight: 12 }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{req.PatientName}</div>
                                    <div style={{ color: "#888", fontSize: 13 }}>
                                      UHID: <span style={{ fontWeight: 500 }}>{req.UhId || 'N/A'}</span>
                                    </div>
                                    <div style={{ color: "#1890ff", fontSize: 13 }}>
                                      From: {req.FromWardName || 'N/A'} → To: {req.ToWardName || 'N/A'}
                                    </div>
                                    {req.RequestReason && (
                                      <div style={{ color: "#faad14", fontSize: 13, marginTop: 2 }}>
                                        <FileTextOutlined style={{ marginRight: 4 }} />
                                        Reason: {req.RequestReason}
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "indent",
                  label: "Indent",
                  children: null,
                },
              ]}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default BedManager;

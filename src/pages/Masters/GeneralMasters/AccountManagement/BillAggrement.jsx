import {
  EditOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, Layout, Pagination, Row, Spin, Typography } from "antd";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlGetAllBillAgrements } from "../../../../../endpoints";
import { useNavigate } from "react-router";

const { Title } = Typography;

function BillAggrement() {
  const [columnData, setColumnData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlGetAllBillAgrements);
      const newData =
        response.data?.data?.BillAgreementModels?.map((item, index) => ({
          ...item,
          key: index + 1,
        })) || [];
      setColumnData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    navigate("/CreateBillAgrement");
  };

  const handleEdit = (agreement, revisionNo = 0) => {
    navigate("/CreateBillAgrement", {
      state: { EditedAgreementId: agreement.AgreementId, revision: revisionNo },
    });
  };

  const handleRevision = (agreement, revisionNo = 0) => {
    navigate("/EditBillAgrementRevise", {
      state: { EditedAgreementId: agreement.AgreementId, revision: revisionNo },
    });
  };

  const paginatedData = columnData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        {/* Header */}
        <Row
          style={{
            padding: "0.5rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <Col span={16}>
            <Title level={4} style={{ color: "white", margin: 0 }}>
              Bill Agreement Details
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={handleCreate}
              type="primary"
            >
              Add Bill Agreement
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Spin spinning={loading}>
          <div style={{ overflowX: "auto" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Facility Name</th>
                  <th>Agreement Description</th>
                  <th>Status</th>
                  <th>Effective From</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let serialNo = (currentPage - 1) * pageSize + 1;

                  return paginatedData.flatMap((agreement, idx) => {
                    const lines = agreement.BillAgreementLines ?? [];
                    console.log("Agreement:", agreement);
                    console.log("BillAgreementLines:", lines);
                    if (lines.length > 0) {
                      return lines.map((revision, revIdx) => (
                        <tr
                          key={`${agreement.AgreementId}-${revision.RevisionNo}-${revIdx}`}
                        >
                          <td>{serialNo++}</td>
                          {revIdx === 0 && (
                            <td rowSpan={lines.length}>
                              {agreement.FacilityName}
                            </td>
                          )}
                          <td>
                            {revision.RevisionNo > 0
                              ? `Revision - ${revision.RevisionNo}`
                              : agreement.AgreementDescription}
                          </td>
                          <td>{agreement.Status}</td>
                          <td>
                            {agreement.ValidFrom
                              ? new Date(
                                  agreement.ValidFrom
                                ).toLocaleDateString("en-GB")
                              : ""}
                          </td>
                          <td>
                            <EditOutlined
                              onClick={() =>
                                handleEdit(agreement, revision.RevisionNo)
                              }
                              title="Edit"
                              style={{
                                marginRight: 12,
                                cursor: "pointer",
                                fontSize: 16,
                                color: "#52c41a",
                              }}
                            />
                            <FormOutlined
                              onClick={() =>
                                handleRevision(agreement, revision.RevisionNo)
                              }
                              title="Revise"
                              style={{
                                cursor: "pointer",
                                fontSize: 16,
                                color: "#1677ff",
                              }}
                            />
                          </td>
                        </tr>
                      ));
                    } else {
                      return (
                        <tr key={agreement.AgreementId}>
                          <td>{serialNo++}</td>
                          <td>{agreement.FacilityName}</td>
                          <td>{agreement.AgreementDescription}</td>
                          <td>{agreement.Status}</td>
                          <td>
                            {agreement.ValidFrom
                              ? new Date(
                                  agreement.ValidFrom
                                ).toLocaleDateString("en-GB")
                              : ""}
                          </td>
                          <td>
                            <EditOutlined
                              onClick={() => handleEdit(agreement, 0)}
                              title="Edit"
                              style={{
                                marginRight: 12,
                                cursor: "pointer",
                                fontSize: 16,
                                color: "#52c41a",
                              }}
                            />
                            <FormOutlined
                              onClick={() => handleRevision(agreement, 0)}
                              title="Revise"
                              style={{
                                cursor: "pointer",
                                fontSize: 16,
                                color: "#1677ff",
                              }}
                            />
                          </td>
                        </tr>
                      );
                    }
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "1rem 2rem",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={columnData.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </Spin>
      </div>

      {/* Inline or External CSS */}
      <style>{`
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Segoe UI', sans-serif;
        }
        .custom-table th, .custom-table td {
          padding: 10px;
          border: 1px solid #d9d9d9;
          text-align: left;
          white-space: nowrap;
        }
        .custom-table th {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        .custom-table tr:hover {
          background-color: #fafafa;
        }
      `}</style>
    </Layout>
  );
}

export default BillAggrement;

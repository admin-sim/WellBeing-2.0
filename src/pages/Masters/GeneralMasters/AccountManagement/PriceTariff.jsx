import {
  CopyOutlined,
  EditOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Spin, Layout, Input, Pagination } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import { urlGetAllPriceTariffs } from "../../../../../endpoints";
import { useNavigate } from "react-router";

function PriceTariff() {
  const [columnData, setColumnData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllPriceTariffs}`);
      const newColumnData = response.data.data.BillTariffModels.map(
        (obj, index) => ({
          ...obj,
          key: index + 1,
        })
      );
      setColumnData(newColumnData);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreatePriceTariff = () => {
    navigate("/CreatePriceTariff");
  };

  const handleEdit = (record, revisionNo = 0) => {
    navigate("/CreatePriceTariff", {
      state: { EditedPricetariffId: record.PriceTariffId, revision: revisionNo },
    });
  };

  const handleRevision = (record, revisionNo = 0) => {
    navigate("/EditPriceTariffRevision", {
      state: {
        EditedPricetariffId: record.PriceTariffId,
        revision: revisionNo,
      },
    });
  };

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(10); // default page size

  const filteredData = columnData.filter((tariff) => {
    const term = searchText.toLowerCase();
    return (
      tariff.FacilityName?.toLowerCase().includes(term) ||
      tariff.ShortPriceDescription?.toLowerCase().includes(term) ||
      tariff.LongPriceDescription?.toLowerCase().includes(term)
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
            paddingBottom: "1rem",
          }}
        >
          <Row
            style={{
              padding: "0.5rem 2rem",
              backgroundColor: "#40A2E3",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <Col span={16}>
              <Title
                level={4}
                style={{ color: "white", fontWeight: 500, margin: 0 }}
              >
                PriceTariff
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleCreatePriceTariff}
              >
                Add Price Tariff
              </Button>
            </Col>
          </Row>

          <Row
            style={{ padding: "1rem 2rem 0 2rem", justifyContent: "flex-end" }}
          >
            <Col xs={24} sm={12} md={8} lg={6} style={{ textAlign: "right" }}>
              <Input
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Spin spinning={loading}>
            <div style={{ padding: "20px" }}>
              <table className="custom-table">
                <thead style={{ backgroundColor: "#a4a8e463" }}>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Facility</th>
                    <th>Short Description</th>
                    <th>Long Description</th>
                    <th>Status</th>
                    <th>Effective From</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = (currentPage - 1) * pageSize + 1;

                    return paginatedData.map((tariff) => {
                      const lines = tariff.BillPriceTariffLines ?? [];

                      return lines.length > 0
                        ? lines.map((revision, idx) => (
                            <tr
                              key={`${tariff.PriceTariffId}-${revision.RevisionNo}-${idx}`}
                            >
                              <td>{serialNo++}</td>
                              {idx === 0 && (
                                <td rowSpan={lines.length}>
                                  {tariff.FacilityName}
                                </td>
                              )}
                              <td>
                                {revision.RevisionNo > 0
                                  ? `Revision - ${revision.RevisionNo}`
                                  : tariff.ShortPriceDescription}
                              </td>
                              <td>
                                {revision.RevisionNo > 0
                                  ? `Revision - ${revision.RevisionNo}`
                                  : tariff.LongPriceDescription}
                              </td>
                              <td>{tariff.Status}</td>
                              <td>{tariff.EffectiveFromDate}</td>
                              <td>
                              
                                <FormOutlined
                                  onClick={() =>
                                    handleEdit(tariff, revision.RevisionNo)
                                  }
                                  style={{ marginRight: 8, cursor: "pointer" }}
                                  title="Edit Price Tariff"
                                />
                                  <EditOutlined
                                  onClick={() =>
                                    handleRevision(tariff, revision.RevisionNo)
                                  }
                                  style={{ marginRight: 8, cursor: "pointer" }}
                                  title="Price Revision"
                                />
                              </td>
                            </tr>
                          ))
                        : [
                            <tr key={tariff.PriceTariffId}>
                              <td>{serialNo++}</td>
                              <td>{tariff.FacilityName}</td>
                              <td>{tariff.ShortPriceDescription}</td>
                              <td>{tariff.LongPriceDescription}</td>
                              <td>{tariff.Status}</td>
                              <td>{tariff.EffectiveFromDate}</td>
                              <td>
                              
                                <FormOutlined
                                  onClick={() => handleEdit(tariff)}
                                  style={{ marginRight: 8, cursor: "pointer" }}
                                  title="Edit Price Tariff"
                                />
                                  <EditOutlined
                                  onClick={() => handleRevision(tariff)}
                                  style={{ marginRight: 8, cursor: "pointer" }}
                                  title="Price Revision"
                                />
                              </td>
                            </tr>,
                          ];
                    });
                  })()}
                </tbody>
              </table>

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
                  total={filteredData.length}
                  showSizeChanger
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                />
              </div>
            </div>
          </Spin>
        </div>
      </Layout>

      <style>{`
      .custom-table {
        width: 100%;
        border-collapse: collapse;
      }
      .custom-table th, .custom-table td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: left;
      }
    `}</style>
    </>
  );
}

export default PriceTariff;

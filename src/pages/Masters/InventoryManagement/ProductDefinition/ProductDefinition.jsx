import { Button, Col, Collapse, ConfigProvider, Input, Row, Spin } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import customAxios from "../../../../components/customAxios/customAxios";
import CustomTable from "../../../../components/customTable";
import {
  urlGetProductClassificationList,
  urlProductDefinitionIndex,
} from "../../../../../endpoints";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./productDefinition.css";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import PageHeader from "../../../../components/PageHeader";

function ProductDefinition() {
  const [dropDownData, setDropDownData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDefinitionIndex();
  }, []);

  const fetchProductDefinitionIndex = () => {
    try {
      customAxios.get(urlProductDefinitionIndex).then((response) => {
        const apiData = response.data.data;
        setDropDownData(apiData);
      });
    } catch (error) {
      console.error("Error fetching Product Definitiondetails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClassificationClick = async (ProductClassificationId) => {
    setShowTable(true);
    setTableLoading(true);
    try {
      customAxios
        .get(
          `${urlGetProductClassificationList}?ProductClassificationId=${ProductClassificationId}`
        )
        .then((response) => {
          const apiData = response.data.data;
          setTableData(apiData.ProductDefinition);
          setTableLoading(false);
        });
    } catch (error) {
      console.error("Error fetching Product Classification details:", error);
      setTableLoading(false);
    }
  };

  const items =
    dropDownData?.ProductGroup?.map((productGroup) => ({
      key: productGroup.LookupID,
      label: productGroup.LookupDescription,
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            paddingLeft: "1rem",
            paddingTop: "0",
            marginTop: "0",
            gap: 6,
          }}
        >
          {dropDownData?.ProductClassification?.filter(
            (product) => product.ProductGroupId === productGroup.LookupID
          ).map((final) => (
            <Button
              icon={<DoubleRightOutlined />}
              type="link"
              key={final.ProductClassificationId}
              onClick={() =>
                handleProductClassificationClick(final.ProductClassificationId)
              }
            >
              {final.LongName}
            </Button>
          ))}
        </div>
      ),
    })) || [];

  const columns = [
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
      width: 120,
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "LongName",
      width: 120,
    },
    {
      title: "Classification",
      dataIndex: "ProductClassification",
      key: "ProductClassification",
      width: 120,
    },
    {
      title: "Product Group",
      dataIndex: "ProductGroup",
      key: "ProductGroup",
      width: 150,
    },
    {
      title: "Status",
      key: "Status",
      width: 80,
      render: (text, record) => {
        if (record.Status === "True") {
          return <span>Active</span>;
        } else {
          return <span>Hidden</span>;
        }
      },
    },
  ];

  const handleEditClick = (record) => {
    console.log("Edit Record", record);
    navigate("/ProductDefinition/ShowCreateEditDefinition", {
      state: { record },
    });
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Product Definition"} button={false} />

      <Row gutter={32} style={{ margin: "1rem 1rem" }}>
        <Col
          xl={6}
          lg={12}
          md={12}
          xs={24}
          span={24}
          style={{
            width: "100%",
            height: "min-content",
            borderRadius: "10px",
            padding: 0,
          }}
        >
          <Spin spinning={loading}>
            <div
              style={{
                backgroundColor: "lavender",
                padding: "0.3rem 1rem",
                borderRadius: "10px 10px 0px 0px ",
                border: "1px solid grey",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "black",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                Product Group
              </Title>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderLeft: "1px solid grey",
                borderBottom: "1px solid grey",
                borderRight: "1px solid grey",
                borderRadius: "0 0 10px 10px",
                paddingBottom: "0.5rem",
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Collapse: {
                      contentPadding: "0px 0px 0px 0px",
                    },
                  },
                }}
              >
                <Collapse ghost items={items} className="productDefinition" />
              </ConfigProvider>
            </div>
          </Spin>
        </Col>

        <Col
          xl={18}
          span={24}
          style={{
            marginTop: "0rem",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Spin spinning={tableLoading}>
            {showTable && (
              <CustomTable
                columns={columns}
                dataSource={tableData}
                isFilter={true}
                onEdit={handleEditClick}
                actionColumnName={
                  <Button
                    type="link"
                    icon={<IoMdAddCircle fontSize={"1.5rem"} />}
                    onClick={() => {
                      navigate("/ProductDefinition/ShowCreateEditDefinition", {
                        state: {
                          record: tableData.length > 0 ? tableData[0] : null,
                        },
                      });
                    }}
                  />
                } 
              />
            )}
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDefinition;

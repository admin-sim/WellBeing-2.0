import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Layout, Popconfirm, Row, Table } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { useNavigate } from "react-router-dom";

function Referal() {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "SlNo",
    },
    {
      title: "Referrer Name",
      dataIndex: "ReferrerName",
    },
    {
      title: "Referrer Type",
      dataIndex: "ReferrerType",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
    },
    {
      title: "Qualification",
      dataIndex: "Qualification",
    },
    {
      title: "Address",
      dataIndex: "Address",
    },
    {
      title: "Area",
      dataIndex: "Area",
    },
    {
      title: "Pin",
      dataIndex: "Pin",
    },
    {
      title: "Landline Number",
      dataIndex: "LandlineNumber",
    },
    {
      title: "Mobile Number",
      dataIndex: "MobileNumber",
    },
    {
      title: "Contact Email",
      dataIndex: "Email",
    },
    {
      title: "Action",
      dataIndex: "Action",
      fixed: "right",
      width: "6rem",
      render: (text, record) => (
        <Row gutter={40}>
          <Col span={1}>
            <Button
              size="small"
              icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Col>
          <Col span={1}>
            <Popconfirm
              placement="topRight"
              title="Sure to delete this Referral?"
              //   onConfirm={() =>}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                style={{ marginLeft: "0.5rem" }}
                icon={
                  <DeleteOutlined
                    style={{ fontSize: "0.9rem", color: "red" }}
                  />
                }
              ></Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      SlNo: "1",
      ReferrerName: "Prabhu",
      ReferrerType: "Hospital",
      Gender: "Male",
      Qualification: "MBBS",
      Address: "Bengaluru",
      Area: "Kengeri",
      Pin: "560074",
      LandlineNumber: "0801234567",
      MobileNumber: "9876543210",
      Email: "abc@abc.com",
    },
  ];
  return (
    <>
      <Layout>
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
                Referral
              </Title>
            </Col>
            <Col offset={4} span={4}>
              <Button
                className="dfja"
                icon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/Referral/CreateEdit")}
              >
                Add New Referral
              </Button>
            </Col>
          </Row>
          <Row
            style={{
              display: "flex",
              justifyContent: "end",
              margin: "1rem 2rem 0rem 0.5rem",
            }}
          >
            <Col>
              <Input
                suffix={<SearchOutlined />}
                placeholder="Search"
                // onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />
            </Col>
          </Row>
          <Table
            size="small"
            bordered
            style={{ margin: "1rem 1rem" }}
            columns={columns}
            dataSource={data}
            // onChange={onChange}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
          />
        </div>
      </Layout>
    </>
  );
}

export default Referal;

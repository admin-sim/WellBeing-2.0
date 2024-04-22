import React, { useState, useCallback } from "react";
import { Table, Input, Space, Popconfirm, Button, ConfigProvider } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { debounce } from "lodash";

const CustomTable = ({
  columns,
  dataSource,
  isFilter,
  onDelete,
  onEdit,
  onView,
  size,
  actionColumn = true,
  style,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(
    debounce((value) => setSearchText(value.trim()), 200),
    []
  );

  const searchedData = searchText
    ? dataSource.filter((data) =>
        columns.some((col) =>
          data[col.dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      )
    : dataSource;

  const tableColumns = [
    ...columns.map((col) => ({
      ...col,
      sorter: (a, b) => {
        if (
          typeof a[col.dataIndex] === "number" &&
          typeof b[col.dataIndex] === "number"
        ) {
          return a[col.dataIndex] - b[col.dataIndex];
        }
        return a[col.dataIndex].localeCompare(b[col.dataIndex]);
      },
      render: (text) =>
        typeof text === "string" || typeof text === "number" ? (
          <Highlighter
            highlightStyle={{
              color: "blue",
              padding: 0,
              backgroundColor: "#fff",
              fontWeight: "500",
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text?.toString()}
          />
        ) : (
          text
        ),
    })),
  ];

  if (actionColumn) {
    tableColumns.push({
      title: "Action",
      key: "action",
      fixed: "right",
      width: "4rem",
      render: (text, record) => (
        <Space size="small">
          {onView && (
            <Button
              size="small"
              onClick={() => onView(record)}
              icon={<EyeOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          )}
          {onEdit && (
            <Button
              size="small"
              onClick={() => onEdit(record)}
              icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => onDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
              ></Button>
            </Popconfirm>
          )}
        </Space>
      ),
    });
  }

  return (
    <div style={{ padding: "1rem 0.5rem", backgroundColor: "#fff" }}>
      {isFilter && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Input
            placeholder="Search in table"
            suffix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "0.8rem", width: "30%" }}
          />
        </div>
      )}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#E6E6FA",
            },
          },
        }}
      >
        <Table
          style={style}
          columns={tableColumns}
          size={size ? size : "small"}
          bordered
          pagination={{
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          }}
          dataSource={searchedData}
        />
      </ConfigProvider>
    </div>
  );
};

export default CustomTable;

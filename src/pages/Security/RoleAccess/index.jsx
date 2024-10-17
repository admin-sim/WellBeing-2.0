import React, { useState, useEffect } from "react";
import {
  Tree,
  AutoComplete,
  Form,
  Col as AntdCol,
  Col,
  Button,
  Row,
  Input,
  notification,
  Table,
  Checkbox,
  Layout,
  Spin,
  Select,
} from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import {
  urlGetAllRoles,
  urlGetAllMenusBasedOnRoleId,
  urlSaveRoleAccess,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";

const { TreeNode } = Tree;

const RoleAccess = () => {
  const [originalOptions, setOriginalOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [roleLoading, setRoleLoading] = useState(true);
  const [accessdata, setAccessdata] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [selectedTreeNodeKey, setSelectedTreeNodeKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autocompleteLoader, setAutocompleteLoader] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]); // initial selected keys
  const ColWithSixSpan = ({ children, ...props }) => (
    <AntdCol xl={6} lg={6} md={12} span={24} {...props}>
      {children}
    </AntdCol>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(urlGetAllRoles);
        if (response.status === 200) {
          const data = response.data.data;
          setDisplayedOptions(data); // Initially display all data
        } else {
          console.error("Failed to fetch autocomplete data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setRoleLoading(false);

    fetchData();
  }, []);

  const onCheck = (keys) => {
    setCheckedKeys(keys);
  };

 

 

  const handleSave = async () => {
    //
    try {
      if (!selectedId) {
        notification.warning({
          message: "Warning",
          description: "Please select a UserRole before saving......",
        });
        return;
      }
      // Check if at least one menu item is checked
      if (checkedKeys.length === 0) {
        notification.warning({
          message: "Warning",
          description: "Please select at least one menu item......",
        });
        return;
      } else {
        const roleMenuArray = checkedKeys.map((mainMenuId) => ({
          Main_Menu_Id: mainMenuId,
          Role_Id: selectedId,
        }));

        const roleAccessData = {
          menus: roleMenuArray, // List<UserRoleMenuModel>
          tabaccess: accessdata, // List<MenuTabAccessModel>
          // List<Child>
        };
        const response = await customAxios.post(
          urlSaveRoleAccess,
          roleAccessData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Check the response and show appropriate notification
        if (response.status === 200) {
          notification.success({
            message: "Success",
            description: "Menu items saved successfully.",
          });
        } else {
          console.error("Failed to save checked menu items:", response);
          notification.error({
            message: "Error",
            description: "Failed to save checked menu items. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error while saving checked menu items:", error);
      notification.error({
        message: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const accessStatusTrueIds = [];
  const hasFalseDescendants = (item) => {
    if (item.children && item.children.length > 0) {
      return item.children.some(
        (child) => child.AccessStatus === false || hasFalseDescendants(child)
      );
    }
    return false;
  };

  const SelectedTreeData = (data) => {
    data.forEach((item) => {
      const hasFalseChildren = hasFalseDescendants(item);
      if (item.AccessStatus === true && !hasFalseChildren) {
        accessStatusTrueIds.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        SelectedTreeData(item.children);
      }
    });
  };

  const onSelect = async (value, option) => {
    setTableData([]);
    setLoading(true);
    try {
      setSelectedId(option.key);
      const roleId = parseInt(option.key);
      const response = await customAxios.get(
        `${urlGetAllMenusBasedOnRoleId}?RoleId=${roleId}`
      );
      if (response.status === 200) {
        const roleAccessData = response.data.data.RoleAccessMenus;
        const tabaccessdata = response.data.data.tabaccess;

        setAccessdata(tabaccessdata);
        //const { treeData, checkedKeys } = generateTreeData(roleAccessData);
        const treeData = roleAccessData;

        SelectedTreeData(roleAccessData);

        const checkedKeys = accessStatusTrueIds;
        setTreeData(treeData);
        setCheckedKeys(checkedKeys);
        setExpandedKeys([]);
        setSelectedTreeNodeKey(null); // deselect the tree node
        setSelectedSubMenu(null);
      } else {
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleTreeNodeClick = (selectedKeys, info) => {
    //
    // Update the selected tree node key
    setSelectedKeys(selectedKeys);
    setSelectedSubMenu(info.node.title);
    setSelectedTreeNodeKey(selectedKeys);
    const filteredTabs = accessdata.filter(
      (tab) => tab.MainMenuId === info.node.key
    );
    setTableData(filteredTabs);
    // setCheckedKeys([]);
  };

  const columns = [
    {
      title: "Tab Name",
      dataIndex: "Tab_Name",
      key: "Tab_Name",
    },
    {
      title: "Access Status",
      dataIndex: "AccessStatus",
      key: "AccessStatus",
      render: (text, record) => (
        <Checkbox
          checked={record.AccessStatus}
          //disabled={!record.AccessStatus}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
  ];

  // Initialize state with sample data
  const [tableData, setTableData] = useState([]);
  const handleCheckboxChange = (record) => {
    // Create a new array with updated AccessStatus for the clicked record
    const updatedTableData = tableData.map((item) =>
      item.MenuTabId === record.MenuTabId
        ? { ...item, AccessStatus: !item.AccessStatus }
        : item
    );

    // Create a new array with updated AccessStatus for the clicked record in accessdata
    const updatedAccessData = accessdata.map((item) =>
      item.MenuTabId === record.MenuTabId
        ? { ...item, AccessStatus: !item.AccessStatus }
        : item
    );

    // Update the table data state
    setTableData(updatedTableData);

    // Update the accessdata state
    setAccessdata(updatedAccessData);
  };

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <Layout.Content>
        <Row style={{ padding: "0 3rem", backgroundColor: "lavender" }}>
          <Col span={24}>
            <h2>Role Access</h2>
          </Col>
          <Col
            offset={8}
            span={4}
            style={{ display: "flex", alignItems: "center" }}
          ></Col>
        </Row>
        <Form>
          <Row gutter={32} style={{ margin: "1rem" }}>
            {/* <Col xl={8} lg={10} md={12} sm={12} xs={22}>
              <Form.Item
                name="UserRoleId"
                label="User Role"
                rules={[
                  {
                    required: true,
                    message: "Please select a valid UserRole!",
                  },
                  { validator: validateUserRole },
                ]}
              >
                <Spin spinning={autocompleteLoader}>
                  <AutoComplete
                    popupMatchSelectWidth={252}
                    style={{ width: "100%" }}
                    options={displayedOptions.map((option) => ({
                      value: option.RoleName,
                      label: option.RoleName,
                      key: option.Role_Id.toString(),
                    }))}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    onChange={(value) => {
                      if (!value) {
                        setTreeData([]);
                        setCheckedKeys([]);
                        setSelectedId(null);
                        setAccessdata([]);
                        setTableData([]);
                        setSelectedSubMenu(null);
                        setSelectedTreeNodeKey(null);
                        setSelectedKeys([]);
                      }
                    }}
                    allowClear={{
                      clearIcon: (
                        <CloseSquareFilled style={{ marginLeft: "-8em" }} />
                      ),
                    }}
                  >
                    <Input.Search
                      placeholder="Search for a UserRole"
                      enterButton
                    />
                  </AutoComplete>
                </Spin>
              </Form.Item>
            </Col> */}
            <ColWithSixSpan>
                <Form.Item
                  name="UserRoleId"
                 label="User Role"
                  rules={[
                    {
                      required: true,
                      message: "Please select UserRole.",
                    },
                  ]}
                >
                  <Select
                    loading={roleLoading}
                    allowClear
                    onSelect={onSelect}
                   // onSearch={handleSearch}
                    onChange={(value) => {
                      if (!value) {
                        setTreeData([]);
                        setCheckedKeys([]);
                        setSelectedId(null);
                        setAccessdata([]);
                        setTableData([]);
                        setSelectedSubMenu(null);
                        setSelectedTreeNodeKey(null);
                        setSelectedKeys([]);
                      }
                    }}
                    showSearch
                    placeholder="Search Role"
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {displayedOptions?.map((response) => (
                      <Select.Option
                        key={response.Role_Id}
                        value={response.Role_Id}
                      >
                        {response.RoleName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>

            <Col span={12}>
              <Form.Item>
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Spin spinning={loading}>
            <Row gutter={24} style={{ margin: "1rem 1rem 1rem 0rem" }}>
              <Col xs={15} span={12}>
                <Tree
                  checkable
                  checkedKeys={checkedKeys}
                  expandedKeys={expandedKeys}
                  onExpand={setExpandedKeys}
                  onCheck={onCheck}
                  treeData={treeData}
                  onSelect={handleTreeNodeClick}
                  selectedKeys={selectedKeys}
                />
              </Col>
              <Col
              
                offset={1}
                span={8}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {selectedSubMenu && (
                  <div style={{ marginBottom: "8px", width: "max-content" }}>
                    <Input
                      value={selectedSubMenu}
                      placeholder="Selected Submenu"
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <Table
                  style={{ width: "60%" }}
                  columns={columns}
                  dataSource={tableData}
                  size="small"
                />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default RoleAccess;

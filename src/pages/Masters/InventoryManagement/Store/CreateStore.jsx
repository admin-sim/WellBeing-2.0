import React, { useState, useEffect } from "react";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  PlusOutlined,
  PlusCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
import { useNavigate } from "react-router";
import {
  Collapse,
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  AutoComplete,
  Col,
  Card,
  Table,
  Checkbox,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import {
  urlCreateStore,
  urlAutocompleteProduct,
  urlEditStore,
  urlUpdateStore,
  urlAddNewStore,
} from "../../../../../endpoints.js";
import { useLocation } from "react-router-dom";
import FormItem from "antd/es/form/FormItem/index.js";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";

const CreateStore = () => {
  const [DropDown, setDropDown] = useState({
    StoreDetails: [],
    serviceLocations: [],
    StockLocators: [],
  });
  const location = useLocation();
  const [storeId, setStoreId] = useState(
    location.state == null ? 0 : location.state.StoreId
  );
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [buttonTitle1, setButtonTitle1] = useState("Cancel");
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [data, setData] = useState([]);
  const [accessRights, setAccessRights] = useState([]);
  const { Column, ColumnGroup } = Table;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await customAxios.get(urlCreateStore).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
        const newFunctions = apiData.StoreFunctions.map((item) => {
          return {
            ...item,
            Features: item.LookupDescription,
            StoreAccessRightId: item.LookupID,
            FeaturesId: item.LookupID,
            Id: 0,
          };
        });
        setAccessRights(newFunctions);
      });
      if (storeId > 0) {
        setData([]);
        setButtonTitle("Update");
        setButtonTitle1("Back");
        await customAxios
          .get(`${urlEditStore}?StoreId=${storeId}`)
          .then((response) => {
            const apiData = response.data.data;
            form.setFieldsValue({
              OP: apiData.newStoreModel.OP === "Y" ? true : false,
            });
            form.setFieldsValue({
              IP: apiData.newStoreModel.IP === "Y" ? true : false,
            });
            form.setFieldsValue({
              Direct: apiData.newStoreModel.Direct === "Y" ? true : false,
            });
            form.setFieldsValue({
              Store: apiData.newStoreModel.StoreServiceId,
            });
            form.setFieldsValue({ StoreType: apiData.newStoreModel.StoreType });
            form.setFieldsValue({ Remarks: apiData.newStoreModel.Remarks });
            form.setFieldsValue({
              DefaultParentStore:
                apiData.newStoreModel.DefaultParentStoreId == 0
                  ? null
                  : apiData.newStoreModel.DefaultParentStoreId,
            });
            form.setFieldsValue({
              Status: apiData.newStoreModel.Status.toLowerCase(),
            });
            form.setFieldsValue({ AssociatedProduct: null });
            form.setFieldsValue({
              StoreId: apiData.newStoreModel.StoreServiceId,
            });
            const newProductDetails = apiData.ProductDetails.map((item) => {
              return {
                ...item,
                Product: item.ProductName,
                key: item.ProductId,
              };
            });
            setData(newProductDetails);
            // for (let i = 0; i < apiData.ProductDetails.length; i++) {
            //   let j = apiData.ProductDetails[i].ProductId;
            //   form.setFieldsValue({
            //     [j]: { ProductId: j },
            //   });
            //   form.setFieldsValue({
            //     [j]: { Product: apiData.ProductDetails[i].ProductName },
            //   });
            //   form.setFieldsValue({
            //     [j]: { MinQty: apiData.ProductDetails[i].MinQty },
            //   });
            //   form.setFieldsValue({
            //     [j]: { MaxQty: apiData.ProductDetails[i].MaxQty },
            //   });
            //   form.setFieldsValue({
            //     [j]: { ROL: apiData.ProductDetails[i].ROL },
            //   });
            //   form.setFieldsValue({
            //     [j]: { ROQ: apiData.ProductDetails[i].ROQ },
            //   });
            //   form.setFieldsValue({
            //     [j]: { MinStock: apiData.ProductDetails[i].MinStock },
            //   });
            //   form.setFieldsValue({
            //     [j]: { LeadTime: apiData.ProductDetails[i].LeadTime },
            //   });
            //   form.setFieldsValue({
            //     [j]: { Contigency: apiData.ProductDetails[i].Contigency },
            //   });
            //   form.setFieldsValue({
            //     [j]: { IndentBasis: apiData.ProductDetails[i].IndentBasis },
            //   });
            //   form.setFieldsValue({
            //     [j]: { StockLocator: apiData.ProductDetails[i].StockLocator },
            //   });
            //   form.setFieldsValue({
            //     [j]: { Status: apiData.ProductDetails[i].ProductStatus },
            //   });
            //   form.setFieldsValue({
            //     [j]: {
            //       IsConsumptionAllowed:
            //         apiData.ProductDetails[i].Isconsumptionallowed == "Y"
            //           ? true
            //           : false,
            //     },
            //   });
            //   // if (i != 0) {
            //     handleAdd(apiData.ProductDetails[i]);
            //   // }
            // }
            const newAccessRights = apiData.AccessRights.map((item) => {
              return {
                ...item,
                Applicable: item.Applicable == "Y" ? true : false,
                SingleStage: item.SingleStage == "Y" ? true : false,
                Draft: item.Draft == "Y" ? true : false,
                Finalize: item.Draft == "Y" ? true : false,
              };
            });
            setAccessRights(newAccessRights);
          });
      }
      // setStoreId(0);
      setLoading(false);
    }
    fetchData();
  }, []);

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
    return dayjs(formattedDate, "DD-MM-YYYY");
  };

  const navigate = useNavigate();
  const handleSearch = () => {
    navigate("/Store");
  };

  const onFinish = async (values) => {
    debugger;
    const StoreModel = {
      StoreId: storeId,
      StoreServiceId: values.Store,
      StoreType: values.StoreType,
      Remarks: values.Remarks,
      DefaultParentStoreId: values.DefaultParentStore ?? 0,
      Status: values.Status,
      OP: values.OP === undefined || values.OP === true ? "True" : "N",
      IP: values.IP === undefined || values.IP === true ? "True" : "N",
      Direct:
        values.Direct === undefined || values.Direct === true ? "True" : "N",
      FacilityId: 1,
    };
    if (StoreModel.StoreServiceId === StoreModel.DefaultParentStoreId) {
      message.warning("Default Parent Store cannot be same as Store");
      return false;
    }
    const newAccessRights = accessRights.map((item) => {
      return {
        ...item,
        Applicable: item.Applicable == true ? "Y" : "N",
        SingleStage: item.SingleStage == true ? "Y" : "N",
        Draft: item.Draft == true ? "Y" : "N",
        Finalize: item.Finalize == true ? "Y" : "N",
      };
    });
    const postData = {
      newStoreModel: StoreModel,
      ProductDetails: data,
      AccessRights: newAccessRights,
    };
    try {
      if (storeId > 0) {
        const response = await customAxios.post(urlUpdateStore, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.data === 1) {
          message.success("Success! Store record successfully updated.");
          handleSearch();
        } else {
          message.error("Error to Update");
        }
      } else {
        const response = await customAxios.post(urlAddNewStore, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.data === -1) {
          message.error("Failed");
        } else if (response.data.data === -2) {
          message.warning("Already Exists");
        } else {
          message.success("Success! Store record Saved.");
        }
        handleSearch();
      }
      handleCancel();
    } catch (error) {
      // Handle error
    }
  };

  const onReset = (value) => {
    debugger;
    if (value != undefined) {
      handleSearch();
    } else {
      form.resetFields();
    }
  };

  const disabledEffectiveToDate = (current) => {
    debugger;
    const effectiveFrom = form.getFieldValue("EffectiveFrom");
    if (!effectiveFrom) {
      return false;
    }
    return current && current < effectiveFrom.startOf("day");
  };

  const getPanelValue = async (searchText, key) => {
    try {
      customAxios
        .get(`${urlAutocompleteProduct}?Product=${searchText}`)
        .then((response) => {
          const apiData = response.data.data;
          const newOptions = apiData.map((item) => ({
            value: item.LongName,
            key: item.ProductDefinitionId,
            ProductId: item.ProductId,
            UomId: item.UOMPrimaryUOM,
          }));
          setAutoCompleteOptions(
            newOptions.filter(
              (item) => !data.some((i) => i.ProductId === item.ProductId)
            )
          );
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
  };

  const handleSelect = (value, option, key) => {
    debugger;
    const updated = data.map((item) =>
      item.ProductId === 0 && item.key === 0
        ? {
            ...item,
            key: option.ProductId,
            ProductName: option.value,
            ProductId: option.ProductId,
          }
        : item
    );
    setData(updated);
    // try {
    //   customAxios
    //     .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
    //     .then((response) => {
    //       debugger;
    //       const apiData = response.data.data;
    //     });
    // } catch (error) {
    //   //console.error("Error fetching purchase order details:", error);
    // }
  };

  function ApplicableChange(e, record) {
    const checked = e.target.checked;
    const updated = accessRights.map((item) =>
      item.StoreAccessRightId === record.StoreAccessRightId
        ? {
            ...item,
            Applicable: checked,
            SingleStage: checked,
            Draft: false,
            Finalize: false,
          }
        : item
    );
    setAccessRights(updated);
    form.setFieldsValue({
      SingleStage: {
        [record.StoreAccessRightId]: checked,
      },
    });
    form.setFieldsValue({
      Draft: {
        [record.StoreAccessRightId]: false,
      },
    });
    form.setFieldsValue({
      Finalize: {
        [record.StoreAccessRightId]: false,
      },
    });
  }

  function SingleStageChange(e, record) {
    const checked = e.target.checked;
    const updated = accessRights.map((item) =>
      item.StoreAccessRightId === record.StoreAccessRightId
        ? { ...item, SingleStage: checked, Draft: !checked, Finalize: !checked }
        : item
    );
    setAccessRights(updated);
    form.setFieldsValue({
      Draft: {
        [record.StoreAccessRightId]: !checked,
      },
    });
    form.setFieldsValue({
      Finalize: {
        [record.StoreAccessRightId]: !checked,
      },
    });
  }

  function DraftChange(e, record) {
    const checked = e.target.checked;
    const updated = accessRights.map((item) =>
      item.StoreAccessRightId === record.StoreAccessRightId
        ? { ...item, Draft: checked, Finalize: checked, SingleStage: !checked }
        : item
    );
    form.setFieldsValue({
      Draft: {
        [record.StoreAccessRightId]: checked,
      },
    });
    form.setFieldsValue({
      Finalize: {
        [record.StoreAccessRightId]: checked,
      },
    });
    form.setFieldsValue({
      SingleStage: {
        [record.StoreAccessRightId]: !checked,
      },
    });
  }

  const handleAdd = (item) => {
    form.validateFields().then(() => {
      setData((prevData) => {
        const newRow = {
          key: 0,
          ProductId: 0,
          Product: "",
          MinQty: 0,
          MaxQty: 0,
          ROL: 0,
          ROQ: 0,
          MinStock: 0,
          LeadTime: 0,
          Contigency: 0,
          IndentBasis: "Reorder Level",
          StockLocatorId: 10108,
          ProductStatus: "True",
          IsConsumptionAllowed: "Y",
        };
        return [...prevData, newRow];
      });
    });
  };

  const defaultColumns = [
    {
      title: "Product",
      width: 250,
      dataIndex: "Product",
      key: "Product",
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "Product"]}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            initialValue={record.Product}
          >
            <AutoComplete
              disabled={record.StoreId ? true : false}
              options={autoCompleteOptions}
              onSearch={(value) => getPanelValue(value, record.key)}
              onSelect={(value, option) =>
                handleSelect(value, option, record.key)
              }
              placeholder="Search for a product"
              allowClear
            />
          </Form.Item>
          <FormItem
            name={[record.key, "ProductId"]}
            initialValue={record.ProductId}
            hidden
          >
            <Input></Input>
          </FormItem>
        </>
      ),
    },
    {
      title: "Min. Qty",
      dataIndex: "MinQty",
      key: "MinQty",
      render: (_, record) => (
        <Form.Item name={[record.key, "MinQty"]} initialValue={record.MinQty}>
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "Max. Qty",
      dataIndex: "MaxQty",
      key: "MaxQty",
      render: (_, record) => (
        <Form.Item name={[record.key, "MaxQty"]} initialValue={record.MaxQty}>
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "ROL",
      dataIndex: "ROL",
      key: "ROL",
      render: (_, record) => (
        <Form.Item name={[record.key, "ROL"]} initialValue={record.ROL}>
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "ROQ",
      dataIndex: "ROQ.",
      key: "ROQ",
      render: (_, record) => (
        <Form.Item name={[record.key, "ROQ"]} initialValue={record.ROQ}>
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "Min. Stock",
      dataIndex: "MinStock",
      key: "MinStock",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "MinStock"]}
          initialValue={record.MinStock}
        >
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "Lead Time.",
      dataIndex: "LeadTime",
      key: "LeadTime",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "LeadTime"]}
          initialValue={record.LeadTime}
        >
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "Contigency %",
      dataIndex: "Contigency%",
      key: "Contigency%",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "Contigency"]}
          initialValue={record.Contigency}
        >
          <Input></Input>
        </Form.Item>
      ),
    },
    {
      title: "Indent Basis",
      dataIndex: "IndentBasis",
      width: 150,
      key: "IndentBasis",
      render: (_, record) => (
        <Form.Item name={[record.key, "IndentBasis"]}>
          <Select defaultValue="Reorder Level">
            <Select.Option key="Reorder Level" value="Reorder Level">
              Reorder Level
            </Select.Option>
            <Select.Option key="Top up" value="Top up">
              Top up
            </Select.Option>
            <Select.Option key="Manual" value="Manual">
              Manual
            </Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocatorId",
      width: 150,
      key: "StockLocatorId",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "StockLocatorId"]}
          initialValue={record.StockLocatorId}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Select>
            {(DropDown.StockLocators || []).map((i) => (
              <Select.Option key={i.Id} value={i.Id}>
                {i.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 150,
      key: "Status",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "Status"]}
          initialValue={record.ProductStatus}
        >
          <Select>
            <Select.Option key="True" value="True">
              Active
            </Select.Option>
            <Select.Option key="false" value="false">
              Hidden
            </Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Is Consumption Allowed",
      dataIndex: "IsConsumptionAllowed",
      key: "IsConsumptionAllowed",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "IsConsumptionAllowed"]}
          valuePropName="checked"
          initialValue={record.Isconsumptionallowed === "Y" ? true : false}
        >
          <Checkbox />
        </Form.Item>
      ),
    },
    // {
    //   title: (
    //     <Button
    //       type="primary"
    //       icon={<PlusOutlined />}
    //       onClick={handleAdd}
    //     ></Button>
    //   ),
    //   dataIndex: "add",
    //   key: "add",
    //   width: 50,
    //   // render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
    //   //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    // },
  ];

  const items = [
    {
      key: "1",
      label: "Product",
      children: (
        // <Table dataSource={data} columns={defaultColumns}>
        //   pagination=
        //   {{
        //     onChange: (current, pageSize) => {
        //       setPage(current);
        //       setPaginationSize(pageSize);
        //     },
        //     defaultPageSize: 5,
        //     hideOnSinglePage: true,
        //     showSizeChanger: true,
        //     showTotal: (total, range) =>
        //       `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        //   }}
        //   rowKey={(row) => row.AppUserId}
        //   size="small" bordered
        // </Table>
        <CustomTable
          dataSource={data}
          columns={defaultColumns}
          paginationSize={5}
          // rowKey={(row) => row.key}
          size="small"
          actionColumnName={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            />
          }
          bordered
        />
      ),
    },
    {
      key: "2",
      label: "Access Rights",
      children: (
        <div>
          <div style={{ display: "flex" }}>
            <Form.Item
              name="OP"
              label="OP"
              valuePropName="checked"
              defaultValue={true}
            >
              <Checkbox defaultChecked></Checkbox>
            </Form.Item>
            <Form.Item
              name="IP"
              label="IP"
              valuePropName="checked"
              defaultValue={true}
            >
              <Checkbox defaultChecked></Checkbox>
            </Form.Item>
            <Form.Item
              name="Direct"
              label="Direct"
              valuePropName="checked"
              defaultValue={true}
            >
              <Checkbox defaultChecked></Checkbox>
            </Form.Item>
          </div>
          {/* <Table columns={acceessColumns} dataSource={accessRights} /> */}
          <Table dataSource={accessRights}>
            <Column title="Features" dataIndex="Features" key="Features" />
            <Column
              title="Applicable"
              dataIndex="Applicable"
              key="Applicable"
              render={(_, record) => (
                <Form.Item
                  name={["Applicable", record.StoreAccessRightId]}
                  valuePropName="checked"
                  initialValue={record.Applicable}
                >
                  <Checkbox
                    value={record.Applicable}
                    onChange={(e) => ApplicableChange(e, record)}
                  ></Checkbox>
                </Form.Item>
              )}
            />
            <Column
              title="Single Stage"
              dataIndex="SingleStage"
              key="SingleStage"
              render={(_, record) => (
                <Form.Item
                  name={["SingleStage", record.StoreAccessRightId]}
                  valuePropName="checked"
                  initialValue={record.SingleStage}
                >
                  <Checkbox
                    disabled={
                      !form.getFieldValue([
                        "Applicable",
                        record.StoreAccessRightId,
                      ])
                    }
                    onChange={(e) => SingleStageChange(e, record)}
                  ></Checkbox>
                </Form.Item>
              )}
            />
            <ColumnGroup title="Multi Stage">
              <Column
                title="Draft"
                dataIndex="Draft"
                key="Draft"
                render={(_, record) => (
                  <Form.Item
                    name={["Draft", record.StoreAccessRightId]}
                    valuePropName="checked"
                    initialValue={record.Draft}
                  >
                    <Checkbox
                      onChange={(e) => DraftChange(e, record)}
                      disabled={
                        !form.getFieldValue([
                          "Applicable",
                          record.StoreAccessRightId,
                        ])
                      }
                    ></Checkbox>
                  </Form.Item>
                )}
              />
              <Column
                title="Finalize"
                dataIndex="Finalize"
                key="Finalize"
                render={(_, record) => (
                  <Form.Item
                    name={["Finalize", record.StoreAccessRightId]}
                    valuePropName="checked"
                    initialValue={record.Finalize}
                  >
                    <Checkbox
                      onChange={(e) => DraftChange(e, record)}
                      disabled={
                        !form.getFieldValue([
                          "Applicable",
                          record.StoreAccessRightId,
                        ])
                      }
                    ></Checkbox>
                  </Form.Item>
                )}
              />
            </ColumnGroup>
          </Table>
        </div>
      ),
    },
  ];

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
        <PageHeader
          title={"Create Store"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleSearch}
        />
        <Spin spinning={loading} tip="Loading..." size="medium">
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
              initialValues={{
                StoreType: "Main Store",
                Status: "true",
                IP: true,
                OP: true,
                Direct: true,
              }}
              onFinish={onFinish}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Store"
                    name="Store"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select disabled={buttonTitle === "Update" ? true : false}>
                      {DropDown.serviceLocations.map((Option) => (
                        <Select.Option
                          key={Option.ServiceLocationId}
                          value={Option.ServiceLocationId}
                        >
                          {Option.ServiceLocationName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="StoreId" hidden>
                    <Input></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Store Type"
                    name="StoreType"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option key="Main Store">Main Store</Select.Option>
                      <Select.Option key="Sub Store">Sub Store</Select.Option>
                      <Select.Option key="Pharmacy">Pharmacy</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Remarks Person" name="Remarks">
                    <TextArea allowClear></TextArea>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="DefaultParentStore"
                    label="Default Parent Store"
                  >
                    <Select allowClear>
                      {(DropDown.StoreDetails || []).map((Option) => (
                        <Select.Option key={Option.Id} value={Option.Id}>
                          {Option.Name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option key="true" value="true">
                        Active
                      </Select.Option>
                      <Select.Option key="false" value="false">
                        Hidden
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="AssociatedProduct"
                    label="Associated Product"
                  >
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col style={{ marginRight: "1rem" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {buttonTitle}
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="default" onClick={() => navigate("/Store")}>
                      {buttonTitle1}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <hr />
              <Collapse items={items} />
            </Form>
          </Card>
        </Spin>
      </div>
    </Layout>
  );
};

export default CreateStore;

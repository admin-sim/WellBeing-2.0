import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, DatePicker, Divider, notification, Table, Modal, Tooltip, Skeleton, Checkbox, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { urlFacilityPriceDefinitionIndex ,urlGetPriceDefinitionsForFacility} from '../../../../../endpoints';
import customAxios from '../../../../components/customAxios/customAxios';
import Title from 'antd/es/typography/Title';
const { TextArea } = Input;

const FacilityPriceDefinition = () => {

  const [facilitys, setFacilitys] = useState([]);
  const [pricedefinitions, setPricedefinitions] = useState([]);


  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const navigate = useNavigate();
 







  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        const response = await customAxios.get(`${urlFacilityPriceDefinitionIndex}`);
        if (response.status === 200 && response.data.data!=null) {
          const data = response.data.data;
          setFacilitys(data);
        
        } else {
          console.error('Failed to fetch service groups or response data is incomplete');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleFacilityChange = async (value) => {
    debugger;
    if (value != null) {
    
      // Call your API here using the selected LookupID
      const response = await customAxios.get(`${urlGetPriceDefinitionsForFacility}?facilityId=${value}`);
      //const data = await response.json();
      if (response.status === 200 && response.data.data!=null) {
        const data = response.data.data.ServicePriceDefinitions;
        setPricedefinitions(data);
      }
    } else {
      // Clear the service classifications if the service group is cleared
      setPricedefinitions([]);
     // form.setFieldsValue({ ServiceClassifications: null });
     

    }
  };

  const handleEdit = async (value) => {
    debugger;
    if (value != null) {
    
      navigate("/EditPriceDefinition", { state: { value } });
    }
    
 
  };








  const columns = [
   
    {
      title: 'FacilityName',
      dataIndex: 'FacilityName',
      key: 'FacilityName',
    },
    {
      title: 'BasePriceName',
      dataIndex: 'BasePriceName',
      key: 'BasePriceName',

    },
    {
      title: 'EffectiveFromDate',
      dataIndex: 'EffectiveFromDatestring',
      key: 'EffectiveFromDatestring',
    },
    {
      title: 'EffectiveToDate',
      dataIndex: 'EffectiveToDatestring',
      key: 'EffectiveToDatestring',

    },
 

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, row) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined  />} onClick={() => handleEdit(row)} />
          </Tooltip>
        </>
      ),
    },
  ];

  const onFinish = async (values) => {
   
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>

        <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
              FacilityPriceDefinition
            </Title>
          </Col>
       
        </Row>

        <Form
          layout="vertical"

          variant="outlined"
          size="default"
          style={{ padding: '0rem 2rem' }}
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Facility"
                  name="Facility"
                  rules={[
                    {
                      required: true,
                      message: 'Facility Is Required'
                    }
                  ]}
                >
                  <Select allowClear onChange={handleFacilityChange}>
                    {facilitys.map((option) => (
                      <Select.Option key={option.FacilityId} value={option.FacilityId}>
                        {option.FacilityName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left"></Divider>
        <Table
          style={{ padding: '0rem 2rem' }}
          dataSource={pricedefinitions}
          columns={columns}
        
          rowKey={(row) => row.FacilityId} // Specify the custom id property here
          size="small"
          bordered
         
        />
       
      </div>
    </Layout>
  );
};
export default FacilityPriceDefinition;
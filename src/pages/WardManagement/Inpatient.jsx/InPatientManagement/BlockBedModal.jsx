import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import React from "react";
import dayjs from "dayjs";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlBlockBed, urlUnblockBed } from "../../../../../endpoints.js";

const { Text } = Typography;

function BlockBedModal({ bed, open, handleClose, Dropdown }) {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        title={
          <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            {(Dropdown.NewWardModel || {}).ID === 1 ? 'Block Bed' : 'Unblock Bed'}
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <Text> Ward / Bed : </Text>
        <Text type="danger">
          {bed.WardName} / {bed.BedNo}
        </Text>
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            debugger
            const block = {
              BedId: bed.BedID,
              ReasonForBlock: values.BlockReason,
              dateBlock: values.BlockTill ? values.BlockTill.format('DD-MM-YYYY') : '',
              timeBlock: values.BlockTill ? values.BlockTill.format('HH:mm:ss') : '',
              Remarks: values.Remarks ? values.Remarks : '',
              LocationId: bed.ServiceLocationId
            }
            const response = Dropdown.NewWardModel.ID === 1 ?
              await customAxios.get(
                `${urlBlockBed}?BedId=${block.BedId}&ReasonForBlock=${block.ReasonForBlock}&dateBlock=${block.dateBlock}&timeBlock=${block.timeBlock}&Remarks=${block.Remarks}&LocationId=${block.LocationId}`)
              :
              await customAxios.get(
                `${urlUnblockBed}?BedId=${block.BedId}&LocationId=${block.LocationId}`
              );
            if (response.status === 200 && response.data == 'Success') {
              message.success(response.data)
              form.resetFields()
            }
            handleClose();
          }}
          initialValues={{
            BlockTill: dayjs()
          }}
        >
          {(Dropdown.NewWardModel || {}).ID === 1 ?
            <>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="BlockReason"
                label="Reason For Block"
                rules={[
                  {
                    required: true,
                    message: "Please select Reason",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} placeholder='Select Reason' allowClear>
                  {(Dropdown.ReasonForBlock || []).map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="BlockTill"
                label="Block Till"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Lookup Description",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime={{ format: "hh:mm A" }}
                  format="dddd , DD-MM-YYYY , hh:mm A"
                />
              </Form.Item>
              <Form.Item name="Remarks" label="Remarks">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </>
            :
            <>
              <Row>
                <Col span={24}><b>BlockReason</b></Col>
              </Row>
              <Row>
                <Col span={24}>{(Dropdown.BedDetails || {}).ReasonForBlock}</Col>
              </Row>
              <Row>
                <Col span={24}><b>BlockReason</b></Col>
              </Row>
              <Row>
                <Col span={24}>{(Dropdown.BedDetails || {}).BlockTimeString}</Col>
              </Row>
              <Row>
                <Col span={24}><b>Remarks</b></Col>
              </Row>
              <Row>
                <Col span={24}>{(Dropdown.BedDetails || {}).Remarks}</Col>
              </Row>
            </>
          }
          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={15} span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="default" onClick={handleClose}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
}

export default BlockBedModal;

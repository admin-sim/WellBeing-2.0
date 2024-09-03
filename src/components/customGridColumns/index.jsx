import { Col as AntdCol, Col } from "antd";

const ColWithThreeSpan = ({ children, ...props }) => (
  <AntdCol xl={3} lg={5} md={7} sm={6} xs={6} span={12} {...props}>
    {children}
  </AntdCol>
);
const ColWithSixSpan = ({ children, ...props }) => (
  <AntdCol xl={6} lg={6} md={12} xs={12} span={24} {...props}>
    {children}
  </AntdCol>
);
const ColWithSevenSpan = ({ children, ...props }) => (
  <AntdCol xl={7} lg={7} md={7} xs={15} span={24} {...props}>
    {children}
  </AntdCol>
);
const ColWithEightSpan = ({ children, ...props }) => (
  <AntdCol xl={8} lg={8} md={12} span={24} {...props}>
    {children}
  </AntdCol>
);
const ColWithNineSpan = ({ children, ...props }) => (
  <Col xl={9} lg={9} md={9} span={24} {...props}>
    {children}
  </Col>
);
const ColWithTwelveSpan = ({ children, ...props }) => (
  <Col xl={12} lg={12} md={24} span={24} {...props}>
    {children}
  </Col>
);
const ColWithSixteenSpan = ({ children, ...props }) => (
  <Col xl={16} lg={16} md={24} span={24} {...props}>
    {children}
  </Col>
);

export {
  ColWithSixSpan,
  ColWithSevenSpan,
  ColWithThreeSpan,
  ColWithNineSpan,
  ColWithEightSpan,
  ColWithTwelveSpan,
  ColWithSixteenSpan,
};

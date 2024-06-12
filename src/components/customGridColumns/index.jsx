import { Col as AntdCol, Col } from "antd";

const ColWithThreeSpan = ({ children, ...props }) => (
  <AntdCol xl={2} lg={3} md={3} sm={4} xs={8} span={12} {...props}>
    {children}
  </AntdCol>
);
const ColWithSixSpan = ({ children, ...props }) => (
  <AntdCol xl={6} lg={6} md={12} span={24} {...props}>
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

export {
  ColWithSixSpan,
  ColWithThreeSpan,
  ColWithNineSpan,
  ColWithEightSpan,
  ColWithTwelveSpan,
};

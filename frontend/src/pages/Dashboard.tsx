import { Card, Row, Col, Statistic } from 'antd';
import { UserAddOutlined, InstagramOutlined, FileImageOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useGetAccountsQuery, useGetContentQuery } from '../app/api/apiSlice';

export default function Dashboard() {
  const { data: accounts = [] } = useGetAccountsQuery();
  const { data: content = [] } = useGetContentQuery();

  const published = content.filter((c: any) => c.status === 'published').length;

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Instagram Accounts"
              value={accounts.length}
              prefix={<InstagramOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Content Items"
              value={content.length}
              prefix={<FileImageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Published"
              value={published}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import { Table, Button, Tag, Card, message, Space } from 'antd';
import { DownloadOutlined, SendOutlined } from '@ant-design/icons';
import { useGetContentQuery, useTriggerDownloadMutation, usePublishContentMutation, useGetParentAccountsQuery } from '../app/api/apiSlice';

export default function Content() {
  const { data: content = [], refetch } = useGetContentQuery();
  const { data: parentAccounts = [] } = useGetParentAccountsQuery();
  const [triggerDownload] = useTriggerDownloadMutation();
  const [publishContent] = usePublishContentMutation();

  const handleDownload = async (parentAccountId: string) => {
    try {
      await triggerDownload(parentAccountId).unwrap();
      message.success('Download started!');
      refetch();
    } catch (err) {
      message.error('Download failed');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishContent(id).unwrap();
      message.success('Published!');
      refetch();
    } catch (err) {
      message.error('Publish failed');
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'default',
    processing: 'processing',
    ready: 'blue',
    published: 'green',
    failed: 'red',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Content</h1>
        <Space>
          {parentAccounts.map((pa: any) => (
            <Button 
              key={pa.id} 
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(pa.id)}
            >
              Download from @{pa.username}
            </Button>
          ))}
        </Space>
      </div>

      <Card>
        <Table 
          dataSource={content} 
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', render: (id: string) => id.slice(0, 8) },
            { title: 'External ID', dataIndex: 'externalMediaId', key: 'externalMediaId' },
            { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              render: (status: string) => (
                <Tag color={statusColors[status] || 'default'}>{status}</Tag>
              )
            },
            { 
              title: 'Caption', 
              dataIndex: 'originalCaption', 
              key: 'caption',
              render: (cap: string) => cap?.slice(0, 50) || '-'
            },
            { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
            {
              title: 'Actions',
              key: 'actions',
              render: (_: any, record: any) => (
                record.status === 'ready' && (
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<SendOutlined />}
                    onClick={() => handlePublish(record.id)}
                  >
                    Publish
                  </Button>
                )
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Card, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAccountsQuery, useGetParentAccountsQuery, useAddAccountMutation, useAddParentAccountMutation, useDeleteAccountMutation } from '../app/api/apiSlice';

export default function Accounts() {
  const { data: accounts = [], refetch } = useGetAccountsQuery();
  const { data: parentAccounts = [] } = useGetParentAccountsQuery();
  const [addAccount] = useAddAccountMutation();
  const [addParent] = useAddParentAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [parentForm] = Form.useForm();

  const handleAddAccount = async (values: any) => {
    try {
      await addAccount(values).unwrap();
      message.success('Account added!');
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch {
      message.error('Failed to add account');
    }
  };

  const handleAddParent = async (values: any) => {
    try {
      await addParent(values).unwrap();
      message.success('Parent account added!');
      setIsParentModalOpen(false);
      parentForm.resetFields();
    } catch {
      message.error('Failed to add parent account');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id).unwrap();
      message.success('Account deleted');
      refetch();
    } catch {
      message.error('Failed to delete');
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      )
    },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Instagram Accounts</h1>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsParentModalOpen(true)} style={{ marginRight: 8 }}>
            Add Parent Account
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Connect Account
          </Button>
        </div>
      </div>

      <Card title="Connected Accounts" style={{ marginBottom: 16 }}>
        <Table dataSource={accounts} columns={columns} rowKey="id" />
      </Card>

      <Card title="Parent Accounts (Sources)">
        <Table dataSource={parentAccounts} rowKey="id" 
          columns={[
            { title: 'Username', dataIndex: 'username', key: 'username' },
            { title: 'Schedule', dataIndex: 'schedule', key: 'schedule' },
            { 
              title: 'Active', 
              dataIndex: 'isActive', 
              key: 'isActive',
              render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Paused'}</Tag>
            },
          ]} 
        />
      </Card>

      {/* Connect Account Modal */}
      <Modal title="Connect Instagram Account" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={handleAddAccount} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessToken" label="Access Token" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="accountId" label="Account ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Connect
          </Button>
        </Form>
      </Modal>

      {/* Parent Account Modal */}
      <Modal title="Add Parent Account (Source)" open={isParentModalOpen} onCancel={() => setIsParentModalOpen(false)} footer={null}>
        <Form form={parentForm} onFinish={handleAddParent} layout="vertical">
          <Form.Item name="username" label="Parent Username" rules={[{ required: true }]}>
            <Input placeholder="@parent_account" />
          </Form.Item>
          <Form.Item name="instagramAccountId" label="Child Account" rules={[{ required: true }]}>
            <Input placeholder="Select account ID" />
          </Form.Item>
          <Form.Item name="schedule" label="Schedule (cron)" initialValue="0 0 * * *">
            <Input placeholder="0 0 * * *" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

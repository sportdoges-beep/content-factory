import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DashboardOutlined, InstagramOutlined, FileImageOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../features/auth/authSlice';

const { Header } = Layout;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/accounts', icon: <InstagramOutlined />, label: 'Accounts' },
    { key: '/content', icon: <FileImageOutlined />, label: 'Content' },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: '0 24px 0 0' }}>Content Factory</h2>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', flex: 1 }}
        />
      </div>
      <Button icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
}

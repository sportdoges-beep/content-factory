import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Content from './pages/Content';
import Navbar from './components/Navbar';
import { RootState } from './app/store';

const { Content: AntContent, Sider } = Layout;

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <Layout>
                  <Sider width={200} style={{ background: '#fff' }}>
                    <div style={{ padding: '16px' }}>
                      <h3>Content Factory</h3>
                    </div>
                  </Sider>
                  <AntContent style={{ padding: '24px', background: '#fff' }}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/accounts" element={<Accounts />} />
                      <Route path="/content" element={<Content />} />
                    </Routes>
                  </AntContent>
                </Layout>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

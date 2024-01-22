import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Authentication/Login';
import Logout from './components/Authentication/Logout';
import Register from './components/Authentication/register';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './components/Authentication/ForgotPassword';
import EmailAction from './components/Authentication/EmailAction';
import AUTH_ROLES from './utils/auth_config';
import ProtectedRoute from './utils/ProtectedRoute';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const App = () => {
  return (
      <ChakraProvider>
        <CookiesProvider>
          <Router>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/forgotpassword" element={<ForgotPassword />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/emailAction" element={<EmailAction redirectPath="/" />} />
              <Route
                exact
                path="/dashboard"
                element={
                  <ProtectedRoute
                    Component={Dashboard}
                    redirectPath="/"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
            </Routes>
          </Router>
        </CookiesProvider>
      </ChakraProvider>
  );
};

export default App;

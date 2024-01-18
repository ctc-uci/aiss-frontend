import './App.css';
import EmailSending from './components/EmailTemplates/EmailSending';
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Authentication/Login';
import Logout from './components/Authentication/Logout';
import SignUp from './components/Authentication/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './components/Authentication/ForgotPassword';
import EmailAction from './components/Authentication/EmailAction';
import AUTH_ROLES from './utils/auth_config';
import ProtectedRoute from './utils/ProtectedRoute';
import Catalog from './pages/Catalog/Catalog';
import PublishedSchedule from './pages/PublishedSchedule/PublishedSchedule';
import Playground from './pages/Playground/Playground';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const App = () => {
  return (
      <ChakraProvider>
        <EmailSending />
        <CookiesProvider>
          <Router>
            <Routes>
              <Route
                exact path="/"
                element={
                  <ProtectedRoute
                    Component={PublishedSchedule}
                    redirectPath='/login'
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/forgotpassword" element={<ForgotPassword />} />
              <Route exact path="/signUp" element={<SignUp />} />
              <Route exact path="/emailAction" element={<EmailAction redirectPath="/" />} />
              <Route
                exact
                path="/dashboard"
                element={
                  <ProtectedRoute
                    Component={Dashboard}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route
                exact path="/catalog"
                element={
                  <ProtectedRoute
                    Component={Catalog}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route exact path="/publishedSchedule"
                element={
                  <ProtectedRoute
                    Component={PublishedSchedule}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route exact path="/playground" element={<Playground />}/>
            </Routes>
          </Router>
        </CookiesProvider>
      </ChakraProvider>
  );
};

export default App;

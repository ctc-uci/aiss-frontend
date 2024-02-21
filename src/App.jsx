import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes, Outlet, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Authentication/Login';
import Logout from './components/Authentication/Logout';
import SignUp from './components/Authentication/SignUp';
import Notifications from './pages/Notifications/Notifications';
import ForgotPassword from './components/Authentication/ForgotPassword';
import EmailAction from './components/Authentication/EmailAction';
import AUTH_ROLES from './utils/auth_config';
import ProtectedRoute from './utils/ProtectedRoute';
import Catalog from './pages/Catalog/Catalog';
import PublishedSchedule from './pages/PublishedSchedule/PublishedSchedule';
import Playground from './pages/Playground/Playground';
import Planner from './pages/Planner/Planner';
import Navbar from './components/Navbar/Navbar';
import { auth, getCurrentUser } from './utils/auth_utils';
// import getCurrentUser from './utils/auth_utils';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;
const currentUser = await getCurrentUser(auth);
console.log(currentUser);

const App = () => {
  const NavBarWrapper = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );
  return (
    <ChakraProvider>
      <CookiesProvider>
        <Router>
          <Routes>
            <Route element={currentUser ? <NavBarWrapper /> : null}>
              <Route
                exact
                path="/"
                element={
                  <ProtectedRoute
                    Component={PublishedSchedule}
                    redirectPath="/login"
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
                path="/notifications"
                element={
                  <ProtectedRoute
                    Component={Notifications}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route
                exact
                path="/catalog"
                element={
                  <ProtectedRoute
                    Component={Catalog}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route
                exact
                path="/publishedSchedule"
                element={
                  <ProtectedRoute
                    Component={PublishedSchedule}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, USER_ROLE]}
                  />
                }
              />
              <Route exact path="/playground" element={<Playground />} />
              <Route exact path="/planner" element={<Planner />} />
            </Route>
          </Routes>
        </Router>
      </CookiesProvider>
    </ChakraProvider>
  );
};

export default App;

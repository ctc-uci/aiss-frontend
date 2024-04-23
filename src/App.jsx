import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes, Outlet, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Authentication/Login';
import Logout from './components/Authentication/Logout';
import SignUp from './components/Authentication/SignUp';
import ForgotPassword from './components/Authentication/ForgotPassword';
import EmailAction from './components/Authentication/EmailAction';
import AwaitConfirmation from './components/Authentication/AwaitConfirmation';
import ForgotPasswordConfirmation from './components/Authentication/ForgotPasswordConfirmation';
import AUTH_ROLES from './utils/auth_config';
import ProtectedRoute from './utils/ProtectedRoute';
import Catalog from './pages/Catalog/Catalog';
import PublishedSchedule from './pages/PublishedSchedule/PublishedSchedule';
import Playground from './pages/Playground/Playground';
import Planner from './pages/Planner/Planner';
import Navbar from './components/Navbar/Navbar';
import Accounts from './pages/Accounts/Accounts';
import { AuthContextProvider, useAuthContext } from './common/AuthContext';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const App = () => {
  const NavBarWrapper = () => {
    const { currentUser } = useAuthContext();
    return (
      <>
        <Navbar hasLoaded={currentUser != null} isAdmin={currentUser?.type === ADMIN_ROLE}/>
        <Outlet />
      </>
    );
  };

  return (
    <ChakraProvider>
      <CookiesProvider>
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route element={<NavBarWrapper />}>
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
              <Route exact path="/awaitConfirmation" element={<AwaitConfirmation redirectPath="/" />} />
              <Route exact path="/forgotPasswordConfirmation" element={<ForgotPasswordConfirmation redirectPath="/" />} />


              <Route
                exact
                path="/catalog"
                element={
                  <ProtectedRoute
                    Component={Catalog}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE]}
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
              <Route exact path="/planner" element={
                  <ProtectedRoute
                    Component={Planner}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE]}
                  />
                } />
                <Route exact path='/accounts' element={
                  <ProtectedRoute
                    Component={Accounts}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE]}
                  />
                } />
            </Route>
          </Routes>
        </Router>
        </AuthContextProvider>
      </CookiesProvider>
    </ChakraProvider>
  );
};

export default App;

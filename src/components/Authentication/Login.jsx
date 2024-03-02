import { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/auth_utils';
// import { logInWithEmailAndPassword , signInWithGoogle, useNavigate } from '../utils/auth_utils';
import { FormControl, Input, Button, Center } from '@chakra-ui/react';
const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleStdLogin = async e => {
    try {
      console.log('logging in...');
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/publishedSchedule', navigate, cookies);
      window.location.reload(true);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <Center h="100vh">
      <div
        style={{
          margin: 'auto',
          textAlign: 'center',
          width: '598px',
          minWidth: '300px',
          padding: '50px, 40px, 40px, 37px',
          gap: '25px',
        }}
      >
        <h2>Welcome. Please enter login information.</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleStdLogin}>
          <FormControl>
            <div>
              <Input
                style={{ width: '350px', height: '81px', margin: '20px' }}
                type="email"
                onChange={({ target }) => setEmail(target.value)}
                placeholder="Email"
              />
              <Input
                style={{ width: '350px', height: '81px', margin: '20px' }}
                type="password"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Password"
              />
            </div>

            <div
              style={{
                marginTop: '25px',
                marginBottom: '25px',
              }}
            >
              <Button
                type="submit"
                style={{
                  borderRadius: '30px',
                  marginRight: '24px',
                  width: '130px',
                  height: '38px',
                }}
                backgroundColor={'#3182CE'}
                color={'white'}
              >
                Login
              </Button>
              <Button
                style={{
                  borderRadius: '30px',
                  marginLeft: '24px',
                  width: '130px',
                  height: '38px',
                }}
                backgroundColor={'#A0AEC0'}
                color={'white'}
              >
                Create Account
              </Button>
            </div>

            <div>
              <a href="/forgotpassword" style={{ fontWeight: 'bold' }}>
                Forgot Password
              </a>
            </div>
          </FormControl>
        </form>

        {/* <h2>Welcome. Please enter login information.</h2>
      {errorMessage && <p>{errorMessage}</p>} */}
        {/* <form onSubmit={handleStdLogin}>
        <input type="text" onChange={({ target }) => setEmail(target.value)} placeholder="Email" />
        <br />
        <input
          type="password"
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Password"
        />
        <br />
        <a href="/forgotpassword">Forgot Password</a>
        <br />
        <button type="submit">Login</button>
      </form> */}

        {/* <br />
      <form onSubmit={handleGoogleLogin}>
        <button type="submit">Sign In with Google</button>
      </form>
      <br /> */}
      </div>
    </Center>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

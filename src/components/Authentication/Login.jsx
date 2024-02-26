import { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/auth_utils';
// import { logInWithEmailAndPassword , signInWithGoogle, useNavigate } from '../utils/auth_utils';
import { FormControl, Input, Button, Center, Link } from '@chakra-ui/react';
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
    <Center h="90vh">
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
        <h1 style={{ fontSize: '28px', fontWeight: '700'}}>Sign In</h1>
        <h2>Please enter login information.</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleStdLogin}>
          <FormControl>
            <div>
              <Input
                style={{ width: '360px', height: '48px', marginTop: '40px' }}
                type="email"
                onChange={({ target }) => setEmail(target.value)}
                placeholder="Email"
                borderColor={"#CBD5E0"}
                borderRadius= '3px'
              />
              <Input
                style={{ width: '360px', height: '48px', margin: '20px' }}
                type="password"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Password"
                borderColor={"#CBD5E0"}
                borderRadius= '3px'
              />
            </div>

            <div
              style={{
                marginTop: '25px',
                marginBottom: '25px',
              }}
            >
              <Link href='/signup'>
                <Button
                  style={{
                    borderRadius: '30px',
                    borderColor: '#155696',
                    borderWidth: '1.5px',
                    marginRight: '16px',
                    paddingLeft: '80px',
                    paddingRight: '80px',
                    width: '140px',
                    height: '38px',
                  }}
                  backgroundColor={'#FFFFFF'}
                  color={'#155696'}
                  variant='outline'
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#E0E0E0'; 
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  Create Account
                </Button>
              </Link>
              <Button
                type="submit"
                style={{
                  borderRadius: '30px',
                  marginLeft: '16px',
                  paddingLeft: '80px',
                  paddingRight: '80px',
                  width: '140px',
                  height: '38px',
                }}
                backgroundColor={'#243268'}
                color={'#ffffff'}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#1A2559'; 
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#243268';
                }}
              >
                Login
              </Button>
            </div>

            <div>
              <a href="/forgotpassword" style={{ textDecoration: "underline"}}>
                Forgot Password
              </a>
            </div>
          </FormControl>
        </form>
      </div>
    </Center>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

import { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/auth_utils';
import { Box, Heading, Text, FormControl, Input, Button, Center, Link, Alert, AlertDescription } from '@chakra-ui/react';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleStdLogin = async e => {
    try {
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/publishedSchedule', navigate, cookies);
      window.location.reload(true);
    } catch (err) {
      setHasError(true);
      if (err.code === 'auth/invalid-credential') {
        setErrorMessage("Account could not be found with given information. Please check your username or password and try again.");
      }
      else {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <Box>
      <Box>
        { hasError &&
          <Alert
            status='warning'
            alignItems='center'
            justifyContent='center'
            height='80px'
            position='absolute'
            backgroundColor="#F69052"
            color="black"
          >
            <AlertDescription>{ errorMessage }</AlertDescription>
          </Alert>
        }
      </Box>
      <Center h="90vh">
        <Box
          style={{
            margin: 'auto',
            textAlign: 'center',
            width: '598px',
            minWidth: '300px',
            padding: '50px, 40px, 40px, 37px',
            gap: '25px',
          }}
        >
          <Heading as='h1' size='lg'>Sign In</Heading>
          <Text as='h2' size='md' mt={2}>Please enter login information.</Text>
          <form onSubmit={handleStdLogin}>
            <FormControl>
              <Box pt={4}>
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="email"
                  isRequired={true}
                  onChange={({ target }) => setEmail(target.value)}
                  placeholder="Email"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
                <Input
                  style={{ width: '360px', height: '48px', margin: '20px' }}
                  type="password"
                  isRequired={true}
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Password"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
              </Box>

              <Box
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
              </Box>

              <Box>
                <a href="/forgotpassword" style={{ textDecoration: "underline"}}>
                  Forgot Password
                </a>
              </Box>
            </FormControl>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

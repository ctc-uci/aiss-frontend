import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';
import { sendEmail } from '../EmailTemplates/EmailSending';
import emailtemplate from '../EmailTemplates/emailtemplate';
import { Box, Heading, Text, FormControl, Button, Center, Link, Input, Alert, AlertDescription } from '@chakra-ui/react';
import AUTH_ROLES from '../../utils/auth_config';

const { USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const SignUp = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [hasError, setHasError] = useState(false);

  const [userType, setUserType] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);
    try {
      if (password !== checkPassword) {
        throw new Error("Passwords don't match.");
      }

      // register email and password
      await registerWithEmailAndPassword(email, password, userType, navigate, '/awaitConfirmation', firstName, lastName);

      // send email to Debbie
      const subject = "New User Created Account";
      const newEmail = email;
      await sendEmail(subject, newEmail, emailtemplate);

      setSubmitted(true);

    } catch (err) {
      setHasError(true);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage("Account associated with email exists.");
      }
      else if (err.code === 'auth/weak-password') {
        setErrorMessage("Password must be at least 6 characters.");
      }
      else {
        setErrorMessage(err.message);
      }
    }
  };

  if (userType === null) {
    return (
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
          <Heading as='h1' size='lg'>Create Account</Heading>
          <Text as='h2' size='md' mt={2} pb={5}>Select account type:</Text>
          <form>
            <FormControl>

              <Box
                style={{
                  marginTop: '25px',
                  marginBottom: '25px',
                }}
              >
                <Button
                  onClick={() => setUserType("admin")}
                  type="submit"
                  style={{
                    borderRadius: '30px',
                    marginLeft: '16px',
                    paddingLeft: '80px',
                    paddingRight: '80px',
                    width: '140px',
                    height: '52px',
                  }}
                  backgroundColor={'#243268'}
                  color={'#ffffff'}
                  _hover={{backgroundColor: '#1A2559'}}
                >
                  Admin
                </Button>

                <Button
                  onClick={() => setUserType("student")}
                  type="submit"
                  style={{
                    borderRadius: '30px',
                    marginLeft: '16px',
                    paddingLeft: '80px',
                    paddingRight: '80px',
                    width: '140px',
                    height: '52px',
                  }}
                  backgroundColor={'#243268'}
                  color={'#ffffff'}
                  _hover={{backgroundColor: '#1A2559'}}
                >
                  Student
                </Button>
              </Box>

              <Box pt={5}>
                <a href="/login" style={{ textDecoration: "underline"}}>
                  Return to Login
                </a>
              </Box>


            </FormControl>
          </form>
        </Box>
      </Center>
    );
  }
  else if (userType != null && submitted === false) {
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
          <Heading as='h1' size='lg'>Create Account</Heading>
          <Text as='h2' size='md' mt={2}>Please enter the required information:</Text>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Box pt={4}>
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="firstName"
                  required={true}
                  onChange={({ target }) => setFirstName(target.value)}
                  placeholder="First Name"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="lastName"
                  required={true}
                  onChange={({ target }) => setLastName(target.value)}
                  placeholder="Last Name"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="email"
                  required={true}
                  onChange={({ target }) => setEmail(target.value)}
                  placeholder="Email"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="password"
                  required={true}
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Password"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '20px' }}
                  type="password"
                  required={true}
                  onChange={({ target }) => setCheckPassword(target.value)}
                  placeholder="Confirm Password"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                />
              </Box>

              <Box
                style={{
                  marginTop: '40px',
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
                    _hover={{backgroundColor: '#E0E0E0'}}
                  >
                     Cancel
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
                  _hover={{backgroundColor: '#1A2559'}}
                >
                  Submit
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
  }
};

export default SignUp;

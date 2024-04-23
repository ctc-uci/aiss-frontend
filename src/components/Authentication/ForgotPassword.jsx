import { useState } from 'react';
import { sendPasswordReset } from '../../utils/auth_utils';
import { FormControl, Input, Button, Center, Link, Box, Heading, Text, Alert, AlertDescription} from '@chakra-ui/react';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleForgotPassword = async e => {
    try {
      e.preventDefault();
      await sendPasswordReset(email);
      setHasError(false);
      setErrorMessage('');
      window.location.replace("/forgotPasswordConfirmation");
    } catch (err) {
        setHasError(true);
        if (err.code === 'auth/invalid-email') {
          setErrorMessage("Email could not be found. Please try again.");
        }
        else {
          setErrorMessage(err.message);
        }
      console.log(err)
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
          }}
        >
          <Heading as='h1' size='lg'>Reset Password</Heading>
          <Text as='h2' size='md' mt={2}>Enter email address associated with account</Text>
          <form onSubmit={handleForgotPassword}>
            <FormControl>
              <Box>
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '40px' }}
                  type="email"
                  isRequired={true}
                  onChange={({ target }) => setEmail(target.value)}
                  placeholder="Email Address"
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
                <Link href='/login'>
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
                  Send Instructions
                </Button>

              </Box>
            </FormControl>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

export default ForgotPassword;

import { useState } from 'react';
import { sendPasswordReset } from '../../utils/auth_utils';
import { FormControl, Input, Button, Center, Link, Box, Heading, Text} from '@chakra-ui/react';


const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  const handleForgotPassword = async e => {
    try {
      e.preventDefault();
      await sendPasswordReset(email);
      setConfirmationMessage(
        'If the email entered is associated with an account, you should receive an email to reset your password shortly.',
      );
      setErrorMessage('');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
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
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleForgotPassword}>
        <FormControl>
          <Box>
            <Input
              style={{ width: '360px', height: '48px', marginTop: '40px' }}
              type="email"
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
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </Box>
    </Center>
  );
};

export default ForgotPassword;

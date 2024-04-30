import { useState } from 'react';
import PropTypes from 'prop-types';
import { confirmNewPassword } from '../../utils/auth_utils';
import { FormControl, Input, Button, Center, Link, Box, Heading, Text, Alert, AlertDescription} from '@chakra-ui/react';

const CreateNewPassword = ({ code }) => {
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleResetPassword = async e => {
    try {
      e.preventDefault();
      setHasError(false);
      if (password !== checkPassword) {
        throw new Error("Passwords do not match.");
      }
      await confirmNewPassword(code, password);
      setErrorMessage('');
      setPassword('');
      window.location.replace("/createNewPasswordConfirmation");
    } catch (err) {
      setHasError(true);
      console.log(err.message);
      if (err.code === "auth/weak-password"){
        setErrorMessage("Password must be at least 6 characters.");
      } else if (err.code === "auth/invalid-action-code"){
        setErrorMessage("Link has expired.");
      } else {
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
          }}
        >
          <Heading as='h1' size='lg'>Enter New Password</Heading>
          <Text as='h2' size='md' mt={2}>Please enter a new password.</Text>
          <form onSubmit={handleResetPassword}>
            <FormControl>
              <Box>
                <Input
                  style={{ width: '360px', height: '48px', marginTop: '40px' }}
                  id={"password"}
                  isRequired={true}
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Enter new password"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                  type="password"
                />
                <Input
                  style={{ width: '360px', height: '48px', margin: '20px' }}
                  id={"checkPassword"}
                  isRequired={true}
                  onChange={({ target }) => setCheckPassword(target.value)}
                  placeholder="Re-enter password"
                  borderColor={"#CBD5E0"}
                  borderRadius= '3px'
                  type="password"
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
                  Reset Password
                </Button>

              </Box>
            </FormControl>
          </form>
        </Box>
      </Center>
    </Box>
    );
};

CreateNewPassword.propTypes = {
  code: PropTypes.string.isRequired,
};

export default CreateNewPassword;

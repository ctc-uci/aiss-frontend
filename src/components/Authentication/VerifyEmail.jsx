import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { confirmVerifyEmail } from '../../utils/auth_utils';
import { Box, Heading, Button, Center, Link, Alert, AlertDescription } from '@chakra-ui/react';

const VerifyEmail = ({ code }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      setHasError(false);
      try {
        await confirmVerifyEmail(code);
        setErrorMessage('');
      } catch (err) {
        setHasError(true);
        setErrorMessage(err.message);
      }
    };

    verifyEmail();
  }, [code]);

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
        <Box pt={4}>
            <Heading as='h1' size='lg'>Email Successfully Verified</Heading>
            <Center>
                <Link href="/login">
                    <Button
                        style={{
                            borderRadius: '30px',
                            marginTop: '30px',
                            paddingLeft: '80px',
                            paddingRight: '80px',
                            width: '140px',
                            height: '38px',
                        }}
                        backgroundColor={'#243268'}
                        color={'#ffffff'}
                        _hover={{backgroundColor: '#1A2559'}}
                    >
                    Return to login
                    </Button>
                </Link>
            </Center>
        </Box>
    </Center>
    </Box>
);
};

VerifyEmail.propTypes = {
  code: PropTypes.string.isRequired,
};

export default VerifyEmail;

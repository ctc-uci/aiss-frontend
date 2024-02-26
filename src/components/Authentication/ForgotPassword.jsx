import { useState } from 'react';
import { sendPasswordReset } from '../../utils/auth_utils';
import { FormControl, Input, Button, Center, Link } from '@chakra-ui/react';


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
      <h1 style={{ fontSize: '28px', fontWeight: '700'}}>Reset Password</h1>
      <h2>Enter email address associated with account</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleForgotPassword}>
        <FormControl>
          <div>
            <Input
              style={{ width: '360px', height: '48px', marginTop: '40px' }}
              type="email"
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email Address"
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
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#E0E0E0'; 
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
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
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1A2559'; 
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#243268';
              }}
            >
              Send Instructions
            </Button>
          </div>
        </FormControl>
      </form>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
    </Center>
  );
};

export default ForgotPassword;

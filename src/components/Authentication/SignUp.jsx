import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { registerWithEmailAndPassword } from '../../utils/auth_utils';
// import { sendEmail } from '../EmailTemplates/EmailSending';
// import emailtemplate from '../EmailTemplates/emailtemplate';
// import { renderEmail } from 'react-html-email';
import { FormControl, Button, Center } from '@chakra-ui/react';


const SignUp = () => {
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  // const [checkPassword, setCheckPassword] = useState();
  // const [errorMessage, setErrorMessage] = useState();

  const [userType, setUserType] = useState(null);

  //const [role, setRole] = useState();
  // const navigate = useNavigate();
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (password !== checkPassword) {
  //       throw new Error("Passwords don't match");
  //     }
  
  //     // register email and password
  //     await registerWithEmailAndPassword(email, password, 'admin', navigate, '/');

  //     // send email to Debbie 
  //     const subject = "placeholder";
  //     const newEmail = email;
  //     await sendEmail(subject, newEmail, emailtemplate);


  //     // setUserType("nut null")
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //   }
  // };
  
  if (userType === null) {
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
          <h1 style={{ fontSize: '28px', fontWeight: '700'}}>Create Account</h1>
          <h2>Select account type:</h2>
          {/* {errorMessage && <p>{errorMessage}</p>} */}
          <form>
            <FormControl>

              <div
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
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1A2559'; 
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#243268';
                  }}
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
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1A2559'; 
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#243268';
                  }}
                >
                  Student
                </Button>
              </div>

              <div>
                <a href="/login" style={{ textDecoration: "underline"}}>
                  Return to Login
                </a>
              </div>


            </FormControl>
          </form>
        </div>
      </Center>
    );
  }
  else {
    return (
      <Center h="90vh">
        <div>
          <h1>admin</h1>
        </div>
      </Center>
    );
  }
};

export default SignUp;

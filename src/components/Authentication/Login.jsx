import { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/auth_utils';
// import { logInWithEmailAndPassword , signInWithGoogle, useNavigate } from '../utils/auth_utils';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleStdLogin = async e => {
    try {
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/dashboard', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // const handleGoogleLogin = async e => {
  //   try {
  //     e.preventDefault();
  //     await signInWithGoogle('/new-user', '/dashboard', navigate, cookies);
  //   } catch (err) {
  //     setErrorMessage(err.message);
  //   }
  // };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleStdLogin}>
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
        <button type="submit">Sign In</button>
      </form>

      {/* <br />
      <form onSubmit={handleGoogleLogin}>
        <button type="submit">Sign In with Google</button>
      </form>
      <br /> */}
    </div>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

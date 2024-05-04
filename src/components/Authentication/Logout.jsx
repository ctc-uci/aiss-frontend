import { useState } from 'react';
import { instanceOf } from 'prop-types';
import { logout, useNavigate } from '../../utils/auth_utils';
import { Cookies, withCookies } from '../../utils/cookie_utils';

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = async () => {
    try {
      await logout('/login', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit" style={{ color: 'white' }} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Logout);

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { confirmVerifyEmail } from '../../utils/auth_utils';

const VerifyEmail = ({ code }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await confirmVerifyEmail(code);
        setConfirmationMessage(
          'Your email has been verified. You can now sign in with your new account.',
        );
        setErrorMessage('');
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    verifyEmail();
  }, [code]);

  return (
    <div>
      <h2>Verify Email</h2>
      {errorMessage && <p>{errorMessage}</p>}
      {confirmationMessage && (
        <div>
          <p>{confirmationMessage}</p>
          <a href="/">Back to Login</a>
        </div>
      )}
    </div>
  );
};

VerifyEmail.propTypes = {
  code: PropTypes.string.isRequired,
};

export default VerifyEmail;

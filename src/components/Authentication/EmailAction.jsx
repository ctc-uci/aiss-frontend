import { useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CreateNewPassword from './CreateNewPassword';
import VerifyEmail from './VerifyEmail';

const EmailAction = ({ redirectPath }) => {
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get('mode');
  const code = new URLSearchParams(search).get('oobCode');

  if (code === null) {
    return <Navigate to={redirectPath} />;
  }

  return mode === 'resetPassword' ? <CreateNewPassword code={code} /> : <VerifyEmail code={code} />;
};

EmailAction.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default EmailAction;

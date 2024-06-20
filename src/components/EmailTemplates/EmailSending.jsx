import { renderEmail } from 'react-html-email';
import { NPOBackend } from '../../utils/auth_utils';

const sendEmail = async (subject, newEmail, emailtemplate) => {
  try {
    //send Debbie email when user registers
    const debbieMail = import.meta.env.VITE_EMAIL_USERNAME;
    const response = await NPOBackend.post('/nodemailer/send', {
      email: debbieMail,
      messageHtml: renderEmail(emailtemplate({ newEmail })),
      subject,
    });
    if (response.status !== 200) {
      throw new Error('Oops, something went wrong. Try again');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { sendEmail };

import axios from 'axios';
import { renderEmail } from 'react-html-email';

const AISSBackend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
  withCredentials: true,
});

const sendEmail = async (subject, newEmail, emailtemplate) => {
  try {
    //send Debbie email when user registers
    const debbieMail = import.meta.env.VITE_EMAIL_USERNAME;
    const response = await AISSBackend.post('/nodemailer/send', {
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

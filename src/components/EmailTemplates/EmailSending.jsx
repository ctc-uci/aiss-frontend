// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import emailTemplate from './emailtemplate';
import styles from './EmailSending.module.css';
import axios from 'axios';
import { renderEmail } from 'react-html-email';
//import { sendEmail } from '../../utils/utils';

const AISSBackend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
  withCredentials: true,
});

const sendEmail = async (subject, newEmail, emailtemplate) => {
  const response = await AISSBackend.post('/nodemailer/send', {
    email: newEmail,
    messageHtml: renderEmail(emailtemplate),
    subject,
  });
  if (response.status !== 200) {
    throw new Error('Oops, something went wrong. Try again');
  }
};

const SendEmail = () => {
  const [newEmail, setNewEmail] = useState();

  function updateEmail(event) {
    setNewEmail(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    const subject = "Subject"; 
    sendEmail(subject, newEmail, emailTemplate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="emailInput">
        enter your email:
        <input
          className={styles['email-input']}
          id="emailInput"
          onChange={updateEmail}
          type="email"
          required
        />
      </label>
      <button type="submit">send!</button>
    </form>
  );
};

export default SendEmail;

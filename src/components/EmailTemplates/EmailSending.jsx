// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { renderEmail } from 'react-html-email';
//import { sendEmail } from '../../utils/utils';

const AISSBackend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
  withCredentials: true,
});

const sendEmail = async (subject, newEmail, emailtemplate) => {
  try {
    //send Debbie email when user registers
    const debbieMail = "barbenheaissmer@gmail.com";
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

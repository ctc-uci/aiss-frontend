//import React from 'react';
import { Email, Item, Span } from 'react-html-email';

const emailTemplate = ({newEmail}) => (
  <Email title="New User Account Approval">
    <Item align="center">
      <Span fontSize={20}>
        Hello Debbie, 

        A user with the email {newEmail} has created an account and is waiting for your approval.

        Thank you. 
      </Span>
    </Item>
  </Email>
);

export default emailTemplate;
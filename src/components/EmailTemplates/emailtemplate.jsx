//import React from 'react';
import { Email, Item, Span, A } from 'react-html-email';

const emailTemplate = ({newEmail}) => (
  <Email title="New User Account Approval">
    <Item align="center">
      <Span fontSize={20}>
        Hello Debbie, 
        A user with the email {newEmail} has created an account and is waiting for your approval. 
        <A href="https://github.com/chromakode/react-html-email">react-html-email</A>.
      </Span>
    </Item>
  </Email>
);

export default emailTemplate;
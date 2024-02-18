import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AccountNotificationBlock } from './NotificationElement';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  ButtonGroup,
  Button,
  Container,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';

const AccountNotification = ({ notificationBlock, today, onDestroy }) => {
  const [accounts, setAccounts] = useState(notificationBlock.getNotificationData().accounts);
  const [disableChildrenButtons, setDisableChildrenButtons] = useState(false);

  const blockDate = notificationBlock.getDate();
  const diffTime = today - blockDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const acceptAll = async accounts => {
    await Promise.all(accounts.map(async (account) => {
      await account.approveCallback();
    }))

    onDestroy(notificationBlock.key);
  };

  const declineAll = async accounts => {
    await Promise.all(accounts.map(async (account) => {
      await account.declineCallback();
    }))

    onDestroy(notificationBlock.key);
  };

  return (
    <Container p="0" m="0" maxWidth="none" display="flex" flexDirection="column">
      <div>
        {accounts?.length === 1 ? (
          <>
            {/* No accordion for 1 account notification */}
            <Text pb="4">
              <Text color="blue.600" as="b" display="inline">
                {accounts?.[0]?.email}{' '}
              </Text>
              <Text as="span" display="inline" whiteSpace="wrap">
                is requesting account approval...
              </Text>
            </Text>
            <AccountButtonGroup
              acceptText="Accept"
              declineText="Decline"
              acceptCallback={() => {
                acceptAll(accounts);
              }}
              declineCallback={() => {
                declineAll(accounts);
              }}
              pl="3.25rem"
            />
          </>
        ) : (
          <>
            {/* Accordion for >1 account notification in block */}
            <Text pb="4">
              <Text as="b" color="blue.600">
                {accounts?.[0]?.email} and {accounts?.length - 1} other
                {accounts?.length - 1 > 1 && 's'}{' '}
              </Text>
              <Text as="span" display="inline" whiteSpace="wrap">
                {accounts?.length - 1 > 1 ? 'are' : 'is'} requesting account approval...
              </Text>
            </Text>
            <Accordion allowToggle>
              <AccordionItem border="none">
                <Container display="flex" gap="6" alignItems="center" w="fit-content" m="0" p="0">
                  <AccordionButton
                    width="fit-content"
                    p="1"
                    borderRadius="100"
                    backgroundColor="gray.200"
                  >
                    <AccordionIcon />
                  </AccordionButton>
                  <AccountButtonGroup
                    acceptText="Accept All"
                    declineText="Decline All"
                    acceptCallback={() => {
                      setDisableChildrenButtons(true);
                      acceptAll(accounts);
                    }}
                    declineCallback={() => {
                      setDisableChildrenButtons(true);
                      declineAll(accounts);
                    }}
                  />
                </Container>
                <AccordionPanel whiteSpace="wrap" paddingLeft="3.25rem">
                  <Grid templateColumns="1fr auto" gap={6}>
                    {accounts?.map(({ id, email, approveCallback, declineCallback }) => (
                      <React.Fragment key={id}>
                        <GridItem>
                          <Text color="blue.600" decoration="underline">
                            {email}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <AccountButtonGroup
                            acceptText="Accept"
                            declineText="Decline"
                            acceptCallback={async () => {
                              await approveCallback();
                              setAccounts(accounts =>
                                accounts.filter(account => account.id !== id),
                              );
                            }}
                            declineCallback={async () => {
                              await declineCallback();
                              setAccounts(accounts =>
                                accounts.filter(account => account.id !== id),
                              );
                            }}
                            disableChildrenButtons={disableChildrenButtons}
                          />
                        </GridItem>
                      </React.Fragment>
                    ))}
                  </Grid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>
      <Text alignSelf="flex-end" fontSize="xs" title={blockDate.toLocaleString()}>
        {diffDays} day{diffDays !== 1 && 's'} ago
      </Text>
    </Container>
  );
};
AccountNotification.propTypes = {
  notificationBlock: PropTypes.instanceOf(AccountNotificationBlock),
  today: PropTypes.instanceOf(Date),
  onDestroy: PropTypes.func,
};

const AccountButtonGroup = ({
  acceptText,
  acceptCallback,
  declineText,
  declineCallback,
  disableChildrenButtons,
  ...chakraProps
}) => {
  const [acceptState, setAcceptState] = useState(undefined);
  const [declineState, setDeclineState] = useState(undefined);

  return (
    <ButtonGroup gap="2" {...chakraProps}>
      <Button
        onClick={() => {
          setAcceptState('loading');
          setDeclineState('disabled');
          acceptCallback();
        }}
        backgroundColor="blue.500"
        color="white"
        fontSize="sm"
        h="6"
        fontWeight="normal"
        isLoading={acceptState === 'loading'}
        isDisabled={acceptState === 'disabled' || disableChildrenButtons === true}
      >
        {acceptText}
      </Button>
      <Button
        onClick={() => {
          setDeclineState('loading');
          setAcceptState('disabled');
          declineCallback();
        }}
        backgroundColor="gray.200"
        color="black"
        fontSize="sm"
        h="6"
        fontWeight="normal"
        isLoading={declineState === 'loading'}
        isDisabled={declineState === 'disabled' || disableChildrenButtons === true}
      >
        {declineText}
      </Button>
    </ButtonGroup>
  );
};
AccountButtonGroup.propTypes = {
  acceptText: PropTypes.string,
  acceptCallback: PropTypes.func,
  declineText: PropTypes.string,
  declineCallback: PropTypes.func,
  disableChildrenButtons: PropTypes.bool,
  chakraProps: PropTypes.any,
};

export default AccountNotification;

import React, { useState, useEffect } from 'react';
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
  Link,
  // useToast,
} from '@chakra-ui/react';

const AccountNotification = ({
  notificationBlock,
  today,
  removeEntry,
  approveAfterTimer,
  idToRemove,
  setApproveAfterTimer,
  declineAfterTimer,
  setDeclineAfterTimer,
}) => {
  // const toast = useToast();
  const [accounts, setAccounts] = useState(notificationBlock.getNotificationData().accounts);
  const [disableChildrenButtons, setDisableChildrenButtons] = useState(false);

  const blockDate = notificationBlock.getDate();
  const diffTime = today - blockDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const [removeNotificationBlock, setRemoveNotificationBlock] = useState(false);
  const [timeoutId, setTimeoutId] = useState(undefined);

  const acceptAll = async accounts => {
    const timeId = setTimeout(async () => {
      await Promise.all(
        accounts.map(async account => {
          await account.approveCallback();
        }),
      );
      setRemoveNotificationBlock(true);
      setApproveAfterTimer(true);
    }, 5000); // set 5 sec timer for accept all requests
    setTimeoutId(timeId);
  };

  const declineAll = async accounts => {
    const timeId = setTimeout(async () => {
      await Promise.all(
        accounts.map(async account => {
          await account.declineCallback();
        }),
      );
      setRemoveNotificationBlock(true);
      setDeclineAfterTimer(true);
    }, 5000); // set 5 sec timer for accept all requests
    setTimeoutId(timeId);
  };

  const undoAll = async () => {
    clearTimeout(timeoutId);
    setTimeoutId(undefined);
    setRemoveNotificationBlock(false);
    setApproveAfterTimer(false);
    setDeclineAfterTimer(false);
  };

  useEffect(() => {
    if (approveAfterTimer && removeNotificationBlock) {
      removeEntry(notificationBlock.key);
      // toast({
      //   title: `Approved.`,
      //   status: 'success',
      //   duration: 9000,
      //   isClosable: true,
      // });
    } else if (declineAfterTimer && removeNotificationBlock) {
      removeEntry(notificationBlock.key);
      // toast({
      //   title: `Declined.`,
      //   status: 'info',
      //   duration: 9000,
      //   isClosable: true,
      // });
    } else if (approveAfterTimer) {
      setAccounts(accounts => accounts.filter(account => account.id !== idToRemove));
      // toast({
      //   title: `Approved.`,
      //   status: 'success',
      //   duration: 9000,
      //   isClosable: true,
      // });
    } else if (declineAfterTimer) {
      setAccounts(accounts => accounts.filter(account => account.id !== idToRemove));
      // toast({
      //   title: `Declined.`,
      //   status: 'info',
      //   duration: 9000,
      //   isClosable: true,
      // });
    }
  }, [approveAfterTimer, declineAfterTimer, removeNotificationBlock]);

  return (
    <Container p="0" m="0" maxWidth="none" display="flex" flexDirection="column">
      <div>
        {accounts?.length === 1 ? (
          <>
            {/* No accordion for 1 account notification */}
            <Text pb="4">
              <Text color="blue.600" as="b" display="inline">
              {accounts?.[0]?.firstName} ({accounts?.[0]?.email}){' '}
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
              undoCallback={() => {
                undoAll(accounts);
              }}
              pl="3.25rem"
            />
          </>
        ) : (
          <>
            {/* Accordion for >1 account notification in block */}
            <Text pb="4">
              <Text as="b" color="blue.600">
                {accounts?.[0]?.firstName} and {accounts?.length - 1} other
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
                    undoCallback={() => {
                      setDisableChildrenButtons(false);
                      undoAll(accounts);
                    }}
                  />
                </Container>
                <AccordionPanel whiteSpace="wrap" paddingLeft="3.25rem">
                  <Grid templateColumns="1fr auto" gap={6}>
                    {accounts?.map(({ id, firstName, email, approveCallback, declineCallback, undoCallback }) => (
                      <React.Fragment key={id}>
                        <GridItem>
                          <Text as="b" color="blue.600" decoration="underline">
                            {firstName}{' '}
                          </Text>
                          <Text as="span" color="blue.600" decoration="underline">
                            ({email})
                          </Text>
                        </GridItem>
                        <GridItem>
                          <AccountButtonGroup
                            acceptText="Accept"
                            declineText="Decline"
                            acceptCallback={async () => {
                              await approveCallback();
                            }}
                            declineCallback={async () => {
                              await declineCallback();
                            }}
                            undoCallback={() => {
                              undoCallback();
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
        {diffDays > 0 ? (
          <>
            {diffDays} day{diffDays !== 1 && 's'} ago
          </>
        ) : (
          <>Today</>
        )}
      </Text>
    </Container>
  );
};
AccountNotification.propTypes = {
  notificationBlock: PropTypes.instanceOf(AccountNotificationBlock),
  today: PropTypes.instanceOf(Date),
  removeEntry: PropTypes.func,
  approveAfterTimer: PropTypes.bool,
  idToRemove: PropTypes.string,
  setApproveAfterTimer: PropTypes.func,
  declineAfterTimer: PropTypes.bool,
  setDeclineAfterTimer: PropTypes.func,
};

const AccountButtonGroup = ({
  acceptText,
  acceptCallback,
  declineText,
  declineCallback,
  undoCallback,
  disableChildrenButtons,
  ...chakraProps
}) => {
  const [acceptState, setAcceptState] = useState(undefined);
  const [declineState, setDeclineState] = useState(undefined);
  const [approveClick, setApproveClicked] = useState(false);
  const [declineClick, setDeclineClicked] = useState(false);

  return (
    <>
      {!approveClick && !declineClick ? (
        <ButtonGroup gap="2" {...chakraProps}>
          <Button
            onClick={() => {
              setAcceptState('loading');
              setDeclineState('disabled');
              setApproveClicked(true);
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
              setDeclineClicked(true);
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
      ) : (
        <>
          {approveClick ? (
            <div>
              <ButtonGroup gap="2" {...chakraProps}>
                <Text>Accepted</Text>
                <Link
                  color="blue.600"
                  decoration="underline"
                  onClick={() => {
                    setAcceptState(undefined);
                    setDeclineState(undefined);
                    setApproveClicked(false);
                    undoCallback();
                  }}
                >
                  Undo
                </Link>
              </ButtonGroup>
            </div>
          ) : (
            <div>
              <ButtonGroup gap="2" {...chakraProps}>
                <Text>Declined</Text>
                <Link
                  color="blue.600"
                  decoration="underline"
                  onClick={() => {
                    setAcceptState(undefined);
                    setDeclineState(undefined);
                    setDeclineClicked(false);
                    undoCallback();
                  }}
                >
                  Undo
                </Link>
              </ButtonGroup>
            </div>
          )}
        </>
      )}
    </>
  );
};
AccountButtonGroup.propTypes = {
  acceptText: PropTypes.string,
  acceptCallback: PropTypes.func,
  declineText: PropTypes.string,
  declineCallback: PropTypes.func,
  undoCallback: PropTypes.func,
  disableChildrenButtons: PropTypes.bool,
  chakraProps: PropTypes.any,
};

export default AccountNotification;

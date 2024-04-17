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
  useToast,
} from '@chakra-ui/react';

const AccountNotification = ({
  notificationBlock,
  today,
  // removeEntry, add back in after we fix bugs
  approveAfterTimer,
  idToRemove,
  setApproveAfterTimer,
}) => {
  const toast = useToast();
  const [accounts, setAccounts] = useState(notificationBlock.getNotificationData().accounts);
  const [disableChildrenButtons, setDisableChildrenButtons] = useState(false);

  const blockDate = notificationBlock.getDate();
  const diffTime = today - blockDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const acceptAll = async accounts => {
    console.log('calling accept all function');
    // setApproveClicked(true);
    // accounts.map(account => {
    //   console.log('calling account approve callback now');
    //   console.log(account);
    //   account.approveCallback();
    // });
    await Promise.all(
      accounts.map(async account => {
        await account.approveCallback();
      }),
    );

    // toast({
    //   title: `Approved ${accounts?.length} accounts.`,
    //   status: 'success',
    //   duration: 9000,
    //   isClosable: true,
    // });

    // removeEntry(notificationBlock.key);
    // console.log('will remove entry here');
  };

  const declineAll = async accounts => {
    console.log('calling decline all function');
    // setApproveClicked(true);
    accounts.map(account => {
      console.log('calling account decline callback now');
      console.log(account);
      account.declineCallback();
    });
    // await Promise.all(
    //   accounts.map(async account => {
    //     await account.declineCallback();
    //   }),
    // );

    // toast({
    //   title: `Declined ${accounts?.length} accounts.`,
    //   status: 'info',
    //   duration: 9000,
    //   isClosable: true,
    // });
    // removeEntry(notificationBlock.key);
    console.log('will remove entry here');
  };

  const undoAll = async accounts => {
    console.log('calling undo all function');
    // setApproveClicked(true);
    accounts.map(account => {
      console.log('calling account undo callback now');
      console.log(account);
      account.undoCallback();
    });
    // await Promise.all(
    //   accounts.map(async account => {
    //     await account.declineCallback();
    //   }),
    // );

    // toast({
    //   title: `Declined ${accounts?.length} accounts.`,
    //   status: 'info',
    //   duration: 9000,
    //   isClosable: true,
    // });
    // removeEntry(notificationBlock.key);
    console.log('done undoall function');
  };

  // this is really buggy
  useEffect(() => {
    console.log('checking value of approveAfterTimer', approveAfterTimer);
    if (approveAfterTimer) {
      console.log('waited 5 seconds, finish approval and remove from notifications');
      toast({
        title: `Approved.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      console.log('idToRemove', idToRemove);
      setAccounts(accounts => accounts.filter(account => account.id !== idToRemove));
      setApproveAfterTimer(false);
    }
  }, [approveAfterTimer]);

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
              undoCallback={() => {
                console.log('but undo function here');
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
                    undoCallback={() => {
                      setDisableChildrenButtons(false);
                      console.log('but undo function here');
                      undoAll(accounts);
                    }}
                  />
                </Container>
                <AccordionPanel whiteSpace="wrap" paddingLeft="3.25rem">
                  <Grid templateColumns="1fr auto" gap={6}>
                    {accounts?.map(({ id, email, approveCallback, declineCallback, undoCallback }) => (
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
                              console.log('check approveAfterTimer');

                              // if (approveAfterTimer) {
                              //   // toast({
                              //   //   title: `Approved ${email}.`,
                              //   //   status: 'success',
                              //   //   duration: 9000,
                              //   //   isClosable: true,
                              //   // });
                              //   // setAccounts(accounts =>
                              //   //   accounts.filter(account => account.id !== id),
                              //   // );
                              //   console.log('useEffect instead lol');
                              // }
                            }}
                            declineCallback={async () => {
                              await declineCallback();
                              toast({
                                title: `Declined ${email}.`,
                                status: 'info',
                                duration: 9000,
                                isClosable: true,
                              });
                              setAccounts(accounts =>
                                accounts.filter(account => account.id !== id),
                              );
                            }}
                            undoCallback={() => {
                              console.log('but undo function here');
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
                    console.log('trying to undo');
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
                    console.log('trying to undo');
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
    // <ButtonGroup gap="2" {...chakraProps}>
    //   <Button
    //     onClick={() => {
    //       setAcceptState('loading');
    //       setDeclineState('disabled');
    //       // console.log("calling accept callback");
    //       setApproveClicked(true);
    //       acceptCallback();
    //     }}
    //     backgroundColor="blue.500"
    //     color="white"
    //     fontSize="sm"
    //     h="6"
    //     fontWeight="normal"
    //     isLoading={acceptState === 'loading'}
    //     isDisabled={acceptState === 'disabled' || disableChildrenButtons === true}
    //   >
    //     {acceptText}
    //   </Button>
    //   <Button
    //     onClick={() => {
    //       setDeclineState('loading');
    //       setAcceptState('disabled');
    //       declineCallback();
    //     }}
    //     backgroundColor="gray.200"
    //     color="black"
    //     fontSize="sm"
    //     h="6"
    //     fontWeight="normal"
    //     isLoading={declineState === 'loading'}
    //     isDisabled={declineState === 'disabled' || disableChildrenButtons === true}
    //   >
    //     {declineText}
    //   </Button>
    // </ButtonGroup>
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

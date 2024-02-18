import React from 'react';
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

const AccountNotification = ({ notificationBlock, today }) => {
  const { accounts } = notificationBlock.getNotificationData();
  console.log(accounts);
  const blockDate = notificationBlock.getDate();
  const diffTime = Math.abs(blockDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Container p="0" m="0" maxWidth="none" display="flex" flexDirection="column">
      <div>
        {accounts?.length === 1 ? (
          <>
            <Text pb="4">
              <Text color="blue.600" as="b" display="inline">
                {accounts[0]}{' '}
              </Text>
              <Text display="inline" whiteSpace="wrap">
                is requesting account approval...
              </Text>
            </Text>
            <ButtonGroup gap="2" pl="3.25rem">
              <Button
                backgroundColor="blue.500"
                color="white"
                fontSize="sm"
                h="6"
                fontWeight="normal"
              >
                Accept
              </Button>
              <Button
                backgroundColor="gray.200"
                color="black"
                fontSize="sm"
                h="6"
                fontWeight="normal"
              >
                Decline
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Text pb="4">
              <Text color="blue.600" display="inline">
                <Text as="b">{accounts[0]} </Text>
                and {accounts.length - 1} other{accounts.length - 1 > 1 && 's'}{' '}
              </Text>
              <Text display="inline" whiteSpace="wrap">
                {accounts.length - 1 > 1 ? 'are' : 'is'} requesting account approval...
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
                  <ButtonGroup gap="2">
                    <Button
                      backgroundColor="blue.500"
                      color="white"
                      fontSize="sm"
                      h="6"
                      fontWeight="normal"
                    >
                      Accept All
                    </Button>
                    <Button
                      backgroundColor="gray.200"
                      color="black"
                      fontSize="sm"
                      h="6"
                      fontWeight="normal"
                    >
                      Decline All
                    </Button>
                  </ButtonGroup>
                </Container>
                <AccordionPanel whiteSpace="wrap" paddingLeft="3.25rem">
                  <Grid templateColumns="1fr auto" gap={6}>
                    {accounts.map(email => (
                      <React.Fragment key={email}>
                        <GridItem>
                          <Text color="blue.600" decoration="underline">
                            {email}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <ButtonGroup gap="2">
                            <Button
                              backgroundColor="blue.500"
                              color="white"
                              fontSize="sm"
                              h="6"
                              fontWeight="normal"
                            >
                              Accept
                            </Button>
                            <Button
                              backgroundColor="gray.200"
                              color="black"
                              fontSize="sm"
                              h="6"
                              fontWeight="normal"
                            >
                              Decline
                            </Button>
                          </ButtonGroup>
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
        {diffDays} day{diffDays > 1 && 's'} ago
      </Text>
    </Container>
  );
};

AccountNotification.propTypes = {
  notificationBlock: PropTypes.instanceOf(AccountNotificationBlock),
  today: PropTypes.instanceOf(Date),
};

export default AccountNotification;

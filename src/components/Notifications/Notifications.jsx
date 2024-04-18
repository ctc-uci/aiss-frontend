import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import { AccountNotificationBlock, EventNotificationBlock } from './NotificationElement';
import AccountNotification from './AccountNotification';
import EventNotification from './EventNotification';

const getDateFromISOString = isoString => {
  const dateObject = new Date(isoString);
  const formattedDateString = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObject);

  return { dateObject, formattedDateString };
};

const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [approveAfterTimer, setApproveAfterTimer] = useState(false);
  const [declineAfterTimer, setDeclineAfterTimer] = useState(false);
  const [idToRemove, setidToRemove] = useState(undefined);
  let timeoutId = undefined;

  const today = useMemo(() => new Date(), []);

  const undoChanges = () => {
    console.log('undoing changes now !!!');
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  const approveAccount = async id => {
    console.log('about to approve: ' + id);

    // Start timer
    const timeId = setTimeout(async () => {
      try {
        await NPOBackend.put(`/users/approve/${id}`);
      } catch (e) {
        console.log(e);
      }
      console.log("done approving account!");
      setidToRemove(id);
      console.log('setApproveAfterTimer called');
      setApproveAfterTimer(true);
    }, 5000); // 5 second delay
    timeoutId = timeId;
  };

  const declineAccount = async id => {
    console.log('about to decline: ' + id);

    // Start timer
    const timeId = setTimeout(async () => {
      try {
        await NPOBackend.delete(`/users/${id}`);
      } catch (e) {
        console.log(e);
      }
      console.log("done decline account!");
      setidToRemove(id);
      console.log('setDeclineAfterTimer called');
      setDeclineAfterTimer(true);
    }, 5000); // 5 second delay
    timeoutId = timeId;
  };

  // const approveAccount = async id => {
  //   try {
  //     await NPOBackend.put(`/users/approve/${id}`);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const declineAccount = async id => {
  //   try {
  //     await NPOBackend.delete(`/users/${id}`);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const removeNotificationEntry = key => {
    setNotificationList(notificationBlocks =>
      notificationBlocks.filter(block => block.getKey() !== key),
    );
  };

  useEffect(() => {
    const fetchNotificationData = async () => {
      const [pendingAccounts, addedEvents, confirmedEvents] = await Promise.all([
        NPOBackend.get(`/users/pending-accounts`).then(res => res.data),
        NPOBackend.get('/published-schedule/recently-added').then(res => res.data),
        NPOBackend.get('/published-schedule/recently-confirmed').then(res => res.data),
      ]);

      // Map MM-DD-YY string to AccountNotificationBlock
      const accountsMap = new Map();

      pendingAccounts.forEach(({ approvedOn, email, id }) => {
        const { dateObject, formattedDateString } = getDateFromISOString(approvedOn);
        let notificationBlock;

        if (!accountsMap.has(formattedDateString)) {
          // Create notification date block if first found entry of that day
          const key = `accounts-${formattedDateString}`;
          notificationBlock = new AccountNotificationBlock(dateObject, 'account', key);
        } else {
          // Set notification block to be existing entry
          notificationBlock = accountsMap.get(formattedDateString);
        }

        notificationBlock.addPendingAccount(
          id,
          email,
          async () => {
            await approveAccount(id);
          },
          async () => {
            await declineAccount(id);
          },
          undoChanges,
        );
        accountsMap.set(formattedDateString, notificationBlock);
      });

      // Map MM-DD-YY to EventNotificationBlock
      const eventsArray = [];

      addedEvents.forEach(({ createdOn, title, id }) => {
        const { dateObject } = getDateFromISOString(createdOn);
        const key = `event-added-${id}`;
        eventsArray.push(new EventNotificationBlock(dateObject, 'event', key, title, 'added'));
      });

      confirmedEvents.forEach(({ confirmedOn, title, id }) => {
        const { dateObject } = getDateFromISOString(confirmedOn);
        const key = `event-confirmed-${id}`;
        eventsArray.push(new EventNotificationBlock(dateObject, 'event', key, title, 'confirmed'));
      });

      const notificationBlocks = [...Array.from(accountsMap.values()), ...eventsArray];

      // Sort notification blocks in reverse chronological order,
      // treating every block as NotificationBlock (base class) object
      notificationBlocks.sort((notificationBlock1, notificationBlock2) => {
        const date1 = notificationBlock1.getDate();
        const date2 = notificationBlock2.getDate();

        return date2 - date1;
      });

      setNotificationList(notificationBlocks);
    };
    fetchNotificationData().catch(console.error);
  }, []);

  return (
    <TableContainer>
      <Table>
        <Tbody>
          {notificationList.map(notificationBlock => {
            const notificationType = notificationBlock.getType();

            return (
              <Tr key={notificationBlock.key}>
                <Td borderColor="gray.300">
                  {notificationType === 'account' && (
                    <AccountNotification
                      notificationBlock={notificationBlock}
                      today={today}
                      removeEntry={removeNotificationEntry}
                      approveAfterTimer={approveAfterTimer}
                      idToRemove={idToRemove}
                      setApproveAfterTimer={setApproveAfterTimer}
                      declineAfterTimer={declineAfterTimer}
                      setDeclineAfterTimer={setDeclineAfterTimer}
                    />
                  )}
                  {notificationType === 'event' && (
                    <EventNotification notificationBlock={notificationBlock} today={today} />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Notifications;

import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchNotificationData = async () => {
      const [pendingAccounts, addedEvents, confirmedEvents] = await Promise.all([
        NPOBackend.get(`/users/pending-accounts`).then(res => res.data),
        NPOBackend.get('/published-schedule/recently-added').then(res => res.data),
        NPOBackend.get('/published-schedule/recently-confirmed').then(res => res.data),
      ]);

      // Map MM-DD-YY string to AccountNotificationBlock
      const accountsMap = new Map();

      pendingAccounts.forEach(({ approvedOn, email }) => {
        const { dateObject, formattedDateString } = getDateFromISOString(approvedOn);
        let notificationBlock;

        if (!accountsMap.has(formattedDateString)) {
          // Create notification date block if first found entry of that day
          const key = `${formattedDateString}-accounts`;
          notificationBlock = new AccountNotificationBlock(dateObject, 'account', key);
        } else {
          // Set notification block to be existing entry
          notificationBlock = accountsMap.get(formattedDateString);
        }

        notificationBlock.addPendingAccount(email);
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

  // const ApproveAll = async () => {
  //   try {
  //     listData.map(async user => {
  //       await NPOBackend.put(`/users/approve/${user.id}`);
  //     });

  //     location.reload();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const DeclineAll = async () => {
  //   try {
  //     listData.map(async user => {
  //       await NPOBackend.delete(`/users/${user.id}`);
  //     });

  //     location.reload();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const Approve = async id => {
  //   try {
  //     await NPOBackend.put(`/users/approve/${id}`);
  //     location.reload();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const Decline = async id => {
  //   try {
  //     await NPOBackend.delete(`/users/${id}`);
  //     location.reload();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <TableContainer>
      <Table>
        <Tbody>
          {notificationList.map(notificationBlock => {
            const notificationType = notificationBlock.getType();

            return (
              <Tr key={notificationBlock.key}>
                <Td>
                  {notificationType === 'account' && (
                    <AccountNotification notificationBlock={notificationBlock} />
                  )}
                  {notificationType === 'event' && (
                    <EventNotification notificationBlock={notificationBlock} />
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

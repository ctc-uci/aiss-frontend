import PropTypes from 'prop-types';
import { EventNotificationBlock } from './NotificationElement';
import { Container, Text } from '@chakra-ui/react';

const EventNotification = ({ notificationBlock, today }) => {
  const { title, status } = notificationBlock.getNotificationData();

  const blockDate = notificationBlock.getDate();
  const diffTime = today - blockDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Container p="0" m="0" maxWidth="none" display="flex" flexDirection="column">
      <Text pb="2">
        <Text color="blue.600" as="b" display="inline">
          Event: {title}
        </Text>
        <Text as="span" display="inline" whiteSpace="wrap">
          {status === 'added' && ' was added to the schedule.'}
          {status === 'confirmed' && ' was changed from tentative to confirmed.'}
        </Text>
      </Text>
      <Text alignSelf="flex-end" fontSize="xs" title={blockDate.toLocaleString()}>
        {diffDays} day{diffDays !== 1 && 's'} ago
      </Text>
    </Container>
  );
};

EventNotification.propTypes = {
  notificationBlock: PropTypes.instanceOf(EventNotificationBlock),
  today: PropTypes.instanceOf(Date),
};

export default EventNotification;

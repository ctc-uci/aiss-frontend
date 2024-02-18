import PropTypes from 'prop-types';
import { EventNotificationBlock } from './NotificationElement';

const EventNotification = ({ notificationBlock }) => {
  console.log('event', notificationBlock);

  return <div>EventNotificationComponent</div>;
};

EventNotification.propTypes = {
  notificationBlock: PropTypes.instanceOf(EventNotificationBlock)
}

export default EventNotification;

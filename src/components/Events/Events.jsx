import DailyEvent from './DailyEvent.jsx';
import PropTypes from 'prop-types';

import { Grid } from '@chakra-ui/react';

const Events = ({ eventData, location }) => {
  const eventDataWithBreaks = [];
  for (let i = 0; i < eventData.length - 1; i++) {
    const currentEvent = eventData[i];
    const nextEvent = eventData[i + 1];
    eventDataWithBreaks.push(currentEvent);
    if (currentEvent.endTime < nextEvent.startTime) {
      eventDataWithBreaks.push({
        startTime: currentEvent.endTime,
        endTime: nextEvent.startTime,
        title: 'Break / Team Time',
        location: 'N/A',
      });
      eventDataWithBreaks.push(nextEvent);
    }
  }
  return (
    <Grid gap={3}>
      {eventDataWithBreaks.map(item => (
        <DailyEvent
          key={item.id}
          startTime={item.startTime}
          endTime={item.endTime}
          eventTitle={item.title}
          location={item.location == null ? location : null}
        />
      ))}
    </Grid>
  );
};

Events.propTypes = {
  eventData: PropTypes.array.isRequired,
  location: PropTypes.string.isRequired,
};

export default Events;

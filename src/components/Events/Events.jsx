import DailyEvent from './DailyEvent.jsx';
import PropTypes from 'prop-types';

import { Grid } from '@chakra-ui/react';

const Events = ({ eventData, location }) => {
  
  const formatDate = (date) => {
    let time = date.split(":");
    let hours = time[0];
    let mins = time[1];
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins} ${ampm}`;
  }
  
  const eventDataWithBreaks = [];
  if (eventData.length == 1) {
    eventDataWithBreaks.push(eventData[0]);
  }
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
    }
    eventDataWithBreaks.push(nextEvent);
  }
  // eventDataWithBreaks.push(eventData[eventData.length - 1]);
  return (
    <Grid gap={3}>
      {eventDataWithBreaks.map(item => (
        <DailyEvent
          key={item.id}
          startTime={formatDate(item.startTime)}
          endTime={formatDate(item.endTime)}
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

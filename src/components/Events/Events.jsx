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

  let maxId = eventData.reduce((maxVal, event) => Math.max(maxVal, event.id), -Infinity)+1;

  eventData.sort((a, b) => {
    if (a.startTime < b.startTime) {
      return -1;
    } else if (a.startTime > b.startTime) {
      return 1;
    }
    return 0;
  });

  const eventDataWithBreaks = [];
  if (eventData.length == 1) {
    eventDataWithBreaks.push(eventData[0]);
  }
  for (let i = 0; i < eventData.length - 1; i++) {
    const currentEvent = eventData[i];
    const nextEvent = eventData[i + 1];
    eventDataWithBreaks.push(currentEvent);
    const currEnd = currentEvent.endTime.split(':').slice(0,2).join(":");
    const nextStart = nextEvent.startTime.split(':').slice(0,2).join(":");
    if (currEnd < nextStart) {
      eventDataWithBreaks.push({
        id: maxId,
        startTime: currentEvent.endTime,
        endTime: nextEvent.startTime,
        title: 'Break / Team Time',
        location: 'N/A',
        confirmed: true,
      });
      maxId++;
    }
  }
  if (eventData.length > 1) {
    eventDataWithBreaks.push(eventData[eventData.length - 1]);
  }
  // console.log(eventDataWithBreaks);
  return (
    <Grid gap={3}>
      {eventDataWithBreaks.map(item => (
        <DailyEvent
          key={item.id}
          startTime={formatDate(item.startTime)}
          endTime={formatDate(item.endTime)}
          eventTitle={item.title}
          location={item.location == null ? location : null}
          confirmed={item.confirmed}
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

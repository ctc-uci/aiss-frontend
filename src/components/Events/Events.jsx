import DailyEvent from './DailyEvent.jsx';
import PropTypes from 'prop-types';

import { Grid } from '@chakra-ui/react';
const Events = ({ eventData }) => {

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

    const endHour = currEnd.split(':')[0]
    const endMin = currEnd.split(':')[1]
    const convertTimeToMin = (hour, min) => {
      return parseInt(hour) * 60 + parseInt(min);
    };
    const startHour = nextStart.split(':')[0]
    const startMin = nextStart.split(':')[1]

    const timeDiff = convertTimeToMin(startHour, startMin) - convertTimeToMin(endHour, endMin);
    if (currEnd < nextStart && timeDiff >= 5) {
      eventDataWithBreaks.push({
        id: maxId,
        startTime: currentEvent.endTime,
        endTime: nextEvent.startTime,
        title: 'Break / Team Time',
        confirmed: true,
      });
      maxId++;
    }
  }
  if (eventData.length > 1) {
    eventDataWithBreaks.push(eventData[eventData.length - 1]);
  }

  return (
    <Grid gap={3}>
      {eventDataWithBreaks.map(item => (
        <DailyEvent
          key={item.id}
          event={item}
        />
      ))}
    </Grid>
  );
};

Events.propTypes = {
  eventData: PropTypes.array.isRequired,
};

export default Events;

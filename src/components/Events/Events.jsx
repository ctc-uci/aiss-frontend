import DailyEvent from './DailyEvent.jsx';
import PropTypes from 'prop-types';

import {
    Grid,
} from '@chakra-ui/react';


const Events = ( {eventData, location} ) => {

    const formatDate = (date) => {
      let time = date.split(":");
      let hours = time[0];
      let mins = time[1];
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${mins} ${ampm}`;
    }
    return (

        <Grid gap={3}>
            {eventData.map(item => (
                <DailyEvent
                    key={item.id}
                    startTime={formatDate(item.startTime)}
                    endTime={formatDate(item.endTime)}
                    eventTitle={item.title}
                    location={location}
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

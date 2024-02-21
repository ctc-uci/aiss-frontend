import DailyEvent from './DailyEvent.jsx';
import PropTypes from 'prop-types';

import {
    Grid,
} from '@chakra-ui/react';


const Events = ( {eventData, location} ) => {
    return (

        <Grid gap={3}>
            {eventData.map(item => (
                <DailyEvent
                    key={item.id}
                    startTime={item.startTime}
                    endTime={item.endTime}
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

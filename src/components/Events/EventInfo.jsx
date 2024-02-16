import PropTypes from 'prop-types';
import {
    Box,
    Text,
    Grid,
} from '@chakra-ui/react';

const EventInfo = ({eventDate, day, startTime, endTime, location, notes}) => {
    return (

        <Box p={10}>
            <Grid gap={7}>
                <Grid gap={2}>
                    <Text fontSize='2xl' fontWeight="bold">{eventDate}</Text>
                    <Text>{day} {startTime} - {endTime}</Text>
                </Grid>

                <Grid gap={0}>
                    <Text>{location}</Text>
                </Grid>

                <Grid gap={0}>
                    <Text>Details:</Text>
                    <Text>{notes != null ? "notes" : "No notes."}</Text>
                </Grid>
            </Grid>
         </Box>
    );
};

EventInfo.propTypes = {
    eventDate: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    notes: PropTypes.string
};

export default EventInfo;

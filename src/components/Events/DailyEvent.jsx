import PropTypes from 'prop-types';
import {
    Box,
    Flex,
    Text,
    Grid,
} from '@chakra-ui/react';

const DailyEvent = ({startTime, endTime, eventTitle, location}) => {
    return (
        <Box bg="#F7FAFC" p={6} borderRadius="7" borderLeftWidth='10px' borderColor='#2B93D1' boxShadow='md'>
            <Flex minWidth='max-content' alignItems='flex-start' gap='50'>

            
                <Grid gap={2}>
                    <Text>{startTime} - {endTime}</Text>
                </Grid>


                <Grid gap={2}>
                    <Text fontWeight="bold">{eventTitle}</Text>
                    <Text>{location}</Text>
                </Grid>
            
            </Flex>
        </Box>
    );
};

DailyEvent.propTypes = {
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
};

export default DailyEvent;

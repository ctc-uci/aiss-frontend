import PropTypes from 'prop-types';
import { Box, Flex, Text, Grid, Button } from '@chakra-ui/react';

const DailyEvent = ({ startTime, endTime, eventTitle, location, confirmed }) => {
  // console.log("CONFIRMED:" + confirmed);
  let border_color = '#2B93D1';
  let background_color = '#F7FAFC';
  if (!confirmed) {
    border_color = '#F69052';
    background_color = '#FEF1DC';
  }

  return (
    <Box
      bg={background_color}
      p={6}
      borderRadius="7"
      borderLeftWidth="10px"
      borderColor={border_color}
      boxShadow="md"
    >
      <Flex minWidth="max-content" alignItems="flex-start" gap="50">
        {/* <Text>{confirmed}</Text> */}
        <Box w="35vh">
          <Text>
            {startTime} - {endTime}
          </Text>
        </Box>

        <Box w="90%">
          <Grid gap={2}>
            <Text fontWeight="bold">{eventTitle}</Text>
            <Text>{location}</Text>
          </Grid>
        </Box>

        {!confirmed ? (
          <Box w="15vh" alignItems="top">
            <Grid gap={2}>
              <div></div>
              <div></div>
              <Button bg="#FBD38D" textColor="#2D3748" size="sm">
                Confirm
              </Button>
            </Grid>
          </Box>
        ) : (
          <Box w="10%"></Box>
        )}
      </Flex>
    </Box>
  );
};

DailyEvent.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  eventTitle: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  confirmed: PropTypes.bool.isRequired,
};

export default DailyEvent;

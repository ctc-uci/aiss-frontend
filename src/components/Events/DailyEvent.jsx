import PropTypes from 'prop-types';
import { Box, Flex, Text, Grid, Button, Spacer } from '@chakra-ui/react';
import { useState } from 'react';
import { NPOBackend } from '../../utils/auth_utils.js';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';
const { USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const DailyEvent = ({ id, startTime, endTime, eventTitle, confirmed, description }) => {
  const [confirmEvent, setConfirmEvent] = useState(confirmed);
  const {currentUser} = useAuthContext();

  let border_color = '#2B93D1';
  let background_color = '#F7FAFC';
  if (!confirmEvent) {
    border_color = '#F69052';
    background_color = '#FEF1DC';
  }

  const handleConfirm = async () => {
    const date = new Date();
    try {
      let response;
      response = await NPOBackend.put(`/published-schedule/${id}`, {
          confirmed: true,
          confirmedOn: date,
        }
      );
      console.log(response);
      setConfirmEvent(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      <Flex minWidth="max-content" alignItems="flex-start" gap="50" justifyContent="space-between">
        <Text>
          {startTime} - {endTime}
        </Text>

        <Grid gap={2}>
          <Text fontWeight="bold">{eventTitle}</Text>
          <Text maxW="30vw" whiteSpace="pre-wrap">{description}</Text>
        </Grid>

        <Spacer />

        {!confirmEvent && (
          <Box w="15vh" alignItems="top">
            <Grid gap={2}>
              <div></div>
              <div></div>
              <Button bg="#FBD38D" textColor="#2D3748" size="sm" onClick={handleConfirm} visibility={currentUser.type == USER_ROLE ? 'hidden' : 'visible'}>
                Confirm
              </Button>
            </Grid>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

DailyEvent.propTypes = {
  id: PropTypes.number.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  eventTitle: PropTypes.string.isRequired,
  description: PropTypes.string,
  confirmed: PropTypes.bool.isRequired,
};

export default DailyEvent;

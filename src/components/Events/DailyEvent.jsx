import PropTypes from 'prop-types';
import { Box, Flex, Text, Grid, Button, Spacer, Badge, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { NPOBackend } from '../../utils/auth_utils.js';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';
const { USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const DailyEvent = ({ id, startTime, endTime, eventTitle, confirmed, description, eventId }) => {
  const [confirmEvent, setConfirmEvent] = useState(confirmed);
  const [cohort, setCohort] = useState(undefined);
  const [cohortBadgeColor, setCohortBadgeColor] = useState(undefined);
  const [cohortTextColor, setCohortTextColor] = useState(undefined);
  const [cohortBorderColor, setCohortBorderColor] = useState(undefined);
  const [cohortBorder, setCohortBorder] = useState(undefined);
  const {currentUser} = useAuthContext();

  let border_color = '#2B93D1';
  let background_color = '#F7FAFC';
  if (!confirmEvent) {
    border_color = '#F69052';
    background_color = '#FEF1DC';
  }

  const getCohort = async () => {
    if (eventId) {
      try {
        const { data } = await NPOBackend.get(`/catalog/${eventId}`);
        let year = data[0].year;
        if( year.length == 2)
        {
          setCohort('Both');
          setCohortBadgeColor("#FFFFFF");
          setCohortTextColor("#4A5568");
          setCohortBorderColor("#4A5568");
          setCohortBorder("outline");
        }
        else if(year[0] == 'junior')
        {
          setCohort('Junior');
          setCohortBadgeColor("#CBD5E0");
          setCohortTextColor("#171923");
          setCohortBorderColor("#CBD5E0");
          setCohortBorder("simple");
        }
        else {
          setCohort('Senior');
          setCohortBadgeColor("#4A5568");
          setCohortTextColor("#FFFFFF");
          setCohortBorderColor("#4A5568");
          setCohortBorder("simple");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  getCohort();

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

        <VStack align="flex-end">
        <Badge
            key={eventId}
            variant={cohortBorder}
            backgroundColor={cohortBadgeColor}
            color={cohortTextColor}
            textTransform="capitalize"
            borderRadius="10rem"
            borderColor={cohortBorderColor}
            fontWeight="normal"
            px="0.5rem"
            mr="0.125rem"
          >
            {cohort}
          </Badge>

        {!confirmEvent && (
          <Box w="4rem" alignItems="top">
            <Grid gap={2}>
              <div></div>
              <div></div>
              <Button
                variant="outline"
                bg="#FEF1DC"
                textColor="#F69052"
                borderColor="#F69052"
                _hover={{ bg: "#F6AD55", color: "#2D3748" }}
                size="xs"
                onClick={handleConfirm}
                visibility={currentUser.type == USER_ROLE ? 'hidden' : 'visible'}
              >
                Confirm
              </Button>
          </Grid>
        </Box>
        )}
        </VStack>
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
  eventId: PropTypes.number.isRequired,
};

export default DailyEvent;

import PropTypes from 'prop-types';
import { Box, Flex, Text, Grid, Button, Spacer, Badge, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NPOBackend } from '../../utils/auth_utils.js';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';
const { USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const DailyEvent = ({ event }) => {
  const [confirmEvent, setConfirmEvent] = useState(event.confirmed);
  const [cohort, setCohort] = useState(undefined);
  const [cohortBadgeColor, setCohortBadgeColor] = useState(undefined);
  const [cohortTextColor, setCohortTextColor] = useState(undefined);
  const [cohortBorderColor, setCohortBorderColor] = useState(undefined);
  const [cohortBorder, setCohortBorder] = useState(undefined);
  const {currentUser} = useAuthContext();
  const [eventData, setEventData] = useState(event);

  useEffect(() => {
    setEventData(event);

    if (event.year) {
      if( event.year.length == 2)
      {
        setCohort('Both');
        setCohortBadgeColor("#FFFFFF");
        setCohortTextColor("#4A5568");
        setCohortBorderColor("#4A5568");
        setCohortBorder("outline");
      }
      else if(event.year[0] == 'junior')
      {
        setCohort('Junior');
        setCohortBadgeColor("#CBD5E0");
        setCohortTextColor("#171923");
        setCohortBorderColor("#CBD5E0");
        setCohortBorder("simple");
      }
      else if(event.year[0] == 'senior')
      {
        setCohort('Senior');
        setCohortBadgeColor("#4A5568");
        setCohortTextColor("#FFFFFF");
        setCohortBorderColor("#4A5568");
        setCohortBorder("simple");
      }
    }
  }, [event]);

  const formatDate = (date) => {
    let time = date.split(":");
    let hours = time[0];
    let mins = time[1];
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins} ${ampm}`;
  }

  const handleConfirm = async () => {
    const date = new Date();
    try {
        await NPOBackend.put(`/published-schedule/${eventData.id}`, {
          confirmed: true,
          confirmedOn: date,
        }
      );
      setConfirmEvent(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <Box
      bg={eventData.confirmed ? '#F7FAFC' : '#FEF1DC'}
      p={6}
      borderRadius="7"
      borderLeftWidth="10px"
      borderColor={eventData.confirmed ? '#2B93D1' : '#F69052'}
      boxShadow="md"
    >
      <Flex minWidth="max-content" alignItems="flex-start" gap="50" justifyContent="space-between">
        <Text>
          {formatDate(eventData.startTime)} - {formatDate(eventData.endTime)}
        </Text>

        <Grid gap={2}>
          <Text fontWeight="bold">{eventData.title}</Text>
          <Text maxW="30vw" whiteSpace="pre-wrap">{eventData.description}</Text>
        </Grid>

        <Spacer />

        <VStack align="flex-end">
          <Badge
            key={eventData.id}
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
  event: PropTypes.object.isRequired,
};

export default DailyEvent;

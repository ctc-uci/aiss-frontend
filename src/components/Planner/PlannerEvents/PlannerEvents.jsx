import { useState, useEffect, useContext } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import AddEventOverlay from './AddEventOverlay';
import Catalog from '../../../pages/Catalog/Catalog';
// import PropTypes from 'prop-types';
import { DayIdContext } from '../../../pages/PublishedSchedule/AddDayContext';
import { NPOBackend } from '../../../utils/auth_utils';

const PlannerEvents = () => {
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [existingEventData, setExistingEventData] = useState({});
  const [dateHeader, setDateHeader] = useState('');
  const { dayId } = useContext(DayIdContext);

  useEffect(() => {
    const getDayData = async () => {
      try {
        const response = await NPOBackend.get(`/day/${dayId}`);
        // const [locationPart] = response.data[0].location.split('T');
        // setLocationPart(locationPart);
        const [datePart] = response.data[0].eventDate.split('T');
        setDateHeader(datePart);
      } catch (error) {
        console.error(error);
      }
    };
    getDayData();
    console.log(dateHeader);
  }, [dayId]);

  const handleCreateNewEvent = () => {
    setExistingEventData({});
    openPSEventForm();
  }

  const openPSEventForm = () => {
    setOverlayIsVisible(!overlayIsVisible);
    setIsVisible(!isVisible);
  };

  return (
    <div id={s['planner-events-container']}>
      {overlayIsVisible && <AddEventOverlay eventData={existingEventData} setOverlayIsVisible={openPSEventForm}/>}
      <div id={s['planner-browse']}>
        {isVisible && (
          <>
            <Heading size="md" pb="1rem">{dateHeader}</Heading>
            <Box bgColor="white" p="1rem" borderRadius="5px" mb="1rem">
              <Heading size="md" pb="1rem" color="gray.800" fontWeight={600}>Create New Event</Heading>
              <Button
                onClick={handleCreateNewEvent}
                className={s['create-event-button']}
                backgroundColor="#2c93d1"
                _hover={{ bgColor: '#1b6896' }}
                padding="1.5rem"
                justifyContent="space-between"
                alignItems="center"
                size="lg"
              >
                <Text  color="white">
                  Add Event
                </Text>
                <AddIcon color="white" />
              </Button>
            </Box>

            <Box bgColor="white" p="1rem" borderRadius="5px">
              <Heading size="md" color="gray.800" fontWeight={600}>Add Event From Catalog</Heading>
              <Catalog onDayPlanner={true} addExistingEventFunc={openPSEventForm} setExistingEventData={setExistingEventData}/>
            </Box>
          </>
        )}
      </div>
    </div>
  );
};


export default PlannerEvents;

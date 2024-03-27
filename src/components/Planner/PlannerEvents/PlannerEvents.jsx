import { useState, useEffect, useContext } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Catalog from '../../../pages/Catalog/Catalog';
import PropTypes from 'prop-types';
import { PlannerContext } from '../PlannerContext';
import { NPOBackend } from '../../../utils/auth_utils';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';

const PlannerEvents = ({ onClose }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [existingEventData, setExistingEventData] = useState({});
  const [dateHeader, setDateHeader] = useState('');
  const { plannedEventsContext, dayId } = useContext(PlannerContext);
  const plannedEvents = plannedEventsContext[0];

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
  }, [dayId]);

  const handleCreateNewEvent = () => {
    setExistingEventData({});
    togglePSForm();
  }

  const togglePSForm = () => {
    setIsAddingEvent(!isAddingEvent);
  };

  const closeModal = async () => {
    // delete day if empty
    if (plannedEvents.length === 0) {
      try {
        console.log('deleting day!!')
        await NPOBackend.delete(`/day/${dayId}`);
      } catch (error) {
        console.error(error);
      }
    }
    onClose();
  }

  return (
    <div id={s['planner-events-container']} className={s['gray-scrollbar-vertical']}>
      {/* {overlayIsVisible && <AddEventOverlay eventData={existingEventData} setOverlayIsVisible={openPSEventForm}/>} */}
      <div id={s['planner-browse']}>
        <Box hidden={!isAddingEvent} h={!isAddingEvent && '0px'}>
          <AddEventToPublishedScheduleForm eventData={existingEventData} closeForm={togglePSForm}/>
        </Box>

        <Box hidden={isAddingEvent} h={isAddingEvent && '0px'}>
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

          <Box bgColor="white" p="1rem" pb="0.5rem" borderRadius="5px">
            <Heading size="md" color="gray.800" fontWeight={600}>Add Event From Catalog</Heading>
            <Catalog onDayPlanner={true} addExistingEventFunc={togglePSForm} setExistingEventData={setExistingEventData}/>
          </Box>

          <Flex flexDir="row-reverse" py="1.5rem">
            <Button
            backgroundColor="#2c93d1"
            _hover={{ bgColor: '#1b6896' }}
            color="white"
            isDisabled={!plannedEvents.length}
            >
              Finish Day
            </Button>
            <Button onClick={closeModal} mr="1rem">Cancel</Button>
          </Flex>
        </Box>
      </div>
    </div>
  );
};

PlannerEvents.propTypes = {
  onClose: PropTypes.func,
};

export default PlannerEvents;

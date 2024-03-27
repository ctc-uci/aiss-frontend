import { useState, useEffect, useContext } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box, IconButton, HStack, Flex, useDisclosure } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import Catalog from '../../../pages/Catalog/Catalog';
import PropTypes from 'prop-types';
import { PlannerContext } from '../PlannerContext';
import { NPOBackend } from '../../../utils/auth_utils';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';
import AddDayModal from '../../../pages/PublishedSchedule/AddDayModal';

const PlannerEvents = ({ onClose }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [existingEventData, setExistingEventData] = useState({});
  const [dateHeader, setDateHeader] = useState('');
  const [dayData, setDayData] = useState({});
  const { isOpen: isOpenDay, onOpen: onOpenDay, onClose: onCloseDay } = useDisclosure();
  const { plannedEventsContext, dayId } = useContext(PlannerContext);
  const [dataShouldRevalidate, setShouldDataRevalidate] = useState(false);
  const plannedEvents = plannedEventsContext[0];

  const getDayData = async () => {
    try {
      console.log('getDayData');
      const response = await NPOBackend.get(`/day/${dayId}`);
      const responseData = response.data[0];
      const [datePart] = responseData.eventDate.split('T');
      const dateObj = new Date(responseData.eventDate);
      console.log(dateObj);
      setDateHeader(dateObj.toLocaleDateString({ year: 'numeric', month: 'short', day: '2-digit' }));
      setDayData({id: responseData.id, eventDate: datePart, location: responseData.location, details: responseData.notes});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('fetch data first time?')
    getDayData();
  }, [dayId]);

  useEffect(() => {
    if (dataShouldRevalidate) {
      console.log('reset data');
      getDayData();
      setShouldDataRevalidate(false);
    }
  }, [dataShouldRevalidate])

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
            <HStack>
            <Heading size="md" pb="1rem">{dateHeader}</Heading>
              <IconButton mb="1rem" icon={<EditIcon />} onClick={onOpenDay}></IconButton>
              <AddDayModal
                isOpenDay={isOpenDay}
                onCloseDay={onCloseDay}
                isEdit={true}
                dayData={dayData}
                setShouldDataRevalidate={setShouldDataRevalidate}
              />
            </HStack>
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

import { useState, useEffect, useContext } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box, IconButton, HStack, Flex, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FiEdit2 } from "react-icons/fi";
import Catalog from '../../../pages/Catalog/Catalog';
import PropTypes from 'prop-types';
import { PlannerContext } from '../PlannerContext';
import { NPOBackend } from '../../../utils/auth_utils';
import AddDayModal from '../../../pages/PublishedSchedule/AddDayModal';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';
import EmptyDayModal from '../EmptyDayModal';

const PlannerEvents = ({ onClose }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [dateHeader, setDateHeader] = useState('');
  const [dayData, setDayData] = useState({});
  const { isOpen: isOpenDay, onOpen: onOpenDay, onClose: onCloseDay } = useDisclosure();
  const { isOpen: isOpenEmptyDay, onOpen: onOpenEmptyDay, onClose: onCloseEmptyDay } = useDisclosure();

  const { plannedEventsContext, dayId, editContext, currEventContext } = useContext(PlannerContext);
  const [isEdit, setIsEdit] = editContext;
  const setCurrEvent = currEventContext[1]; // fix?
  const [dataShouldRevalidate, setShouldDataRevalidate] = useState(false);
  const plannedEvents = plannedEventsContext[0];

  const getUTCDate = (eventDate) => {
    const utcDate = new Date(eventDate);
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  }

  const getDayData = async () => {
    try {
      const response = await NPOBackend.get(`/day/${dayId}`);
      const responseData = response.data[0];
      const [datePart] = responseData.eventDate.split('T');
      const dateObj = getUTCDate(responseData.eventDate);
      setDateHeader(dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", }));
      setDayData({id: responseData.id, eventDate: datePart, location: responseData.location, details: responseData.notes});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDayData();
  }, [dayId]);

  useEffect(() => {
    if (dataShouldRevalidate) {
      getDayData();
      setShouldDataRevalidate(false);
    }
  }, [dataShouldRevalidate])

  const handleCreateNewEvent = () => {
    setCurrEvent({});
    togglePSForm();
  }

  const togglePSForm = () => {
    if (isEdit) {
      setIsEdit(false);
      return;
    }
    setIsAddingEvent(!isAddingEvent);
  };

  const closeModal = async () => {
    // delete day if empty
    if (plannedEvents.length === 0) {
      onOpenEmptyDay();
    } else {
      onClose();
    }
  }

  return (
    <div id={s['planner-events-container']} className={s['gray-scrollbar-vertical']}>
      <div id={s['planner-browse']}>
        {(isAddingEvent || isEdit) &&
          <AddEventToPublishedScheduleForm closeForm={togglePSForm} />
        }

        <Box hidden={isAddingEvent || isEdit} h={(isAddingEvent || isEdit) && '0px'}>
          <HStack mb="1.25rem">
            <Text fontWeight={600}> Date: </Text>
            <HStack borderBottom="1px" borderBottomColor="gray.300">
              <Text>{dateHeader}</Text>
              <IconButton icon={<FiEdit2 />} onClick={onOpenDay} color="gray.600" size="sm" h="24px"></IconButton>
            </HStack>

            <Text fontWeight={600} ml="3rem"> Location: </Text>
            <HStack borderBottom="1px" borderBottomColor="gray.300">
              <Text>{dayData.location}</Text>
              <IconButton icon={<FiEdit2 />} onClick={onOpenDay} color="gray.600" size="sm" h="24px"></IconButton>
            </HStack>
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
            <Catalog onDayPlanner={true} addExistingEventFunc={togglePSForm} setCurrEvent={setCurrEvent} />
          </Box>

          <Flex flexDir="row-reverse" py="1.5rem">
            <Button
            backgroundColor="#2c93d1"
            _hover={{ bgColor: '#1b6896' }}
            color="white"
            onClick={closeModal}
            >
              Save and Exit
            </Button>
          </Flex>
        </Box>
        <AddDayModal isOpenDay={isOpenDay} onCloseDay={onCloseDay} isEdit={true} dayData={dayData} setShouldDataRevalidate={setShouldDataRevalidate} />
        <EmptyDayModal onClose={onCloseEmptyDay} isOpen={isOpenEmptyDay} onClosePlanner={onClose} />
      </div>
    </div>
  );
};

PlannerEvents.propTypes = {
  onClose: PropTypes.func,
};

export default PlannerEvents;

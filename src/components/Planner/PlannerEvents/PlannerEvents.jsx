import { useState, useContext } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box, Flex, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Catalog from '../../../pages/Catalog/Catalog';
import PropTypes from 'prop-types';
import { PlannerContext } from '../PlannerContext';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';
import EmptyDayModal from '../EmptyDayModal';

const PlannerEvents = ({ onClose }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { isOpen: isOpenEmptyDay, onOpen: onOpenEmptyDay, onClose: onCloseEmptyDay } = useDisclosure();

  const { plannedEventsContext, editContext, currEventContext } = useContext(PlannerContext);
  const [isEdit, setIsEdit] = editContext;
  const setCurrEvent = currEventContext[1]; // fix?
  const plannedEvents = plannedEventsContext[0];

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
        <EmptyDayModal onClose={onCloseEmptyDay} isOpen={isOpenEmptyDay} onClosePlanner={onClose} />
      </div>
    </div>
  );
};

PlannerEvents.propTypes = {
  onClose: PropTypes.func,
};

export default PlannerEvents;

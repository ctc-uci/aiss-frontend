import s from '../PlannerLayout.module.css';
import {
  Text,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import AddEventOverlay from './AddEventOverlay';
// import CreateEventForm from '../../CreateEventForm/CreateEventForm';

const PlannerEvents = () => {
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);

  return (
    <div>
    <div id={s['planner-events-container']}>
    {/* <div> */}
      {overlayIsVisible && <AddEventOverlay setOverlayIsVisible={setOverlayIsVisible} />}
      <div id={s['planner-browse']}>
      {/* <div> */}
        <Text fontSize="1.875rem" marginBottom="1rem">
          Add Event to Day
        </Text>
        <Button
          onClick={() => {
            setOverlayIsVisible(true);
          }}
          className={s['create-event-button']}
          backgroundColor="blackAlpha.500"
          _hover={{
            backgroundColor: 'blackAlpha.400',
          }}
          padding="1.5rem"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="1rem"
        >
          <Text fontSize="1.125rem" color="white">
            Create New Event
          </Text>
          {/* <CreateEventForm/> */}
          <AddIcon color="white" />
        </Button>
        <hr className={s['header-divider']} />
      </div>
    </div>
  </div>    
  );
};
export default PlannerEvents;

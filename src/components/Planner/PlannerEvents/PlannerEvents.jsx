import { useState } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import AddEventOverlay from './AddEventOverlay';
import Catalog from '../../../pages/Catalog/Catalog';

const PlannerEvents = () => {
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleCreateEventClick = () => {
    setOverlayIsVisible(!overlayIsVisible);
    setIsVisible(!isVisible);
  };

  return (
    <div id={s['planner-events-container']}>
      {overlayIsVisible && <AddEventOverlay setOverlayIsVisible={handleCreateEventClick}/>}
      <div id={s['planner-browse']}>
        {isVisible && ( 
          <>
            <Text fontSize="1.875rem" marginBottom="1rem">
              Add Event to Day
            </Text>
            <Button
              onClick={handleCreateEventClick}
              className={s['create-event-button']}
              backgroundColor="blackAlpha.500"
              _hover={{
                backgroundColor: 'blackAlpha.400',
              }}
              padding="1.5rem"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="1rem"
              size="lg"
            >
              <Text fontSize="1.125rem" color="white">
                Create New Event
              </Text>
              <AddIcon color="white" />
            </Button>
          </>
        )}
        <Catalog />
        <hr className={s['header-divider']} />
      </div>
    </div>
  );
};

export default PlannerEvents;

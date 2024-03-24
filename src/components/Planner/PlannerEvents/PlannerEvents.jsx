import { useState } from 'react';
import s from '../PlannerLayout.module.css';
import { Text, Button, Heading, Box } from '@chakra-ui/react';
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
            <Box bgColor="white" p="1rem" borderRadius="5px" mb="1rem">
              <Heading size="md" pb="1rem" color="gray.800" fontWeight={600}>Create New Event</Heading>
              <Button
                onClick={handleCreateEventClick}
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
              <Catalog onDayPlanner={true}/>
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default PlannerEvents;

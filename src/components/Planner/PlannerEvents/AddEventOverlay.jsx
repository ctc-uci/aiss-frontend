// import s from '../PlannerLayout.module.css';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';
import { useContext } from 'react';
import { PlannerContext } from '../PlannerContext';

// eslint-disable-next-line react/prop-types
const AddEventOverlay = ({ setOverlayIsVisible, eventData }) => {
  const { plannedEventsContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  return (
    <div>
      {/* <div className={s['add-event-container']}> */}
      <div>
        <div>
          <AddEventToPublishedScheduleForm eventData={eventData} cancelFunction={() => {
              setPlannedEvents(plannedEvents.filter(e => e.id != -1));
              setOverlayIsVisible(false);
            }}/>
          {/* <Text fontSize="1.25rem">Event Information</Text> */}
        </div>
        {/* <Stack spacing={2} justifyContent="right" direction="row">
          <Button
            paddingX="1.5rem"
            size="sm"
            borderRadius="full"
            backgroundColor="blackAlpha.400"
            _hover={{ backgroundColor: 'blackAlpha.300' }}
            onClick={() => {
              setOverlayIsVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            paddingX="1.5rem"
            size="sm"
            borderRadius="full"
            backgroundColor="blackAlpha.400"
            _hover={{ backgroundColor: 'blackAlpha.300' }}
            isDisabled
          >
            Add Event
          </Button>
        </Stack> */}
      </div>
    </div>
  );
};

export default AddEventOverlay;

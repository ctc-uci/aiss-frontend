import { Text } from '@chakra-ui/react';
// import s from '../PlannerLayout.module.css';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';
import { NPOBackend } from '../../../utils/auth_utils';
import { useEffect, useState, useContext } from 'react';
import { DayIdContext } from '../../../pages/PublishedSchedule/AddDayContext';
import { PlannerContext } from '../PlannerContext';

// eslint-disable-next-line react/prop-types
const AddEventOverlay = ({ setOverlayIsVisible, eventData }) => {
  const { dayId } = useContext(DayIdContext);
  const [datePart, setDatePart] = useState('');
  const [locationPart, setLocationPart] = useState('');
  const { plannedEventsContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  useEffect(() => {
    const getDayData = async () => {
      try {
        const response = await NPOBackend.get(`/day/${dayId}`);
        const [locationPart] = response.data[0].location.split('T');
        setLocationPart(locationPart);
        const [datePart] = response.data[0].eventDate.split('T');
        setDatePart(datePart);
        //console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    };
    getDayData();
  }, [dayId]);
  return (
    <div>
      <Text fontSize="30px" marginBottom="1rem">
        {datePart} | {locationPart}
      </Text>
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

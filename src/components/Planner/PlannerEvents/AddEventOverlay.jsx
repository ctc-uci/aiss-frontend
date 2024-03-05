import { Stack, Text, Button } from '@chakra-ui/react';
// import s from '../PlannerLayout.module.css';
import AddEventToPublishedScheduleForm from '../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm';

// eslint-disable-next-line react/prop-types
const AddEventOverlay = ({ setOverlayIsVisible, dayId }) => {
  return (
    // <div id={s['add-event-overlay']}>
    <div>
      <Text fontSize="30px" marginBottom="1rem">
        MM/DD/YYYY | Location
      </Text>
      {/* <div className={s['add-event-container']}> */}
      <div>
        <div>
          <AddEventToPublishedScheduleForm dayId={dayId}/>
          {/* <Text fontSize="1.25rem">Event Information</Text> */}
        </div>  
        <Stack spacing={2} justifyContent="right" direction="row">
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
        </Stack>
      </div>
    </div>
  );
};

export default AddEventOverlay;

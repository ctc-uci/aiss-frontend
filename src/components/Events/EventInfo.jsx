import PropTypes from 'prop-types';
import { Box, Text, IconButton, HStack, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { LuPen } from 'react-icons/lu';
import PlannerModal from '../Planner/PlannerModal';

const EventInfo = ({ dayId, eventDate, day, startTime, endTime, location, notes }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p="1rem">
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="0.5rem">
        {eventDate}
      </Text>
      <Text color="gray.700" mb="1.5rem">
        {day} {startTime} - {endTime}
      </Text>

      <Text mb="1.5rem">{location}</Text>

      <Text mb="0.5rem">Details:</Text>
      <Text whiteSpace="pre-wrap" mb="2rem">{notes ? notes : 'No notes.'}</Text>

      <HStack mt="auto">
        <IconButton bg="white" onClick={onOpen}>
          <LuPen color='#A0AEC0'/>
        </IconButton>
        <IconButton bg="white">
          <DeleteIcon color='#A0AEC0'/>
        </IconButton>
      </HStack>

      <PlannerModal isOpen={isOpen} onClose={onClose} dayId={dayId} />
    </Box>

  );
};

EventInfo.propTypes = {
  dayId: PropTypes.number.isRequired,
  eventDate: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  notes: PropTypes.string,
};

export default EventInfo;

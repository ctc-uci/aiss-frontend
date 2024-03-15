import PropTypes from 'prop-types';
import { Box, Text, Grid, IconButton, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { LuPen } from 'react-icons/lu';
import DeleteDayModal from './DeleteDayModal/DeleteDayModal';

const EventInfo = ({ dayId, eventDate, day, startTime, endTime, location, notes, setRevalidateData }) => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const handleDeleteClick = () => {
    onDeleteOpen();
  };

  const handleEditClick = () => {
    // open up modal for planner
  };

  return (
    <Box p={10}>
      <Grid gap={7}>
        <Grid gap={2}>
          <Text fontSize="2xl" fontWeight="bold">
            {eventDate}
          </Text>
          <Text>
            {day} {startTime} - {endTime}
          </Text>
        </Grid>

        <Grid gap={0}>
          <Text>{location}</Text>
        </Grid>

        <Grid gap={0}>
          <Text>Details:</Text>
          <Text>{notes != null ? 'notes' : 'No notes.'}</Text>
        </Grid>

        <Grid alignItems="end" templateColumns="repeat(7, 1fr)">
          {/* <IconButton bg="white">
            <LuPen color='#A0AEC0'/>
          </IconButton> */}
          <IconButton bg="white"
                color="white"
                icon={<LuPen color='#A0AEC0'/>}
                onClick={() => handleEditClick(dayId)}
          >
          </IconButton>
          <IconButton bg="white"
                color="white"
                icon={<DeleteIcon color='#A0AEC0'/>}
                onClick={() => handleDeleteClick(dayId)}
          >
          </IconButton>
          
        </Grid>
      </Grid>
      <DeleteDayModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          deleteItemId={dayId}
          setRevalidateData={setRevalidateData}
        />
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
  setRevalidateData: PropTypes.func.isRequired,
};

export default EventInfo;

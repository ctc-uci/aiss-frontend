import PropTypes from 'prop-types';
import { Box, Text, IconButton, HStack, Button, useDisclosure, Modal, ModalHeader, ModalCloseButton, ModalOverlay, ModalContent, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { LuPen } from 'react-icons/lu';
import PlannerModal from '../Planner/PlannerModal';
import { NPOBackend } from '../../utils/auth_utils';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';
const { USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const EventInfo = ({ dayId, eventDate, day, startTime, endTime, location, notes, setShouldDataRevalidate }) => {
  const { isOpen: isOpenPlanner, onOpen: onOpenPlanner, onClose: onClosePlanner } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const toast = useToast();
  const {currentUser} = useAuthContext();

  const handlePlannerClose = () => {
    setShouldDataRevalidate(true);
    onClosePlanner();
  }

  const handleDeleteDay = async () => {
    const res = await NPOBackend.delete(`/day/${dayId}`);
    if (res.status === 200) {
      toast({
        title: 'Date deleted',
        status: 'success',
        variant: 'subtle',
        position: 'top-right',
        containerStyle: {
          mt: '6rem',
          mr: '100px'
        },
        duration: 3000,
        isClosable: true,
      });
      setShouldDataRevalidate(true);
    }
  }

  return (
    <Box p="1rem">
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="0.5rem">
        {eventDate}
      </Text>
      <Text color="gray.700" mb="1.5rem">
        {day} {startTime} - {endTime}
      </Text>

      <Text as="b" mb="0.5rem">Location: </Text>
      <Text whiteSpace="pre-wrap" mb="2rem">{location}</Text>

      <Text as="b" mb="0.5rem">Details:</Text>
      <Text whiteSpace="pre-wrap" mb="2rem">{notes ? notes : 'No notes.'}</Text>

      <HStack mt="auto">
        <IconButton bg="white" onClick={onOpenPlanner} visibility={currentUser.type === USER_ROLE ? 'hidden' : 'visible'}>
          <LuPen color='#A0AEC0'/>
        </IconButton>
        <IconButton bg="white" onClick={onOpenDelete} visibility={currentUser.type === USER_ROLE ? 'hidden' : 'visible'}>
          <DeleteIcon color='#A0AEC0'/>
        </IconButton>
      </HStack>

      <PlannerModal isOpen={isOpenPlanner} onClose={handlePlannerClose} dayId={dayId} />

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Day?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure? You can&apos;t undo this action afterwards.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={onCloseDelete}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteDay}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  setShouldDataRevalidate: PropTypes.func,
};

export default EventInfo;

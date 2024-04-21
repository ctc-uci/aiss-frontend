import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import { NPOBackend } from '../../utils/auth_utils';
import { useContext } from 'react';
import { PlannerContext } from './PlannerContext';

const RemoveTimelineEventModal = ({ isOpen, onClose, deleteItemId, closeForm }) => {

  const { plannedEventsContext, editContext, currEventContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;
  const setCurrEvent = currEventContext[1];
  const setIsEdit = editContext[1];

  const toast = useToast();

  const handleConfirmDelete = async idToDelete => {
    try {
      console.log('id to delete:', idToDelete);
      toast.closeAll();
      await NPOBackend.delete(`/published-schedule/${idToDelete}`);
      setPlannedEvents(plannedEvents.filter(e => (e.id != -1 && e.id != idToDelete)));
      toast({
        title: 'Event Removed',
        status: 'success',
        variant: 'subtle',
        position: 'top-right',
        containerStyle: {
          mt: '6rem',
        },
        duration: 3000,
        isClosable: true,
      });
      onClose();

      // TODO: uncomment to close reset planner form
      setCurrEvent({});
      setIsEdit(false);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(deleteItemId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Event?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure? You can&apos;t undo this action afterwards.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button ml='1rem' onClick={() => handleConfirmDelete(deleteItemId)} colorScheme='red'>Remove</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

RemoveTimelineEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.number.isRequired,
  closeForm: PropTypes.func,
};

export default RemoveTimelineEventModal;

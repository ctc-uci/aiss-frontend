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
} from '@chakra-ui/react';
import { NPOBackend } from '../../utils/auth_utils';
import { useContext } from 'react';
import { PlannerContext } from './PlannerContext';

const RemoveTimelineEventModal = ({ isOpen, onClose, deleteItemId }) => {

  const { plannedEventsContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  const handleConfirmDelete = async idToDelete => {
    try {
      console.log('id to delete:', idToDelete);
      await NPOBackend.delete(`/published-schedule/${idToDelete}`);
      setPlannedEvents(plannedEvents.filter(e => (e.id != -1 && e.id != idToDelete)));
      // setDataShouldRevalidate(true);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(deleteItemId);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Event?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure? You can&apos;t undo this action afterwards.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(deleteItemId)} colorScheme='red'>Remove</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

RemoveTimelineEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.number.isRequired,
};

export default RemoveTimelineEventModal;

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

const EmptyDayModal = ({ isOpen, onClose, onClosePlanner }) => {
  const { dayId } = useContext(PlannerContext);

  const handleConfirmDelete = async () => {
    try {
      await NPOBackend.delete(`/day/${dayId}`);
      onClose();
      onClosePlanner();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Warning</ModalHeader>
        <ModalCloseButton />
        <ModalBody>No events have been added, this day will not be saved.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Back to editing</Button>
          <Button ml='1rem' onClick={handleConfirmDelete} colorScheme='red'>Exit anyways</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EmptyDayModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClosePlanner: PropTypes.func.isRequired,
};

export default EmptyDayModal;

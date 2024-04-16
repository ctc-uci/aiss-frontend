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
import { NPOBackend } from '../../../utils/auth_utils';

const DeleteEventModal = ({ isOpen, onClose, deleteItemId, setDataShouldRevalidate }) => {
  const handleConfirmDelete = async idToDelete => {
    try {
      await NPOBackend.delete(`/catalog/${idToDelete}`);
      setDataShouldRevalidate(true);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Event?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this event? You cannot undo this action afterward.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={2}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(deleteItemId)} colorScheme='red'>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.number.isRequired,
  setDataShouldRevalidate: PropTypes.func.isRequired,
};

export default DeleteEventModal;

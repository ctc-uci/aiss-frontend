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

const DeleteEventModal = ({ isOpen, onClose, deleteItemId, setModified }) => {
  const handleConfirmDelete = async idToDelete => {
    try {
      await NPOBackend.delete(`/catalog/${idToDelete}`);
      setModified(true);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this row?</ModalBody>
          <ModalFooter>
            <Button onClick={() => handleConfirmDelete(deleteItemId)}>Delete</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
  );
}

DeleteEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.number.isRequired,
  setModified: PropTypes.func.isRequired,
}

export default DeleteEventModal;

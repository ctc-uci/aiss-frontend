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
import { NPOBackend } from '../../utils/auth_utils.js';

const DeleteAccountModal = ({ isOpen, onClose, deleteItemId}) => {
  const handleConfirmDelete = async idToDelete => {
    try {
      await NPOBackend.delete(`/users/${idToDelete}`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deactivate Account(s)?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure? You cannot undo this action afterwards.</ModalBody>
        <ModalFooter gap='3'>
        <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(deleteItemId)} colorScheme='red'>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.string.isRequired,
};

export default DeleteAccountModal;

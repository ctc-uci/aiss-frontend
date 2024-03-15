import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';
import { NPOBackend } from '../../../utils/auth_utils';

//delete day when delete button is clicked on ps
const DeleteDayModal = ({ isOpen, onClose, deleteItemId, setRevalidateData }) => {
  const handleConfirmDelete = async () => {
    try {
      await NPOBackend.delete(`/day/${deleteItemId}`).then(() => {setRevalidateData(toggle => !toggle)});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Day</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure? You can&apos;t undo this action afterwards.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} >Cancel</Button>
          <Button onClick={() => handleConfirmDelete()} colorScheme='red'>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteDayModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteItemId: PropTypes.number.isRequired,
  setRevalidateData: PropTypes.func.isRequired
};

export default DeleteDayModal;

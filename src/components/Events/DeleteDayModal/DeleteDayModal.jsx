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
import { NPOBackend } from '../../../utils/auth_utils';

//delete day when delete button is clicked on ps
const DeleteDayModal = ({ isOpen, onClose, deleteItemId, setRevalidateData }) => {
  const toast = useToast();

  const handleConfirmDelete = async () => {
    try {
      await NPOBackend.delete(`/day/${deleteItemId}`)
      .then(() => {
        setRevalidateData(toggle => !toggle);
        onClose();
        toast({
          title: 'Date Deleted.',
          status: 'success',
          sduration: 3000,
          position: 'top-right'
          
        });
      });
    } catch (error) {
      console.error(error);
      onClose();
      toast({
        title: 'Error occured deleting date.',
        status: 'error',
        sduration: 3000,
        position: 'top-right'
      });
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

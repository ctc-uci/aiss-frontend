import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react'
import PropTypes from 'prop-types';
import PlannerLayout from './PlannerLayout.jsx';

const PlannerModal = ({isOpen, onClose, dayId}) => {
  return (
    <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <PlannerLayout dayId={dayId} onClose={onClose}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

PlannerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dayId: PropTypes.number.isRequired,
};

export default PlannerModal;

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react'
import Planner from '../../pages/Planner/Planner.jsx';
import PropTypes from 'prop-types';

const PlannerModal = ({isOpen, onClose, dayId}) => {
  return (
    <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Planner dayId={dayId}/>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
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

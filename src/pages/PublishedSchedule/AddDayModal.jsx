import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react'
import AddDayForm from '../../components/AddDayForm/AddDayForm.jsx';
import { useState } from 'react';
import PlannerModal from '../../components/Planner/PlannerModal.jsx';
import PropTypes from 'prop-types';

const AddDayModal = ({isOpenDay, onCloseDay, setShouldDataRevalidate}) => {
  const { isOpen: isOpenPlanner, onOpen: onOpenPlanner, onClose: onClosePlanner } = useDisclosure();
  const [dayId, setDayId] = useState(-1);

  const handleOpenPlanner = () => {
    onCloseDay(); // Close the first modal when opening the second modal
    onOpenPlanner(); // Open the second modal
  };

  const handlePlannerClose = () => {
    setShouldDataRevalidate(true);
    onClosePlanner();
  }

  return (
    <>
      <Modal isOpen={isOpenDay} size={'xl'} onClose={onCloseDay}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <AddDayForm
              onClose={onCloseDay}
              onOpen={handleOpenPlanner}
              setDayId={setDayId}
              />
          </ModalBody>
        </ModalContent>
      </Modal>

      <PlannerModal isOpen={isOpenPlanner} onClose={handlePlannerClose} dayId={dayId} />
    </>
    );
};

AddDayModal.propTypes = {
  isOpenDay: PropTypes.bool,
  onCloseDay: PropTypes.func,
  setShouldDataRevalidate: PropTypes.func,
};export default AddDayModal;

import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  //useDisclosure,
} from '@chakra-ui/react';
import StatTable from '../../components/StatTable/StatTable';

const StatModal = ({ isOpen, onClose }) => {
  //const { isOpen: isOpenStatModal, onOpen: onOpenStatModal, onClose: onCloseStatModal } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <StatTable />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

StatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatModal;

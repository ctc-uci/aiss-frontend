import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import StatTable from '../../components/StatTable/StatTable';

const StatModal = ({ isOpen, onClose, season }) => {
  console.log(season);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalBody>
            <StatTable season={season}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

StatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  season: PropTypes.string.isRequired,
};

export default StatModal;

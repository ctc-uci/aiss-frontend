import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import StatTable from '../../components/StatTable/StatTable';

const StatModal = ({ isOpen, onClose, season, allSeasons }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalCloseButton />
          <ModalBody>
            <StatTable season={season} allSeasons={allSeasons}/>
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
  allSeasons: PropTypes.array.isRequired,
};

export default StatModal;

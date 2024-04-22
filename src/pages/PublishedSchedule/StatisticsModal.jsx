import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Flex,
} from '@chakra-ui/react';
import StatTable from '../../components/StatTable/StatTable';

const StatModal = ({ isOpen, onClose, season, allSeasons }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalBody>
            <Flex justifyContent="space-between" alignItems="center" marginBottom="0rem">
              <Button colorScheme="blue" onClick={onClose} variant="outline">
                Close
              </Button>
              <h1 style={{ textAlign: 'center', fontWeight:'normal', fontSize: '1.75rem', margin: '0 5rem 0 0' }}>Season Summary</h1>
              <div></div>
            </Flex>
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

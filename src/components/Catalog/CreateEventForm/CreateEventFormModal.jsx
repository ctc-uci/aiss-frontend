import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalContent, ModalOverlay, ModalCloseButton } from '@chakra-ui/react';
import CreateEventForm from './CreateEventForm';

const CreateEventFormModal = ({ isOpen, onClose, eventData, setModified }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalCloseButton />
        <ModalBody>
          {eventData ? (
            <CreateEventForm eventData={eventData} setModified={setModified} closeModal={onClose} />
          ) : (
            <CreateEventForm setModified={setModified} closeModal={onClose} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

CreateEventFormModal.propTypes = {
  eventData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    host: PropTypes.string,
    year: PropTypes.number,
    eventType: PropTypes.string,
    subject: PropTypes.string,
    description: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setModified: PropTypes.func.isRequired,
};

CreateEventForm.defaultProps = {
  eventData: undefined,
};

export default CreateEventFormModal;

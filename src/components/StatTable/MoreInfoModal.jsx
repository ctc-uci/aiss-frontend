import PropTypes from 'prop-types';
import {
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Heading,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const MoreInfoModal = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalCloseButton />
          <ModalBody p="28px 40px">
            <Heading fontSize="20px" color="#2B6CB0" mb="24px">
              <InfoOutlineIcon mr="8px"/>
              More Info
            </Heading>
            <Text mb="24px">The event <b>Dr. Jong-Levinger</b> is tagged as <b>Science</b> and <b>Engineering</b>.</Text>
            <Image src="/MoreInfoEvent.svg" mb="24px"></Image>
            <Text mb="24px">So it will appear once under <b>Science</b>, and once under <b>Engineering</b>.</Text>
            <Image src="/MoreInfoTable.svg" mb="24px"></Image>
            <Text mb="24px">But the final <b>Total</b> is still <b>1</b>.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

MoreInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MoreInfoModal;

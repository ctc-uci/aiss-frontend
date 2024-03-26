import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';
import Planner from '../../pages/Planner/Planner.jsx';
import AddDayForm from '../../components/AddDayForm/AddDayForm.jsx';
import { useState } from 'react';


const AddDayModal = () => {
  const { isOpen: isOpenDay, onOpen: onOpenDay, onClose:onCloseDay } = useDisclosure();
  const { isOpen: isOpenPlanner, onOpen: onOpenPlanner, onClose: onClosePlanner } = useDisclosure();
  const [dayId, setDayId] = useState(-1);

  const handleOpenPlanner = () => {
      onCloseDay(); // Close the first modal when opening the second modal
      onOpenPlanner(); // Open the second modal
    };

  return (
    <>
      {/* <Button onClick={onOpenDay}>Add Day</Button> */}
      <IconButton
        bgColor="blue.700"
        color="gray.50"
        borderRadius="10rem"
        position="fixed"
        bottom="2rem"
        right={{ base: '1rem', lg: '2rem', xl: '3rem' }}
        fontSize="0.75rem"
        w="3rem"
        h="3rem"
        _hover={{ bgColor: 'blue.500' }}
        onClick={onOpenDay}
        icon={<AddIcon />}
      >
        Create
      </IconButton>

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

      <Modal isOpen={isOpenPlanner} size={'full'} onClose={onClosePlanner}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Planner dayId={dayId}/>
          </ModalBody>

          <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClosePlanner}>
              Close
              </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    );
};

export default AddDayModal;

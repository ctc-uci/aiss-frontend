import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
  } from '@chakra-ui/react'
  import { DayIdProvider } from './AddDayContext.jsx';
import Planner from '../../pages/Planner/Planner.jsx';
import AddDayForm from '../../components/AddDayForm/AddDayForm.jsx';


  const AddDayModal = () => {
    const { isOpen: isOpenDay, onOpen:onOpenDay, onClose:onCloseDay } = useDisclosure();
    const { isOpen: isOpenPlanner, onOpen: onOpenPlanner, onClose: onClosePlanner } = useDisclosure();

    const handleOpenPlanner = () => {
        onCloseDay(); // Close the first modal when opening the second modal
        onOpenPlanner(); // Open the second modal
      };

    return (
      <DayIdProvider>
        <>
          <Button onClick={onOpenDay}>Add Day</Button>
    
          <Modal isOpen={isOpenDay} size={'xl'} onClose={onCloseDay}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader> Add New Day</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <AddDayForm
                  onClose={onCloseDay}
                  onOpen={handleOpenPlanner}
                  />
              </ModalBody>
            </ModalContent>
          </Modal>

          <Modal isOpen={isOpenPlanner} size={'full'} onClose={onClosePlanner}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Planner Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Text>This is the planner modal</Text>
            <Planner/>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClosePlanner}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </DayIdProvider>
      );
  };

export default AddDayModal;
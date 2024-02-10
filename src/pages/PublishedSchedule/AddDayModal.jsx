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

  const AddDayModal = () => {
    const { isOpen: isOpenDay, onOpen:onOpenDay, onClose:onCloseDay } = useDisclosure();
    const { isOpen: isOpenPlanner, onOpen: onOpenPlanner, onClose: onClosePlanner } = useDisclosure();

    const handleOpenPlanner = () => {
        onCloseDay(); // Close the first modal when opening the second modal
        onOpenPlanner(); // Open the second modal
      };

    return (
        <>
          <Button onClick={onOpenDay}>Add Day</Button>
    
          <Modal isOpen={isOpenDay} onClose={onCloseDay}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Day Modal</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>This is the add day modal</Text>
              </ModalBody>
              
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onCloseDay}>
                  Close
                </Button>
                <Button variant='ghost' onClick={handleOpenPlanner}>Open Planner</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isOpenPlanner} size={'full'} onClose={onClosePlanner}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Planner Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Text>This is the planner modal</Text>
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
  
// export default function BasicUsage() {
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     return (
//       <>
//         <Button onClick={onOpen}>Open Modal</Button>
  
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Modal Title</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <Lorem count={2} />
//             </ModalBody>
  
//             <ModalFooter>
//               <Button colorScheme='blue' mr={3} onClick={onClose}>
//                 Close
//               </Button>
//               <Button variant='ghost'>Secondary Action</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </>
//     )
//   }

export default AddDayModal;
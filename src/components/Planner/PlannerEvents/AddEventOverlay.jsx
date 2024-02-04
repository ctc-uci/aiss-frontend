import s from '../PlannerLayout.module.css';

// const AddEventModal = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   return (
//     <>
//       <div>
//         <Button onClick={onOpen} backgroundColor='#9E9E9E' height='50px' justifyContent='space-between' className= {s['create-event-button'] }>
//         {/* className={s['create-event-button']} */}
//           <Text fontSize='18px' color='white' >Create New Event</Text>
//           {/* FIX: plus sign not vertically aligned with text */}
//           <Text fontSize='25px'color='white' >+</Text>
//         </Button>
//       </div>

//       <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
//         <ModalOverlay />
//         <ModalContent style={{ right: 0 }}>
//           <ModalHeader>MM/DD/YYY | Location</ModalHeader>
//           <ModalBody>
//             {/* Your modal content goes here */}
//             Cool form stuff will be here!
//           </ModalBody>

//           <ModalFooter>
//             <Button borderRadius='100px' colorScheme="gray" mr={3} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button borderRadius='100px' colorScheme="gray">Add Event</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   )};

const AddEventOverlay = () => {
  return <div id={s['add-event-overlay']}>AddEventOverlay</div>;
};

export default AddEventOverlay;

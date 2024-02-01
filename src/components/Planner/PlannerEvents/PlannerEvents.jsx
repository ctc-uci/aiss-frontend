import s from '../PlannerLayout.module.css';
import {
  ModalContent,
  ModalBody,
  ModalHeader,
  Modal,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  //ModalContent,
  Text,
  useDisclosure,
  Button,
  ModalOverlay,
  ModalFooter,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const AddEventModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div>
        <Button onClick={onOpen} backgroundColor='#9E9E9E' height='50px' justifyContent='space-between' className= {s['create-event-button'] }>
        {/* className={s['create-event-button']} */}
          <Text fontSize='18px' color='white' >Create New Event</Text>
          {/* FIX: plus sign not vertically aligned with text */}
          <Text fontSize='25px'color='white' >+</Text>
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
        <ModalOverlay />
        <ModalContent style={{ right: 0 }}>
          <ModalHeader>MM/DD/YYY | Location</ModalHeader>
          <ModalBody>
            {/* Your modal content goes here */}
            Cool form stuff will be here!
          </ModalBody>

          <ModalFooter>
            <Button borderRadius='100px' colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button borderRadius='100px' colorScheme="gray">Add Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )};
  

const PlannerEvents = () => {
  return (
    <div id={s['planner-events-container']}>
      <Text fontSize='30px' marginBottom='15px' marginTop='20px' marginLeft='20px'>Add Event to Day</Text>
      <AddEventModal/>
      <Text marginLeft='20px' marginBottom='15px' color='#9e9e9e'>______________</Text>
      <Stack spacing={5} direction="row" width="92%" justifyContent="space-between">
        <InputGroup marginLeft='20px'>
          <InputLeftElement pointerEvents='none'>
            <Search2Icon marginRight='5px' marginBottom='7px' boxSize='.8em' color='#9e9e9e'/>
          </InputLeftElement>
          <Input size='sm' width='100%' fontSize='14px' placeholder='Search for a catalog event' id="catalogsearch" />
        </InputGroup>
        <Stack direction="row" width='100%'>
          <Select backgroundColor='#CCCCCC' size='sm' placeholder='Season'>
            <option>Winter</option>
            <option>Fall</option>
          </Select>
          <Select backgroundColor='#CCCCCC' size='sm' placeholder='Year'>
            <option>Junior</option>
            <option>Senior</option>
          </Select>
          <Select backgroundColor='#CCCCCC' size='sm' width='100%' placeholder='Category'>
            <option>TBA</option>
          </Select>
          <Select backgroundColor='#CCCCCC' size='sm' placeholder='Type'>
            <option>TBA</option>
          </Select>
        </Stack>
      </Stack>
      <TableContainer marginLeft='20px' marginTop='15px'>
        <Table vairant='simple'>
          <Thead>
          <Tr>
            <Th color='#4A5568'>EVENT</Th>
            <Th color='#4A5568'>HOST</Th>
            <Th color='#4A5568'>TAGS</Th>
          </Tr>
          </Thead>
          <Tbody>
            {/* insert mapping of catalog/pub sched events here, table entry component yet to be made */}
          </Tbody>
        </Table>
      </TableContainer>
    </div>


)};

export default PlannerEvents;

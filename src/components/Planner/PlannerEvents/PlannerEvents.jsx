import s from '../PlannerLayout.module.css';
import {
  Flex,
  IconButton,
  TableContainer,
  Table,
  Thead,
  Heading,
  Tr,
  Th,
  Tbody,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Textarea,
  FormControl,
} from '@chakra-ui/react';
import { Search2Icon, AddIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import AddEventOverlay from './AddEventOverlay';

const PlannerEvents = () => {
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);
  const {
    isOpen: isEditModalOpen,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  return (
    <div id={s['planner-events-container']}>
      <Modal isOpen={isEditModalOpen} onClose={onCloseEditModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Day Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Date:</FormLabel>
              <Input type="date" />
            </FormControl>

            <FormControl>
              <FormLabel>Location:</FormLabel>
              <Input />
            </FormControl>

            <FormControl>
              <FormLabel>Details:</FormLabel>
              <Textarea />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button> */}
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {overlayIsVisible && <AddEventOverlay setOverlayIsVisible={setOverlayIsVisible} />}
      <div id={s['planner-browse']}>
        <Flex p="0" m="0" alignItems="center" mb="1rem">
          <Heading as="h2" size="lg">
            hello!
          </Heading>
          <IconButton
            icon={<InfoOutlineIcon />}
            onClick={onOpenEditModal}
            background="transparent"
            _hover={{
              background: 'transparent',
            }}
          />
        </Flex>
        <Button
          onClick={() => {
            setOverlayIsVisible(true);
          }}
          className={s['create-event-button']}
          backgroundColor="blackAlpha.500"
          _hover={{
            backgroundColor: 'blackAlpha.400',
          }}
          padding="1.5rem"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="1rem"
        >
          <Text fontSize="1.125rem" color="white">
            Create New Event
          </Text>
          <AddIcon color="white" />
        </Button>
        <hr className={s['header-divider']} />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="1rem"
        >
          <InputGroup alignItems="center">
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="#9e9e9e" />
            </InputLeftElement>
            <Input
              size="md"
              placeholder="Search for a catalog event"
              id="catalogsearch"
              background="blackAlpha.100"
            />
          </InputGroup>
          <Stack direction="row" width="100%">
            <Select
              color="blackAlpha.600"
              backgroundColor="blackAlpha.400"
              size="sm"
              placeholder="Season"
              borderRadius="4px"
            >
              <option>Winter</option>
              <option>Fall</option>
            </Select>
            <Select
              color="blackAlpha.600"
              backgroundColor="blackAlpha.400"
              size="sm"
              placeholder="Year"
              borderRadius="4px"
            >
              <option>Junior</option>
              <option>Senior</option>
            </Select>
            <Select
              color="blackAlpha.600"
              backgroundColor="blackAlpha.400"
              size="sm"
              placeholder="Category"
              borderRadius="4px"
            >
              <option>Speaker</option>
              <option>Study Trip</option>
            </Select>
            <Select
              color="blackAlpha.600"
              backgroundColor="blackAlpha.400"
              size="sm"
              placeholder="Type"
              borderRadius="4px"
            >
              <option>Technology</option>
              <option>Other</option>
            </Select>
          </Stack>
        </Stack>
        <TableContainer
          className={s['planner-table-container']}
          backgroundColor="white"
          color="white"
          marginBottom="2rem"
          borderRadius="8px"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="gray.600">EVENT</Th>
                <Th color="gray.600">HOST</Th>
                <Th color="gray.600">TAGS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* TODO: insert mapping of catalog/pub sched events here, table entry component yet to be made */}
            </Tbody>
          </Table>
        </TableContainer>
        <Stack spacing={2} justifyContent="right" direction="row">
          <Button
            paddingX="1.5rem"
            size="sm"
            borderRadius="full"
            backgroundColor="blackAlpha.400"
            _hover={{ backgroundColor: 'blackAlpha.300' }}
          >
            Cancel
          </Button>
          <Button
            paddingX="1.5rem"
            size="sm"
            borderRadius="full"
            backgroundColor="blackAlpha.400"
            _hover={{ backgroundColor: 'blackAlpha.300' }}
            isDisabled
          >
            Finish Event
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default PlannerEvents;

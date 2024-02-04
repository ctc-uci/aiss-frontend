import s from '../PlannerLayout.module.css';
import {
  TableContainer,
  Table,
  Thead,
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
} from '@chakra-ui/react';
import { Search2Icon, AddIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { PlannerContext } from '../PlannerContext';
import AddEventOverlay from './AddEventOverlay';

const PlannerEvents = () => {
  const { overlayIsVisibleContext } = useContext(PlannerContext);
  const [overlayIsVisible, setOverlayIsVisible] = overlayIsVisibleContext;

  return (
    <div id={s['planner-events-container']}>
      {overlayIsVisible && <AddEventOverlay />}
      <div id={s['planner-browse']}>
        <Text fontSize="30px" marginBottom="1rem">
          Add Event to Day
        </Text>
        <Button
          onClick={() => {
            setOverlayIsVisible(true);
          }}
          className={s['create-event-button']}
          backgroundColor="blackAlpha.500"
          _hover={{
            backgroundColor: 'blackAlpha.400',
          }}
          height="50px"
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
              color="#757575"
              backgroundColor="#CCCCCC"
              size="sm"
              placeholder="Season"
              borderRadius="4px"
            >
              <option>Winter</option>
              <option>Fall</option>
            </Select>
            <Select
              color="#757575"
              backgroundColor="#CCCCCC"
              size="sm"
              placeholder="Year"
              borderRadius="4px"
            >
              <option>Junior</option>
              <option>Senior</option>
            </Select>
            <Select
              color="#757575"
              backgroundColor="#CCCCCC"
              size="sm"
              placeholder="Category"
              borderRadius="4px"
            >
              <option>Speaker</option>
              <option>Study Trip</option>
            </Select>
            <Select
              color="#757575"
              backgroundColor="#CCCCCC"
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
          backgroundColor="white"
          color="white"
          className={s['planner-table-container']}
          marginBottom="2rem"
          borderRadius="8px"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="#4A5568">EVENT</Th>
                <Th color="#4A5568">HOST</Th>
                <Th color="#4A5568">TAGS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* TODO: insert mapping of catalog/pub sched events here, table entry component yet to be made */}
            </Tbody>
          </Table>
        </TableContainer>
        <Stack spacing={5} justifyContent="right" direction="row">
          <div>
            <Button
              width="80px"
              marginRight="10px"
              size="sm"
              borderRadius="100px"
              backgroundColor="#999999"
            >
              Cancel
            </Button>
            <Button
              width="100px"
              size="sm"
              borderRadius="100px"
              backgroundColor="#CCCCCC"
              isDisabled
            >
              Finish Event
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default PlannerEvents;

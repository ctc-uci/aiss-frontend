import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalFooter,
  // ModalBody,
  // ModalCloseButton,
  // TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import AddDayModal from './AddDayModal.jsx';
// import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter.jsx';



const PublishedSchedule = () => {
  // get data from database
  const [items, setItems] = useState([]);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule');
      setItems(data);
    };
    renderTable();
  }, []);

  //update chakra table container accordingly
  return (
    <div> 
    <TableContainer>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Host</Th>
            <Th>Cohort Year</Th>
            <Th>Confirmed?</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item.id}>
              <Td>{item.title}</Td>
              <Td>{item.host}</Td>
              <Td>{item.cohort.join(', ')}</Td>
              <Td>{String(item.confirmed)}</Td>
              <Td>{String(item.startTime)}</Td>
              <Td>{String(item.endTime)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
    <AddDayModal/>
    {/* <AddDayModal
      onClose={onClose}
      onOpen={onOpen}
      isOpen={isOpen}
    /> */}
    </div>
  );
};

export default PublishedSchedule;

import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  // TableCaption,
  TableContainer,
} from '@chakra-ui/react';

const PublishedSchedule = () => {
  // get data from database
  const [items, setItems] = useState([]);

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule');
      setItems(data);
    };
    renderTable();
  }, []);

  //update chakra table container accordingly
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Host</Th>
            <Th isNumeric>Cohort Year</Th>
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
              <Td isNumeric>{item.cohort}</Td>
              <Td>{item.confirmed}</Td>
              <Td>{item.start_time}</Td>
              <Td>{item.end_time}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Title</Th>
            <Th>Host</Th>
            <Th isNumeric>Cohort Year</Th>
            <Th>Confirmed?</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default PublishedSchedule;

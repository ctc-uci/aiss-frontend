import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function Catalog() {
  // Create data state
  const [tableData, setTableData] = useState([]);

  // Fetch Table Data: .../catalog
  useEffect(() => {
    fetch('http://localhost:3001/catalog')
      .then(response => response.json())
      .then(data => setTableData(data));
  }, []);

  // Render table data
  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Event Information</TableCaption>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Host</Th>
              <Th>Cohort Type</Th>
              <Th>Event Type</Th>
              <Th>Subject</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map(({ id, host, title, eventType, subject, description, year }) => (
              <Tr key={id}>
                <Td>{title}</Td>
                <Td>{host}</Td>
                <Td>{year}</Td>
                <Td>{eventType}</Td>
                <Td>{subject}</Td>
                <Td>{description}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Th>Title</Th>
            <Th>Host</Th>
            <Th>Cohort Type</Th>
            <Th>Event Type</Th>
            <Th>Subject</Th>
            <Th>Description</Th>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
}

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function Catalog() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchCatalogData = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/catalog`);
      const data = await response.json();
      setTableData(data);
    };

    fetchCatalogData().catch(console.error);
  }, []);

  return (
    <TableContainer>
      <Table variant="simple">
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
      </Table>
    </TableContainer>
  );
}

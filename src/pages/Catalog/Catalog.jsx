import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Box, Center } from '@chakra-ui/react';
import { useState } from 'react';
import PaginationFooter from '../../components/PaginationFooter/PaginationFooter';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';

export default function Catalog() {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    subject: '',
    eventType: '',
    season: '',
    year: '',
  });

  const handleSearch = (event) => {
    console.log('searching for', event.target.value);
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.value,
    });
  };

    return (
      <div>

        <Center>
          <Box minW="950px" mt="8">
            <h1 style={{ fontSize: 35}}>Event Catalog</h1>
            <SearchAndFilter onSearch={handleSearch} onChange={handleFilterChange} />

            <TableContainer mt="8" mb = "8" borderRadius="md" overflowX="auto">
              <Table variant="simple" className="space-table" borderWidth="3px" width="100%">
                <Thead>
                  <Tr>
                    <Th textAlign="left">Event</Th>
                    <Th textAlign="left">Host</Th>
                    <Th textAlign="left">Tags</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map(({ id, host, title, eventType, subject, year, season }) => (
                    <Tr key={id}>
                      <Td textAlign="left">{title}</Td>
                      <Td textAlign="left">{host}</Td>
                      <Td textAlign="left">
                        <Badge colorScheme="orange" mr={2}>
                          {eventType}
                        </Badge>
                        <Badge colorScheme="cyan" mr={2}>
                          {subject}
                        </Badge>
                        <Badge colorScheme="purple" mr={2}>
                          {season}
                        </Badge>
                        <Badge colorScheme="red" mr={2}>
                          {year}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <PaginationFooter table="catalog" setData={setTableData} searchTerm={searchTerm} selectedFilters={selectedFilters} />
            </TableContainer>
          </Box>
        </Center>
      </div>
    );
  }


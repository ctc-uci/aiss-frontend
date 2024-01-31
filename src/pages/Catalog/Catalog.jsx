import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Input, Select, Flex, Box, Center, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import { Link } from 'react-router-dom';
const subjectsOptions = ['life skills', 'science', 'technology', 'engineering', 'math', 'college readiness'];
const eventOptions = ['guest speaker', 'study-trip', 'workshop', 'other'];
const yearOptions = ['junior', 'senior', 'both'];
const seasonOptions = ['fall', 'spring', 'summer', 'winter'];

export default function Catalog() {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    subject: '',
    eventType: '',
    season: '',
    year: '',
  });

  useEffect(() => {
    const fetchCatalogData = async () => {
     const params = {
        title: searchTerm,
        ...selectedFilters,
      };
      console.log('fetching catalog data with params', params);
      const response = await NPOBackend.get('/catalog', {
        params: params
      });
      console.log('response', response);
      setTableData(response.data);
    };

    const delay = setTimeout(() => {
      fetchCatalogData().catch(console.error);
    }, 750); // this is in miliseconds so 750 is .75 seconds, Vy design choice delay

    return () => clearTimeout(delay);

  }, [searchTerm, selectedFilters]);

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
        <Flex justify="space-between" align="center" mb="4" bgColor="gray.200" p="4">
          <Link to="/publishedschedule">
            <Button bgColor="gray.200">Schedule</Button>
          </Link>
          <Link to="/logout">
            <Button bgColor="gray.200">Logout</Button>
          </Link>
        </Flex>
  
        <Center>
          <Box minW="950px" mt="8">
            <h1 style={{ fontSize: 35}}>Event Catalog</h1>
            <Flex gap="4" mt="4">
              <Input placeholder="Search..." size="md" w="35%" bgColor="gray.200" className="searchBar" onChange={handleSearch} />
              <Flex gap="4" ml="auto">
                <Select placeholder="Subject" className="dropDown" bgColor="gray.200" name="subject" onChange={handleFilterChange}>
                  {subjectsOptions.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
                <Select placeholder="Event Type" className="dropDown" bgColor="gray.200" name="eventType" onChange={handleFilterChange}>
                  {eventOptions.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
                <Select placeholder="Year" className="dropDown" bgColor="gray.200" name="year" onChange={handleFilterChange}>
                  {yearOptions.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
                <Select placeholder="Season" className="dropDown" bgColor="gray.200" name="season" onChange={handleFilterChange}>
                  {seasonOptions.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
              </Flex>
            </Flex>
  
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
            </TableContainer>
          </Box>
        </Center>
      </div>
    );
  }
  
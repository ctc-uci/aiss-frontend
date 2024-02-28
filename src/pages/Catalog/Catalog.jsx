import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Input,
  Select,
  Flex,
  Box,
  Center,
  IconButton,
  useDisclosure,
  Button,
  Container
} from '@chakra-ui/react';
import { useState } from 'react';
import PaginationFooter from '../../components/PaginationFooter/PaginationFooter';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import DeleteEventModal from '../../components/DeleteEventModal/DeleteEventModal';
import CreateEventFormModal from '../../components/CreateEventForm/CreateEventFormModal';

const subjectsOptions = [
  'life skills',
  'science',
  'technology',
  'engineering',
  'math',
  'college readiness',
];
const eventOptions = ['guest speaker', 'study-trip', 'workshop', 'other'];
const yearOptions = ['junior', 'senior', 'both'];
const seasonOptions = ['fall', 'spring', 'summer', 'winter'];

export default function Catalog() {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditFormOpen, onOpen: onEditFormOpen, onClose: onEditFormClose } = useDisclosure();
  const { isOpen: isCreateFormOpen, onOpen: onCreateFormOpen, onClose: onCreateFormClose } = useDisclosure();

  const [tableData, setTableData] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(-1);
  const [editData, setEditData] = useState({});
  const [isModified, setModified] = useState(false);

  const handleRowHover = index => {
    setHoveredRow(index);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };

  const handleEditForm = data => {
    setEditData(data);
    onEditFormOpen();
  };

  const handleDeleteClick = id => {
    setDeleteItemId(id);
    onDeleteOpen();
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    subject: '',
    eventType: '',
    season: '',
    year: '',
  });

  const handleSearch = event => {
    console.log('searching for', event.target.value);
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Button onClick={onCreateFormOpen}>Create</Button>
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
            <Table variant="simple" className="space-table" borderWidth="1px" width="100%">
              <Thead>
                <Tr>
                  <Th textAlign="left">Event</Th>
                  <Th textAlign="left">Host</Th>
                  <Th textAlign="left">Tags</Th>
                  <Th width="8rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData.map(({ id, host, title, eventType, subject, year, season, description }, index) => (
                  <Tr key={id} onMouseEnter={() => handleRowHover(index)} onMouseLeave={handleRowLeave}>
                    <Td textAlign="left"py="1.5rem">{title}</Td>
                    <Td textAlign="left" py="1.5rem">{host}</Td>
                    <Td textAlign="left" py="1.5rem">
                      <Container>
                      {season &&
                        <Badge backgroundColor="#CEECC3" color="gray.900" textTransform="capitalize" borderRadius="10rem" fontWeight="normal" px="0.5rem" mr="0.5rem">
                          {season}
                        </Badge>
                      }
                      {year &&   
                        <Badge backgroundColor="#FFE1BE" color="gray.900" textTransform="capitalize" borderRadius="10rem" fontWeight="normal" px="0.5rem" mr="0.5rem">
                          {year}
                        </Badge>
                      }
                      {subject &&
                        <Badge backgroundColor="#E8D7FF" color="gray.900" textTransform="capitalize" borderRadius="10rem" fontWeight="normal" px="0.5rem" mr="0.5rem">
                          {subject}
                        </Badge>
                      }
                      {eventType &&
                        <Badge backgroundColor="#CFDCFF" color="gray.900" textTransform="capitalize" borderRadius="10rem" fontWeight="normal" px="0.5rem" mr="0.5rem">
                          {eventType}
                        </Badge>
                      }
                      </Container>
                    </Td>
                    <Td>
                      {hoveredRow === index && (
                        <>
                          <IconButton
                            color="gray.400"
                            backgroundColor="transparent"
                            p="0.5rem"
                            h="fit-content"
                            w="fit-content"
                            icon={<EditIcon />}
                            onClick={() => handleEditForm({id, title, host, year, eventType, subject, description})}
                          />
                          <IconButton 
                            color="gray.400"
                            backgroundColor="transparent" 
                            p="0.5rem"
                            h="fit-content"
                            w="fit-content"
                            icon={<DeleteIcon />} 
                            onClick={() => handleDeleteClick(id)} />
                        </>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <PaginationFooter table="catalog" setData={setTableData} searchTerm={searchTerm} selectedFilters={selectedFilters} isModified={isModified}/>
          </TableContainer>
          <CreateEventFormModal isOpen={isCreateFormOpen} onClose={onCreateFormClose} setModified={setModified} />
          <CreateEventFormModal isOpen={isEditFormOpen} onClose={onEditFormClose} eventData={editData} setModified={setModified} />
          <DeleteEventModal isOpen={isDeleteOpen} onClose={onDeleteClose} deleteItemId={deleteItemId} setModified={setModified} />
        </Box>
      </Center>
    </div>
  );
}

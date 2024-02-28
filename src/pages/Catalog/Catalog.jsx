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
  Container,
  Link,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import s from './Catalog.module.css';
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
  const {
    isOpen: isEditFormOpen,
    onOpen: onEditFormOpen,
    onClose: onEditFormClose,
  } = useDisclosure();
  const {
    isOpen: isCreateFormOpen,
    onOpen: onCreateFormOpen,
    onClose: onCreateFormClose,
  } = useDisclosure();

  const [tableData, setTableData] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(-1);
  const [editData, setEditData] = useState({});
  const [isModified, setModified] = useState(false);

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

  const handleClear = () => {
    setSelectedFilters({
      subject: '',
      eventType: '',
      season: '',
      year: '',
    });
  };

  return (
    <div>
      <IconButton
        bgColor="blue.700"
        color="gray.50"
        borderRadius="10rem"
        position="fixed"
        bottom="2rem"
        right="3rem"
        fontSize="0.75rem"
        w="3rem"
        h="3rem"
        _hover={{ bgColor: 'blue.500' }}
        onClick={onCreateFormOpen}
        icon={<AddIcon />}
      >
        Create
      </IconButton>
      <Center>
        <Box mt="8">
          <h1 style={{ fontSize: 35 }}>Event Catalog</h1>
          <Flex gap="4" mt="4">
            <Container m="0" p="0" w="35%" position="relative">
              <Input
                placeholder="Search..."
                size="sm"
                bgColor="blackAlpha.200"
                borderRadius="6px"
                pl="2.5rem"
                className="searchBar"
                onChange={handleSearch}
              />
              <SearchIcon
                position="absolute"
                left="1rem"
                top="50%"
                transform="translateY(-50%)"
                color="gray.600"
                zIndex="10"
              />
            </Container>
            <Flex gap="3" ml="auto" mr="0">
              <Select
                size="sm"
                placeholder="Subject"
                className="dropDown"
                bgColor="gray.200"
                name="subject"
                borderRadius="6px"
                onChange={handleFilterChange}
              >
                {subjectsOptions.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
              <Select
                size="sm"
                placeholder="Event Type"
                className="dropDown"
                bgColor="gray.200"
                name="eventType"
                borderRadius="6px"
                onChange={handleFilterChange}
              >
                {eventOptions.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
              <Select
                size="sm"
                placeholder="Year"
                className="dropDown"
                bgColor="gray.200"
                name="year"
                borderRadius="6px"
                onChange={handleFilterChange}
              >
                {yearOptions.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
              <Select
                size="sm"
                placeholder="Season"
                className="dropDown"
                bgColor="gray.200"
                name="season"
                borderRadius="6px"
                onChange={handleFilterChange}
              >
                {seasonOptions.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
              <Link
                fontSize="15"
                mr="2"
                mt="1"
                textAlign="right"
                width="80%"
                color="#4299E1"
                whiteSpace="nowrap"
                onClick={handleClear}
              >
                Clear Filters
              </Link>
            </Flex>
          </Flex>

          <TableContainer
            mt="8"
            mb="8"
            px="1rem"
            overflow="hidden"
            borderWidth="1px"
            borderRadius="12px"
          >
            <Table
              variant="simple"
              className={s['catalog-table']}
              borderWidth="0"
              width="100%"
              px="1rem"
            >
              <Thead>
                <Tr>
                  <Th textAlign="left">Event</Th>
                  <Th textAlign="left">Host</Th>
                  <Th textAlign="left">Tags</Th>
                  <Th width="8rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData.map(
                  ({ id, host, title, eventType, subject, year, season, description }) => (
                    <Tr key={id}>
                      <Td textAlign="left" py="1.5rem">
                        {title}
                      </Td>
                      <Td textAlign="left" py="1.5rem">
                        {host}
                      </Td>
                      <Td textAlign="left" py="1.5rem">
                        <Container
                          p="0"
                          m="0"
                          maxW="16rem"
                          display="flex"
                          flexWrap="wrap"
                          gap="0.375rem"
                        >
                          {season && (
                            <Badge
                              backgroundColor="#CEECC3"
                              color="gray.900"
                              textTransform="capitalize"
                              borderRadius="10rem"
                              fontWeight="normal"
                              px="0.5rem"
                              mr="0.125rem"
                            >
                              {season}
                            </Badge>
                          )}
                          {year && (
                            <Badge
                              backgroundColor="#FFE1BE"
                              color="gray.900"
                              textTransform="capitalize"
                              borderRadius="10rem"
                              fontWeight="normal"
                              px="0.5rem"
                              mr="0.125rem"
                            >
                              {year}
                            </Badge>
                          )}
                          {subject && (
                            <Badge
                              backgroundColor="#E8D7FF"
                              color="gray.900"
                              textTransform="capitalize"
                              borderRadius="10rem"
                              fontWeight="normal"
                              px="0.5rem"
                              mr="0.125rem"
                            >
                              {subject}
                            </Badge>
                          )}
                          {eventType && (
                            <Badge
                              backgroundColor="#CFDCFF"
                              color="gray.900"
                              textTransform="capitalize"
                              borderRadius="10rem"
                              fontWeight="normal"
                              px="0.5rem"
                              mr="0.125rem"
                            >
                              {eventType}
                            </Badge>
                          )}
                        </Container>
                      </Td>
                      <Td>
                        <IconButton
                          color="gray.400"
                          backgroundColor="transparent"
                          p="0.5rem"
                          h="fit-content"
                          w="fit-content"
                          icon={<EditIcon />}
                          onClick={() =>
                            handleEditForm({
                              id,
                              title,
                              host,
                              year,
                              eventType,
                              subject,
                              description,
                            })
                          }
                        />
                        <IconButton
                          color="gray.400"
                          backgroundColor="transparent"
                          p="0.5rem"
                          h="fit-content"
                          w="fit-content"
                          icon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(id)}
                        />
                      </Td>
                    </Tr>
                  ),
                )}
              </Tbody>
            </Table>
            <PaginationFooter
              table="catalog"
              setData={setTableData}
              searchTerm={searchTerm}
              selectedFilters={selectedFilters}
              isModified={isModified}
            />
          </TableContainer>
          <CreateEventFormModal
            isOpen={isCreateFormOpen}
            onClose={onCreateFormClose}
            setModified={setModified}
          />
          <CreateEventFormModal
            isOpen={isEditFormOpen}
            onClose={onEditFormClose}
            eventData={editData}
            setModified={setModified}
          />
          <DeleteEventModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            deleteItemId={deleteItemId}
            setModified={setModified}
          />
        </Box>
      </Center>
    </div>
  );
}

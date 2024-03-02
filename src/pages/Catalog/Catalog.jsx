import {
  Text,
  Input,
  Select,
  Flex,
  Box,
  IconButton,
  useDisclosure,
  Container,
  Link,
  TableContainer,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import DeleteEventModal from '../../components/Catalog/DeleteEventModal/DeleteEventModal';
import CreateEventFormModal from '../../components/Catalog/CreateEventForm/CreateEventFormModal';
import PaginationFooter from '../../components/Catalog/PaginationFooter/PaginationFooter';
import CatalogTable from '../../components/Catalog/CatalogTable';

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
    <Container maxW="none" m="0" p="0">
      <IconButton
        bgColor="blue.700"
        color="gray.50"
        borderRadius="10rem"
        position="fixed"
        bottom="2rem"
        right={{ base: '1rem', lg: '2rem', xl: '3rem' }}
        fontSize="0.75rem"
        w="3rem"
        h="3rem"
        _hover={{ bgColor: 'blue.500' }}
        onClick={onCreateFormOpen}
        icon={<AddIcon />}
      >
        Create
      </IconButton>

      <Box pt="1rem" w="100%" px={{ base: '1rem', lg: '4rem' }} maxW="1440px" mx="auto">
        <Text as="h1" fontSize="xx-large" fontWeight="bold">
          Event Catalog
        </Text>
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
          <CatalogTable
            tableData={tableData}
            handleEditForm={handleEditForm}
            handleDeleteClick={handleDeleteClick}
          />
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
    </Container>
  );
}

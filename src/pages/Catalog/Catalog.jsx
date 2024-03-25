import {
  Text,
  Input,
  Flex,
  Box,
  IconButton,
  useDisclosure,
  Container,
  Link,
  TableContainer,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import DeleteEventModal from '../../components/Catalog/DeleteEventModal/DeleteEventModal';
import CreateEventFormModal from '../../components/Catalog/CreateEventForm/CreateEventFormModal';
import PaginationFooter from '../../components/Catalog/PaginationFooter/PaginationFooter';
import CatalogTable from '../../components/Catalog/CatalogTable';
import SearchFilter from '../../components/Catalog/SearchFilter/SearchFilter';
import useSearchFilters from '../../components/Catalog/SearchFilter/useSearchFilters';
import { usePagination } from '@ajna/pagination';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../../components/Catalog/SearchFilter/filterOptions';
import PropTypes from 'prop-types';

export default function Catalog({ onDayPlanner, addExistingEventFunc, setExistingEventData }) {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  // const {
  //   isOpen: isEditFormOpen,
  //   onOpen: onEditFormOpen,
  //   onClose: onEditFormClose,
  // } = useDisclosure();
  const {
    isOpen: isCreateFormOpen,
    onOpen: onCreateFormOpen,
    onClose: onCreateFormClose,
  } = useDisclosure();

  const [tableData, setTableData] = useState([]);
  const [dataShouldRevalidate, setDataShouldRevalidate] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [deleteItemId, setDeleteItemId] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const { filters, clearFilters, filterValues } = useSearchFilters();
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;

  const { currentPage, setCurrentPage, pagesCount, offset, pageSize, setPageSize } = usePagination({
    initialState: { currentPage: 1, pageSize: 10 },
    pagesCount: Math.ceil(totalRowCount / 10),
  });

  // const handleEditForm = data => {
  //   setEditData(data);
  //   onEditFormOpen();
  // };

  const handleDeleteClick = id => {
    setDeleteItemId(id);
    onDeleteOpen();
  };

  const handleSearch = event => {
    console.log('searching for', event.target.value);
    setSearchTerm(event.target.value);
  };

  const fetchTableData = useCallback(async () => {
    console.log('Fetching Catalog');

    const params = {
      title: searchTerm,
      limit: pageSize,
      page: currentPage,
      ...Object.assign(
        {},
        ...Object.entries(filterValues).map(([name, selected]) => {
          return { [name]: selected.join(',') };
        }),
      ),
    };

    try {
      const { data } = await NPOBackend.get('/catalog', {
        params: params,
      });
      const { count, events: tableData } = data;

      setTableData(tableData);
      setTotalRowCount(Number(count[0].count));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [searchTerm, pageSize, currentPage, filterValues]);

  // Fetch data on component mount and pagination update
  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Fetch data when should revalidate (e.g. creating or editing an event)
  useEffect(() => {
    if (dataShouldRevalidate) {
      fetchTableData();
      setDataShouldRevalidate(false);
    }
  }, [dataShouldRevalidate, fetchTableData]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues, setCurrentPage]);

  return (
    <Container maxW="none" m="0" p="0">
      { !onDayPlanner &&
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
          onClick={addExistingEventFunc ? addExistingEventFunc : onCreateFormOpen}
          icon={<AddIcon />}
        >
          Create
        </IconButton>
      }
      <Box pt={!onDayPlanner && "1rem"} w="100%" px={!onDayPlanner && { base: '1rem', lg: '4rem' }} maxW="1440px" mx="auto">
        <Text as="h1" fontSize="xx-large" fontWeight="bold">
          {!onDayPlanner && 'Event Catalog'}
        </Text>
        <Flex gap="4" mt="4">
          <InputGroup size="sm" maxW="sm">
            <InputLeftElement>
              <SearchIcon
                position="absolute"
                left="1rem"
                top="50%"
                transform="translateY(-50%)"
                color="gray.600"
                zIndex="10"
              />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              bgColor="blackAlpha.200"
              borderRadius="6px"
              pl="2.5rem"
              className="searchBar"
              onChange={handleSearch}
            />
          </InputGroup>
          <Flex gap="3" justifyContent="flex-end" w="100%">
            <SearchFilter name="Season" options={seasonOptions} filter={seasonFilter} />
            <SearchFilter name="Cohort" options={yearOptions} filter={yearFilter} />
            <SearchFilter name="Topic" options={subjectOptions} filter={subjectFilter} />
            <SearchFilter name="Type" options={eventOptions} filter={eventFilter} />
            <Link
              fontSize="1rem"
              mr="2"
              mt="1"
              textAlign="right"
              color="blue.400"
              whiteSpace="nowrap"
              onClick={clearFilters}
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
          {tableData && tableData.length > 0 && (
            <>
              <CatalogTable
                tableData={tableData}
                setExistingEventData={setExistingEventData}
                // handleEditForm={handleEditForm}
                handleActionClick={onDayPlanner ? addExistingEventFunc : handleDeleteClick}
                onDayPlanner={onDayPlanner}
              />
              <PaginationFooter
                pagesCount={pagesCount}
                totalRowCount={totalRowCount}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rangeString={`${offset + 1} - ${offset + tableData.length}`}
              />
            </>
          )}
        </TableContainer>

        <CreateEventFormModal
          isOpen={isCreateFormOpen}
          onClose={onCreateFormClose}
          setDataShouldRevalidate={setDataShouldRevalidate}
        />
        {/* <CreateEventFormModal
          isOpen={isEditFormOpen}
          onClose={onEditFormClose}
          eventData={editData}
          setDataShouldRevalidate={setDataShouldRevalidate}
        /> */}
        <DeleteEventModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          deleteItemId={deleteItemId}
          setDataShouldRevalidate={setDataShouldRevalidate}
        />
      </Box>
    </Container>
  );
}

Catalog.propTypes = {
  onDayPlanner: PropTypes.bool,
  addExistingEventFunc: PropTypes.func,
  setExistingEventData: PropTypes.func
};

Catalog.defaultProps = {
  onDayPlanner: false
};

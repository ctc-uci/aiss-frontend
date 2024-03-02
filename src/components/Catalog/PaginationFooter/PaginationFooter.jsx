import { Select, Flex, Box, HStack, Text } from '@chakra-ui/react';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';
import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { NPOBackend } from '../../../utils/auth_utils';

const PaginationFooter = ({ setData, table, searchTerm, selectedFilters, isModified }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowRangeString, setRowRangeString] = useState('');
  const [dataCount, setDataCount] = useState(0);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(dataCount / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  // when the number of rows or the next page is clicked, get the desired data from the backend
  useEffect(() => {
    const refreshData = async () => {
      const params = {
        title: searchTerm,
        ...selectedFilters,
        limit: rowsPerPage,
        page: currentPage,
      };
      const { data } = await NPOBackend.get('/catalog', {
        params: params,
      });
      const { count, events: tableData } = data;

      setData(tableData); // data on the page
      setDataCount(count[0].count); // total number of data across all pages

      const start = (currentPage - 1) * rowsPerPage + 1;
      setRowRangeString(`${start} - ${start + tableData.length - 1}`); // range of data on the page
    };
    refreshData();
  }, [currentPage, rowsPerPage, setData, table, searchTerm, selectedFilters, isModified]);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, rowsPerPage, table]);

  return (
    <Flex direction="row" justify="space-between" border="solid" borderWidth="0" mx={5} p={3}>
      <HStack spacing={0}>
        <Box fontSize="14px" width="100%" whitespace="nowrap">
          Show rows per page&nbsp;
        </Box>
        <Select
          onChange={e => setRowsPerPage(e.target.value)}
          defaultValue={10}
          size="sm"
          width="50%"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Select>
      </HStack>
      <Flex align="center" gap={5}>
        <Text fontSize="14px">
          <Text as="b" fontSize="14px">
            {rowRangeString}
          </Text>
          &nbsp;of {dataCount}
        </Text>
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
          <PaginationContainer justify="right">
            <PaginationPrevious variant="ghost">&lsaquo;</PaginationPrevious>
            <PaginationNext variant="ghost">&rsaquo;</PaginationNext>
          </PaginationContainer>
        </Pagination>
      </Flex>
    </Flex>
  );
};
PaginationFooter.propTypes = {
  setData: PropTypes.func,
  table: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  searchTerm: PropTypes.string.isRequired,
  selectedFilters: PropTypes.shape({
    subject: PropTypes.string,
    eventType: PropTypes.string,
    season: PropTypes.string,
    year: PropTypes.string,
  }),
  isModified: PropTypes.bool.isRequired,
};

PaginationFooter.defaultProps = {
  data: [],
  table: '',
  setData: () => {},
};

export default PaginationFooter;

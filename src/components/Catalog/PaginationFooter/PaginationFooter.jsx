import { Select, Flex, Box, HStack, Text } from '@chakra-ui/react';
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';
import { PropTypes } from 'prop-types';

const PaginationFooter = ({
  pagesCount,
  totalRowCount,
  setPageSize,
  currentPage,
  setCurrentPage,
  rangeString,
}) => {
  return (
    <Flex direction="row" justify="space-between" border="solid" borderWidth="0" mx={5} p={3}>
      <HStack spacing={0}>
        <Box fontSize="14px" width="100%" whitespace="nowrap">
          Show rows per page&nbsp;
        </Box>
        <Select onChange={e => setPageSize(e.target.value)} defaultValue={10} size="sm" width="50%">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Select>
      </HStack>
      <Flex align="center" gap={5}>
        <Text fontSize="14px">
          <Text as="b" fontSize="14px">
            {rangeString}
          </Text>
          &nbsp;of {totalRowCount}
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
  pagesCount: PropTypes.number,
  totalRowCount: PropTypes.number,
  setPageSize: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  rangeString: PropTypes.string,
};

export default PaginationFooter;

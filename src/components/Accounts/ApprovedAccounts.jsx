import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Checkbox, useDisclosure } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import DeleteAccountModal from './DeleteAccountModal.jsx';
import PropTypes from 'prop-types';
import PaginationFooter from "../../components/Catalog/PaginationFooter/PaginationFooter";
import { usePagination } from '@ajna/pagination';

const ApprovedAccounts = ( {accountType, searchQuery} ) => {
    const [approvedAccounts, setApprovedAccounts] = useState([]);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [deleteItemId, setDeleteItemId] = useState("");
    const [totalRowCount, setTotalRowCount] = useState(0);
    const { currentPage, setCurrentPage, pagesCount, offset, pageSize, setPageSize } = usePagination({
        initialState: { currentPage: 1, pageSize: 10 },
        pagesCount: Math.ceil(totalRowCount / 10),
      });

    useEffect(() => {
        const renderTable = async () => {
            try {
                const { data } = await NPOBackend.get(`/users/approved-accounts`, {
                    params: {
                        keyword: (searchQuery && searchQuery.length) && searchQuery, 
                        page: currentPage, 
                        limit: pageSize, 
                        accountType: accountType}
                });
                setApprovedAccounts(data.accounts);
                setTotalRowCount(Number(data.count[0].count));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        renderTable();
    }, [searchQuery, totalRowCount, currentPage, pageSize, accountType])

    const handleDeleteClick = id => {
        setDeleteItemId(id);
        onDeleteOpen();
    }

    return (
        <Box>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th width="5%"><Checkbox isDisabled /></Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Deactivate</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        approvedAccounts.map((account, i) => (
                            <Tr key={i}>
                                <Td><Checkbox></Checkbox></Td>
                                <Td>{account.firstName} {account.lastName}</Td>
                                <Td>{account.email}</Td>
                                <Td>
                                    <Button onClick={() => { handleDeleteClick(account.id) }} size='sm' variant='outline'><CloseIcon w={3} h={3} color='gray'/></Button>
                                </Td>
                            </Tr>
                        ))
                    }
                    </Tbody>
                </Table>
            </TableContainer>
            <DeleteAccountModal isOpen={isDeleteOpen} onClose={onDeleteClose} deleteItemId={deleteItemId} />
            <PaginationFooter
                pagesCount={pagesCount}
                totalRowCount={totalRowCount}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rangeString={`${offset + 1} - ${offset + Number(pageSize)}`}
            />
        </Box>
    )
}

ApprovedAccounts.propTypes = {
    accountType: PropTypes.string.isRequired,
    searchQuery: PropTypes.string
};

export default ApprovedAccounts;
import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState, useCallback } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Checkbox, useDisclosure } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import DeleteAccountModal from './DeleteAccountModal.jsx';
import PropTypes from 'prop-types';
import PaginationFooter from "../../components/Catalog/PaginationFooter/PaginationFooter";
import { usePagination } from '@ajna/pagination';

const ApprovedAccounts = ( {accountType, searchQuery} ) => {
    const [approvedAccounts, setApprovedAccounts] = useState([]);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [deleteItemId, setDeleteItemId] = useState([]);
    const [totalRowCount, setTotalRowCount] = useState(0);
    const { currentPage, setCurrentPage, pagesCount, offset, pageSize, setPageSize} = usePagination({
        initialState: { currentPage: 1, pageSize: 10 },
        total: totalRowCount,
      });
    const [individualChecked, setIndividualChecked] = useState(new Array(approvedAccounts.length).fill(false));
    const [checkedAccountIds, setCheckedAccountIds] = useState([]);
    const [dataShouldRevalidate, setDataShouldRevalidate] = useState(false);    

    const fetchTableData = useCallback(async () => {
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
    }, [searchQuery, currentPage, pageSize, accountType]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    useEffect(() => {
        if (dataShouldRevalidate) {
            fetchTableData();
            setDataShouldRevalidate(false);
            setIndividualChecked(new Array(totalRowCount).fill(false));
            setCheckedAccountIds([]);
        }
    }, [dataShouldRevalidate, fetchTableData, totalRowCount]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, setCurrentPage, pageSize]);

    useEffect(() => {
        setIndividualChecked(new Array(totalRowCount).fill(false));
        setCheckedAccountIds([]);
    }, [searchQuery, currentPage, totalRowCount]);

    const handleDeleteClick = id => {
        setDeleteItemId(id);
        onDeleteOpen();
    }

    const updateAllCheckedAccountIds = (e) => {
        setIndividualChecked(new Array(approvedAccounts.length).fill(e.target.checked));
        if (e.target.checked) {
            let allIds = [];
            for (let i = 0; i < approvedAccounts.length; i++) {
                allIds.push(approvedAccounts[i].id)
            }
            setCheckedAccountIds(allIds);
        } else {
            setCheckedAccountIds([]);
        }
    }

    const updateIndividualCheckedAccountIds = (e, id, index) => {
        const newIndividualChecked = [...individualChecked];
        newIndividualChecked[index] = e.target.checked;
        setIndividualChecked(newIndividualChecked);
        let newCheckedAccountIds = [... checkedAccountIds];
        if (e.target.checked) {
            newCheckedAccountIds.push(id);
            setCheckedAccountIds(newCheckedAccountIds);
        } else {
            let index = newCheckedAccountIds.indexOf(id);
            newCheckedAccountIds.splice(index, 1);
            setCheckedAccountIds(newCheckedAccountIds);
        }
    }

    return (
        <Box>
            <TableContainer border="1px solid #ededed" borderRadius="10px">
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th w="5%"><Checkbox onChange={(e) => { updateAllCheckedAccountIds(e) }}/></Th>
                            <Th w="40%">Name</Th>
                            <Th w="40%">Email</Th>
                            <Th w="0">Deactivate</Th>
                            <Th w="15%">
                                <Button isDisabled={checkedAccountIds.length === 0}
                                        onClick={() => { handleDeleteClick(checkedAccountIds) }}
                                        size='sm'
                                        variant='outline'
                                        borderColor={checkedAccountIds.length != 0 ? 'red' : 'gray'}>
                                        <CloseIcon w={3} h={3} color={checkedAccountIds.length != 0 ? 'red' : 'gray'}/>
                                </Button>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        approvedAccounts.map((account, i) => (
                            <Tr key={i}>
                                <Td>
                                    <Checkbox
                                        isChecked={individualChecked[i]}
                                        onChange={(e) => { updateIndividualCheckedAccountIds(e, account.id, i)}}>
                                    </Checkbox>
                                </Td>
                                <Td>{account.firstName} {account.lastName}</Td>
                                <Td>{account.email}</Td>
                                <Td></Td>
                                <Td>
                                    <Button onClick={() => { handleDeleteClick([account.id]) }} size='sm' variant='outline'><CloseIcon w={3} h={3} color='gray'/></Button>
                                </Td>
                            </Tr>
                        ))
                    }
                    </Tbody>
                </Table>
                <PaginationFooter
                pagesCount={pagesCount}
                totalRowCount={totalRowCount}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rangeString={`${offset + 1} - ${offset + approvedAccounts.length}`}
                />
            </TableContainer>
            <DeleteAccountModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                deleteItemId={deleteItemId}
                setDataShouldRevalidate={setDataShouldRevalidate}
            />
        </Box>
    )
}

ApprovedAccounts.propTypes = {
    accountType: PropTypes.string.isRequired,
    searchQuery: PropTypes.string
};

export default ApprovedAccounts;
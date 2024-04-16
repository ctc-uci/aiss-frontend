import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Checkbox, useDisclosure } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import DeleteAccountModal from './DeleteAccountModal.jsx';
import PropTypes from 'prop-types';

const ApprovedAccounts = ( {accountType, searchQuery} ) => {
    const [approvedAccounts, setApprovedAccounts] = useState([]);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [deleteItemId, setDeleteItemId] = useState("");

    useEffect(() => {
        const renderTable = async () => {
            if (searchQuery) {
                const { data } = await NPOBackend.get(`/users/approved-accounts`, {
                    params: {keyword: searchQuery}
                });
                setApprovedAccounts(data);
            }
            else {
                const { data } = await NPOBackend.get('/users/approved-accounts');
                setApprovedAccounts(data);
            }
        };
        renderTable();
    }, [searchQuery])

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
                            accountType === account.type ? (
                                <Tr key={i}>
                                    <Td><Checkbox></Checkbox></Td>
                                    <Td>{account.firstName} {account.lastName}</Td>
                                    <Td>{account.email}</Td>
                                    <Td>
                                        <Button onClick={() => { handleDeleteClick(account.id) }} size='sm' variant='outline'><CloseIcon w={3} h={3} color='gray'/></Button>
                                    </Td>
                                </Tr>
                            ) : (
                                <></>
                            )
                        ))
                    }
                    </Tbody>
                </Table>
            </TableContainer>
            <DeleteAccountModal isOpen={isDeleteOpen} onClose={onDeleteClose} deleteItemId={deleteItemId} />
        </Box>
    )
}

ApprovedAccounts.propTypes = {
    accountType: PropTypes.string.isRequired,
    searchQuery: PropTypes.string
};

export default ApprovedAccounts;
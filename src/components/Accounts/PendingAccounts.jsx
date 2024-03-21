import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'
import PropTypes from 'prop-types';

const PendingAccounts = ( {accountType} ) => {
    const [pendingAccounts, setPendingAccounts] = useState([]);

    useEffect(() => {
        const renderTable = async () => {
            const { data } = await NPOBackend.get('/users/pending-accounts');
            setPendingAccounts(data);
        };
        renderTable();
    }, [pendingAccounts])

    const handleApproveUser = async (id) => {
        try {
            await NPOBackend.put(`/users/approve/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async (id) => {
        try {
            await NPOBackend.delete(`/users/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th width="5%"><Checkbox isDisabled /></Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    pendingAccounts.map((account, i) => (
                         accountType === account.type ? (
                                <Tr key={i}>
                                    <Td><Checkbox></Checkbox></Td>
                                    <Td>{account.firstName} {account.lastName}</Td>
                                    <Td>{account.email}</Td>
                                    <Td>
                                        <Button onClick={() => { handleApproveUser(account.id) }} mr={3} colorScheme='blue'>Accept</Button>
                                        <Button onClick={() => { handleDeleteUser(account.id) }}>Decline</Button>
                                    </Td>
                                </Tr>
                            ) : (
                                <></>
                            )
                        )
                    )
                }
                </Tbody>
            </Table>
        </TableContainer>
    )
}

PendingAccounts.propTypes = {
    accountType: PropTypes.string.isRequired,
};

export default PendingAccounts;
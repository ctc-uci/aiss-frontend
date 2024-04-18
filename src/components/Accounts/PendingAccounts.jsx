import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, HStack } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'
import PropTypes from 'prop-types';

const PendingAccounts = ( {accountType, searchQuery} ) => {
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [individualChecked, setIndividualChecked] = useState(new Array(pendingAccounts.length).fill(false));
    const [checkedAccountIds, setCheckedAccountIds] = useState([]);

    useEffect(() => {
        const renderTable = async () => {
            const { data } = await NPOBackend.get('/users/pending-accounts', {
                params : {
                    keyword: searchQuery
                }
            });
            setPendingAccounts(data);
        };
        renderTable();
    }, [pendingAccounts])

    const handleApproveUser = async (ids) => {
        try {
            for (let i = 0; i < ids.length; i++) {
                await NPOBackend.put(`/users/approve/${ids[i]}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async (ids) => {
        try {
            for (let i = 0; i < ids.length; i++) {
                await NPOBackend.delete(`/users/${ids[i]}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateAllCheckedAccountIds = (e) => {
        if (e.target.checked) {
            let allIds = [];
            for (let i = 0; i < pendingAccounts.length; i++) {
                allIds.push(pendingAccounts[i].id)
            }
            setCheckedAccountIds(allIds);
        } else {
            setCheckedAccountIds([]);
        }
    }

    const updateIndividualCheckedAccountIds = (e, id) => {
        let newCheckedAccountIds = [... checkedAccountIds];
        if (e.target.checked) {
            newCheckedAccountIds.push(id);
            setCheckedAccountIds(newCheckedAccountIds);
        } else {
            let index = newCheckedAccountIds.indexOf(id);
            newCheckedAccountIds.splice(index, 1);
            setCheckedAccountIds(newCheckedAccountIds);
        }
        console.log(newCheckedAccountIds);
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th width="5%"><Checkbox onChange={(e) => {setIndividualChecked(new Array(pendingAccounts.length).fill(e.target.checked));
                                                                   updateAllCheckedAccountIds(e)}}/>
                        </Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <HStack>
                            <Th>Action</Th>
                            <Button onClick={() => { handleApproveUser(checkedAccountIds) }} mr={3} colorScheme='blue'>Accept</Button>
                            <Button onClick={() => { handleDeleteUser(checkedAccountIds) }}>Decline</Button>
                        </HStack>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    pendingAccounts.map((account, i) => (
                         accountType === account.type ? (
                                <Tr key={i}>
                                    <Td><Checkbox isChecked={individualChecked[i]} onChange={(e) => {const newIndividualChecked = [...individualChecked];
                                                                                                newIndividualChecked[i] = e.target.checked;
                                                                                                setIndividualChecked(newIndividualChecked);
                                                                                                updateIndividualCheckedAccountIds(e, account.id)}}>
                                        </Checkbox>
                                    </Td>
                                    <Td>{account.firstName} {account.lastName}</Td>
                                    <Td>{account.email}</Td>
                                    <Td>
                                        <Button onClick={() => { handleApproveUser([account.id]) }} mr={3} colorScheme='blue'>Accept</Button>
                                        <Button onClick={() => { handleDeleteUser([account.id]) }}>Decline</Button>
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
    searchQuery: PropTypes.string
};

export default PendingAccounts;
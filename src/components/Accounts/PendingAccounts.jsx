import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'
import PropTypes from 'prop-types';

const PendingAccounts = ( {accountType, setHasPendingAccounts} ) => {
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [individualChecked, setIndividualChecked] = useState(new Array(pendingAccounts.length).fill(false));
    const [checkedAccountIds, setCheckedAccountIds] = useState([]);
    const [accountStatus, setAccountStatus] = useState({});


    useEffect(() => {
        const renderTable = async () => {
            const { data } = await NPOBackend.get('/users/pending-accounts', {params: {accountType: accountType}});
            setPendingAccounts(data);
            console.log("ELNGLKNKJ: " + data);
            setHasPendingAccounts(data.length !== 0);
        };
        renderTable();
    }, [])

    useEffect(() => {
        const newAccountStatus = {}
        for (let i = 0; i < pendingAccounts.length; i++) {
            newAccountStatus[pendingAccounts[i]["id"]] = "pending";
        }
        setAccountStatus(newAccountStatus);
    }, [pendingAccounts])

    const handleApproveUser = async (ids) => {
        try {
            for (let i = 0; i < ids.length; i++) {
                console.log("approved: " + ids[i]);
                await NPOBackend.put(`/users/approve/${ids[i]}`);
            }
            setIndividualChecked(new Array(pendingAccounts.length).fill(false));
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async (ids) => {
        try {
            for (let i = 0; i < ids.length; i++) {
                console.log("deleted: " + ids[i]);
                await NPOBackend.delete(`/users/${ids[i]}`);
            }
            setIndividualChecked(new Array(pendingAccounts.length).fill(false));
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

    useEffect(() => console.log("accountStatus: " + JSON.stringify(accountStatus)), [accountStatus]); 

    const acceptAllClick = () => {
        handleApproveUser(checkedAccountIds);
        const newAccountStatus = {... accountStatus};
        for (let i = 0; i < checkedAccountIds.length; i++) {
            newAccountStatus[checkedAccountIds[i]] = "approved";
        }
        setAccountStatus(newAccountStatus);
    }

    const deleteAllClick = () => {
        handleDeleteUser(checkedAccountIds);
        const newAccountStatus = {... accountStatus};
        for (let i = 0; i < checkedAccountIds.length; i++) {
            newAccountStatus[checkedAccountIds[i]] = "declined";
        }
        setAccountStatus(newAccountStatus);
    }

    return (
        <TableContainer border="1px solid #ededed" borderRadius="10px">
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th width="5%"><Checkbox onChange={(e) => {setIndividualChecked(new Array(pendingAccounts.length).fill(e.target.checked));
                                                                   updateAllCheckedAccountIds(e)}}/>
                        </Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th width="0">Action</Th>
                        <Th>
                            <Button isDisabled={checkedAccountIds.length === 0} onClick={ acceptAllClick } mr={3} colorScheme='blue'>Accept</Button>
                            <Button isDisabled={checkedAccountIds.length === 0} onClick={ deleteAllClick }>Decline</Button>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    pendingAccounts.map((account, i) => (
                        <Tr key={i}>
                            <Td><Checkbox isDisabled={accountStatus[account.id] != "pending"} isChecked={individualChecked[i]} onChange={(e) => {const newIndividualChecked = [...individualChecked];
                                                                                        newIndividualChecked[i] = e.target.checked;
                                                                                        setIndividualChecked(newIndividualChecked);
                                                                                        updateIndividualCheckedAccountIds(e, account.id);}}>
                                </Checkbox>
                            </Td>
                            <Td color={accountStatus[account.id] === "pending" ? "black" : "gray"}>{account.firstName} {account.lastName}</Td>
                            <Td color={accountStatus[account.id] === "pending" ? "black" : "gray"}>{account.email}</Td>
                            <Td></Td>
                            {
                                accountStatus[account.id] === "pending" ? (
                                    <Td>
                                        <Button onClick={() => { handleApproveUser([account.id]);
                                                                        const newAccountStatus = {... accountStatus};
                                                                        newAccountStatus[account.id] = "approved";
                                                                        setAccountStatus(newAccountStatus); }} mr={3} colorScheme='blue'>Accept</Button>
                                        <Button onClick={() => { handleDeleteUser([account.id]);
                                                                const newAccountStatus = {... accountStatus};
                                                                newAccountStatus[account.id] = "declined";
                                                                setAccountStatus(newAccountStatus); }}>Decline</Button>
                                    </Td>
                                ) : accountStatus[account.id] === "approved" ? (
                                    <Td color="green">Approved</Td>
                                ) : (
                                    <Td color="red">Declined</Td>
                                )
                            }
                        </Tr>
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
    setHasPendingAccounts: PropTypes.func.isRequired
};

export default PendingAccounts;
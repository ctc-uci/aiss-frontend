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
            setHasPendingAccounts(data.length !== 0);
        };
        renderTable();
    }, [accountType, setHasPendingAccounts])

    useEffect(() => {
        const newAccountStatus = {}
        for (let i = 0; i < pendingAccounts.length; i++) {
            newAccountStatus[pendingAccounts[i]["id"]] = "pending";
        }
        setAccountStatus(newAccountStatus);
    }, [pendingAccounts])

    const changeStatus = ((accountid, status) => {
        let newAccountStatus = {...accountStatus};
        newAccountStatus[accountid] = status;
        setAccountStatus(newAccountStatus);
    });

    const handleApproveDeclineUser = async (ids, option) => {
        try {
            for (let i = 0; i < ids.length; i++) {
                if (option === "approve-option") {
                    await NPOBackend.put(`/users/approve/${ids[i]}`);
                }
                else if (option === "decline-option") {
                    await NPOBackend.delete(`/users/${ids[i]}`);
                }
            }
            setIndividualChecked(new Array(pendingAccounts.length).fill(false));
        } catch (error) {
            console.log(error);
        }
    }

    const updateAllIndividualChecked = (e) => {
        let newIndividualChecked = [];
        for (let i = 0; i < pendingAccounts.length; i++) {
            if (accountStatus[pendingAccounts[i].id] === "pending") {
                newIndividualChecked.push(e.target.checked);
            }
            else {
                newIndividualChecked.push(false);
            }
        }
        setIndividualChecked(newIndividualChecked);
    }

    const updateAllCheckedAccountIds = (e) => {
        if (e.target.checked) {
            let allIds = [];
            for (let i = 0; i < pendingAccounts.length; i++) {
                if (accountStatus[pendingAccounts[i].id] === "pending") {
                    allIds.push(pendingAccounts[i].id);
                }
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

    const acceptDeclineAllClick = (option) => {
        handleApproveDeclineUser(checkedAccountIds, option);
        const newAccountStatus = {... accountStatus};
        for (let i = 0; i < checkedAccountIds.length; i++) {
            newAccountStatus[checkedAccountIds[i]] = option === "approve-option" ? "approved" : "declined";
        }
        setAccountStatus(newAccountStatus);
        setCheckedAccountIds([]);
    }

    return (
        <TableContainer border="1px solid #ededed" borderRadius="10px">
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th w="5%"><Checkbox onChange={(e) => {updateAllIndividualChecked(e); updateAllCheckedAccountIds(e);}}/></Th>
                        <Th w="40%">Name</Th>
                        <Th w="40%">Email</Th>
                        <Th w="0">Action</Th>
                        <Th w="15%">
                            <Button isDisabled={checkedAccountIds.length === 0} onClick={ () => acceptDeclineAllClick("approve-option") } mr={3} colorScheme='blue'>Accept</Button>
                            <Button isDisabled={checkedAccountIds.length === 0} onClick={ () => acceptDeclineAllClick("decline-option") }>Decline</Button>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    pendingAccounts.map((account, i) => (
                        <Tr key={i}>
                            <Td><Checkbox isDisabled={accountStatus[account.id] != "pending"} isChecked={individualChecked[i]} onChange={(e) => {updateIndividualCheckedAccountIds(e, account.id, i);}}>
                                </Checkbox>
                            </Td>
                            <Td color={accountStatus[account.id] === "pending" ? "black" : "gray"}>{account.firstName} {account.lastName}</Td>
                            <Td color={accountStatus[account.id] === "pending" ? "black" : "gray"}>{account.email}</Td>
                            <Td></Td>
                            {
                                accountStatus[account.id] === "pending" ? (
                                    <Td>
                                        <Button onClick={() => { handleApproveDeclineUser([account.id], "approve-option"); changeStatus(account.id, "approved");}} mr={3} colorScheme='blue'>Accept</Button>
                                        <Button onClick={() => { handleApproveDeclineUser([account.id], "decline-option"); changeStatus(account.id, "declined");}}>Decline</Button>
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
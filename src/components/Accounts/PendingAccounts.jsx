import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Checkbox,
  Text,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const PendingAccounts = ({ accountType, setHasPendingAccounts }) => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [checkedAccountIds, setCheckedAccountIds] = useState([]);
  const [accountStatus, setAccountStatus] = useState({});
  const [timeoutIds, setTimeoutIds] = useState({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/users/pending-accounts', {
        params: { accountType: accountType },
      });
      setPendingAccounts(data);
      setHasPendingAccounts(data.length !== 0);
    };
    renderTable();
  }, [accountType, setHasPendingAccounts]);

  useEffect(() => {
    const newAccountStatus = {};
    for (let i = 0; i < pendingAccounts.length; i++) {
      newAccountStatus[pendingAccounts[i]['id']] = 'pending';
    }
    setAccountStatus(newAccountStatus);
  }, [pendingAccounts]);

  const undoChanges = (ids) => {
    console.log(ids.toString());
    let timeoutKey = ids.toString();
    clearTimeout(timeoutIds[timeoutKey]);
    const newTimeoutIds = {... timeoutIds};
    delete newTimeoutIds[timeoutKey];
    setTimeoutIds(newTimeoutIds);
    const newAccountStatus = { ...accountStatus };
    for (let i = 0; i < ids.length; i++) {
      newAccountStatus[ids[i]] = 'pending';
    }
    setAccountStatus(newAccountStatus);
    if (Object.keys(newTimeoutIds).length === 0) {
      setIsWaiting(false);
    }
    if (ids.length > 1) {
      setIsMultiSelect(false);
    }
    console.log("canceled change!")
  }

  const handleApproveDeclineUser = async (ids, option, status) => {
    const timeoutId = setTimeout(async () => {
      try {
        let newCheckedAccountIds = checkedAccountIds;
        for (let i = 0; i < ids.length; i++) {
          if (option === 'approve-option') {
            await NPOBackend.put(`/users/approve/${ids[i]}`);            
          } else if (option === 'decline-option') {
            await NPOBackend.delete(`/users/${ids[i]}`);
          }
          let index = newCheckedAccountIds.indexOf(ids[i]);
          newCheckedAccountIds.splice(index, 1);
        }
        if (JSON.stringify(newCheckedAccountIds) === JSON.stringify(checkedAccountIds)) {
          setCheckedAccountIds(newCheckedAccountIds);
        }
        // const newAccountStatus = { ...accountStatus };
        // for (let i = 0; i < ids.length; i++) {
        //   newAccountStatus[ids[i]] = option === 'approve-option' ? 'approved' : 'declined';
        // }
        const newAccountStatus = status;
        for (let i = 0; i < ids.length; i++) {
          newAccountStatus[ids[i]] = option === 'approve-option' ? 'approved' : 'declined';
        }
        setAccountStatus(newAccountStatus);
        if (Object.keys(timeoutIds).length === 0) {
          setIsWaiting(false);
        }
        if (ids.length > 1) {
          setIsMultiSelect(false);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);
    setIsWaiting(true);
    // Initiate waiting state
    const waitingAccountStatus = { ...accountStatus };
    for (let i = 0; i < ids.length; i++) {
      waitingAccountStatus[ids[i]] = option === 'approve-option' ? 'waiting-approved' : 'waiting-declined';
    }
    setAccountStatus(waitingAccountStatus);
    const newTimeoutIds = {... timeoutIds};
    newTimeoutIds[ids.toString()] = timeoutId;
    setTimeoutIds(newTimeoutIds);
  };

  const handleMultiSelect = async (ids, option, status) => {
    setIsMultiSelect(true);
    handleApproveDeclineUser(ids, option, status);
  }

  const updateAllCheckedAccountIds = e => {
    if (e.target.checked) {
      let allIds = [];
      for (let i = 0; i < pendingAccounts.length; i++) {
        if (accountStatus[pendingAccounts[i].id] === 'pending') {
          allIds.push(pendingAccounts[i].id);
        }
      }
      setCheckedAccountIds(allIds);
    } else {
      setCheckedAccountIds([]);
    }
  };

  useEffect(() => {
    console.log(checkedAccountIds);
  }, [checkedAccountIds]);

  useEffect(() => {
    console.log(timeoutIds);
  }, [timeoutIds]);

  useEffect(() => {
    console.log(accountStatus);
}, [accountStatus])

  useEffect(() => {
    console.log(`isMultiSelect: ${isMultiSelect}`);
  }, [isMultiSelect])

  useEffect(() => {
    console.log(`isWaiting ${isWaiting}`);
  }, [isWaiting])

  const updateIndividualCheckedAccountIds = (e, id) => {
    let newCheckedAccountIds = [...checkedAccountIds];
    if (e.target.checked) {
      newCheckedAccountIds.push(id);
      setCheckedAccountIds(newCheckedAccountIds);
    } else {
      let index = newCheckedAccountIds.indexOf(id);
      newCheckedAccountIds.splice(index, 1);
      setCheckedAccountIds(newCheckedAccountIds);
    }
  };

  return (
    <TableContainer border="1px solid #ededed" borderRadius="10px">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w="5%" h="50px">
              <Checkbox
                onChange={e => {
                  updateAllCheckedAccountIds(e);
                }}
              />
            </Th>
            <Th w="30%">Name</Th>
            <Th w="30%">Email</Th>
            <Th w="0" textAlign="right">
              Action
            </Th>
            {checkedAccountIds.length > 0 && !isWaiting ? (
              <Th w="20%" textAlign="right">
                <Button
                  onClick={() => handleMultiSelect([...checkedAccountIds], 'approve-option', {...accountStatus})}
                  mr={3}
                  colorScheme="blue"
                  fontSize="sm"
                  h="6"
                  w="16"
                  fontWeight="400"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleMultiSelect([...checkedAccountIds], 'decline-option', {...accountStatus})}
                  fontSize="sm"
                  h="6"
                  w="16"
                  fontWeight="400"
                >
                  Decline
                </Button>
              </Th>
            ) : isMultiSelect ? (
              <Th w="20%" textAlign="right">
                <Button 
                  onClick={() => { undoChanges([...checkedAccountIds]) }}
                  fontSize="sm"
                  h="6"
                  w="16"
                  fontWeight="400"
                >
                  Undo
                </Button>
              </Th>
            // ) : isWaiting ? (
            //   <Th w="20%" textAlign="right"></Th>
            ) : (
              <></>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {pendingAccounts.map((account, i) => (
            <Tr key={i}>
              <Td>
                <Checkbox
                  isDisabled={accountStatus[account.id] != 'pending'}
                  isChecked={checkedAccountIds.includes(account.id)}
                  onChange={e => {
                    updateIndividualCheckedAccountIds(e, account.id);
                  }}
                ></Checkbox>
              </Td>
              <Td color={accountStatus[account.id] === 'pending' ? 'black' : 'gray'}>
                {account.firstName} {account.lastName}
              </Td>
              <Td color={accountStatus[account.id] === 'pending' ? 'black' : 'gray'}>
                {account.email}
              </Td>
              {checkedAccountIds.length > 0 && <Td></Td>}
              {accountStatus[account.id] === 'pending' ? (
                <Td textAlign="right">
                  <Button
                    onClick={() => {
                      handleApproveDeclineUser([account.id], 'approve-option', {...accountStatus});
                    }}
                    mr={3}
                    colorScheme="blue"
                    fontSize="sm"
                    h="6"
                    w="16"
                    fontWeight="400"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      handleApproveDeclineUser([account.id], 'decline-option', {...accountStatus});
                    }}
                    fontSize="sm"
                    h="6"
                    w="16"
                    fontWeight="400"
                  >
                    Decline
                  </Button>
                </Td>
              ) : !isMultiSelect && accountStatus[account.id] === 'waiting-approved' ?(
                <Td>
                  <HStack>
                    <Spacer />
                    <Text color="green">Approved</Text>
                    <Button 
                      onClick={() => { undoChanges([account.id]) }}
                      fontSize="sm"
                      h="6"
                      w="16"
                      fontWeight="400"
                    >
                      Undo
                    </Button>
                  </HStack>
                </Td>
              ) : !isMultiSelect && accountStatus[account.id] === 'waiting-declined' ?(
                <Td>
                  <HStack>
                    <Spacer />
                    <Text color="red">Declined</Text>
                    <Button 
                      onClick={() => { undoChanges([account.id]) }}
                      fontSize="sm"
                      h="6"
                      w="16"
                      fontWeight="400"
                    >
                      Undo
                    </Button>
                  </HStack>
                </Td>
              ) : accountStatus[account.id] === 'approved' ||  accountStatus[account.id] === 'waiting-approved' ? (
                <Td textAlign="right" color="green">
                  Approved
                </Td>
              ) : (
                <Td textAlign="right" color="red">
                  Declined
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

PendingAccounts.propTypes = {
  accountType: PropTypes.string.isRequired,
  setHasPendingAccounts: PropTypes.func.isRequired,
};

export default PendingAccounts;

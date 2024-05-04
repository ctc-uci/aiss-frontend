import { NPOBackend } from '../../utils/auth_utils.js';
import { useEffect, useState, useRef } from 'react';
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
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const statusRef = useRef({});
  const timeoutIdsRef = useRef({}); 

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

  useEffect(() => {
    statusRef.current = accountStatus;
  }, [accountStatus]);

  useEffect(() => {
    timeoutIdsRef.current = timeoutIds;
  }, [timeoutIds]);

  const undoChanges = (ids) => {
    let timeoutKey = ids.toString();
    const {timeoutId, isMulti} = timeoutIds[timeoutKey];
    clearTimeout(timeoutId);
    const newTimeoutIds = {...timeoutIds};
    delete newTimeoutIds[timeoutKey];
    setTimeoutIds(newTimeoutIds);
    const newAccountStatus = {...accountStatus};
    for (let i = 0; i < ids.length; i++) {
      newAccountStatus[ids[i]] = 'pending';
    }
    setAccountStatus(newAccountStatus);
    if (isMulti) {
      setIsMultiSelect(false);
    }
  }

  const handleApproveDeclineUser = async (ids, option, isMulti=false) => {
    const timeoutId = setTimeout(async () => {
      try {
        let newCheckedAccountIds = checkedAccountIds;
        for (let i = 0; i < ids.length; i++) {
          if (option === 'approve-option') {
            await NPOBackend.put(`/users/approve/${ids[i]}`);            
          } else if (option === 'decline-option') {
            await NPOBackend.delete(`/users/${ids[i]}`);
          }
          // removes account that was approved/decline if it is in checked list
          let index = newCheckedAccountIds.indexOf(ids[i]);
          if (index > -1) {
            newCheckedAccountIds.splice(index, 1);
          }
        }
        setCheckedAccountIds(newCheckedAccountIds);
      } catch (error) {
        // error should occur if you try to delete an account that has already been deleted (individual delete then multi-delete)
        console.log(error);
        // clear checked list if there is error for good measure
        setCheckedAccountIds([]);
      }
      const newAccountStatus = statusRef.current;
      for (let i = 0; i < ids.length; i++) {
        newAccountStatus[ids[i]] = option === 'approve-option' ? 'approved' : 'declined';
      }
      setAccountStatus(newAccountStatus);
      const newTimeoutIds = {...timeoutIdsRef.current};
      delete newTimeoutIds[ids.toString()];
      setTimeoutIds(newTimeoutIds);

      if (isMulti) {
        setIsMultiSelect(false);
      }
    }, 5000);
    if(isMulti) {
      setIsMultiSelect(true);
    }
    // Initiate waiting state
    const waitingAccountStatus = { ...accountStatus };
    for (let i = 0; i < ids.length; i++) {
      waitingAccountStatus[ids[i]] = option === 'approve-option' ? 'waiting-approved' : 'waiting-declined';
    }
    setAccountStatus(waitingAccountStatus);
    const newTimeoutIds = {... timeoutIds};
    newTimeoutIds[ids.toString()] = {timeoutId, isMulti};
    setTimeoutIds(newTimeoutIds);
  };

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
            { isMultiSelect ? (
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
            ) : checkedAccountIds.length > 0 && (
                <Th w="20%" textAlign="right">
                  <Button
                    onClick={() => handleApproveDeclineUser([...checkedAccountIds], 'approve-option', true)}
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
                    onClick={() => handleApproveDeclineUser([...checkedAccountIds], 'decline-option', true)}
                    fontSize="sm"
                    h="6"
                    w="16"
                    fontWeight="400"
                  >
                    Decline
                  </Button>
                </Th>
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
                      handleApproveDeclineUser([account.id], 'approve-option');
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
                      handleApproveDeclineUser([account.id], 'decline-option');
                    }}
                    fontSize="sm"
                    h="6"
                    w="16"
                    fontWeight="400"
                  >
                    Decline
                  </Button>
                </Td>
              ) : (
                <Td>
                  <HStack>
                    <Spacer />
                    {accountStatus[account.id] === 'approved' ||  accountStatus[account.id] === 'waiting-approved' ?
                      <Text color="green">Approved</Text>
                    :
                    <Text color="red">Declined</Text>
                    }
                    {account.id in timeoutIds && 
                      <Button 
                        onClick={() => { undoChanges([account.id]) }}
                        fontSize="sm"
                        h="6"
                        w="16"
                        fontWeight="400"
                      >
                        Undo
                      </Button>
                    }
                  </HStack>
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

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { NPOBackend } from '../../utils/auth_utils';

const Notifications = () => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const getPendingUsers = async () => {
      const response = await NPOBackend.get(`/users/pending-accounts`);
      setListData(response.data);
    };
    getPendingUsers().catch(console.error);
  }, []);

  const ApproveAll = async () => {
    try {
      listData.map(async user => {
        await NPOBackend.put(`/users/approve/${user.id}`);
      });

      location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  const DeclineAll = async () => {
    try {
      listData.map(async user => {
        await NPOBackend.delete(`/users/${user.id}`);
      });

      location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  const Approve = async (id) => {
    try {
      await NPOBackend.put(`/users/approve/${id}`);
      location.reload();
    } catch (e) {
      console.log(e);
    }

  }

  const Decline = async (id) => {
    try {
      await NPOBackend.delete(`/users/${id}`);
      location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  return (
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th><Link onClick={async () => { await ApproveAll() }}>Approve All</Link></Th>
              <Th><Link onClick={async () => { await DeclineAll() }}>Decline All</Link></Th>
            </Tr>
          </Thead>
          <Tbody>

            {listData.map(({ id, email }) => (
              <Tr key={id}>
                <Td>{id}</Td>
                <Td>{email}</Td>
                <Td><Link onClick={ async () => { await Approve(id)} }>Accept</Link></Td>
                <Td><Link onClick={ async () => { await Decline(id)} }>Decline</Link></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
  );
};

export default Notifications;

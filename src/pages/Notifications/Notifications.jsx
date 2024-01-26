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

  // const Approve = async (id) => {
  //   const response = await NPOBackend.put(`/users/approve/${id}`);
  // }
  // Approve().catch(console.error);

  // const Decline = async (id) => {
  //   const response = await NPOBackend.delete(`/users/${id}`);
  // }
  // Decline().catch(console.error);

  return (
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Accept</Th>
              <Th>Decline</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listData.map(({ id, email }) => (
              <Tr key={id}>
                <Td>{id}</Td>
                <Td>{email}</Td>
                <Td><Link onClick={() => {console.log("accept")}}>Accept</Link></Td>
                <Td><Link onClick={() => {console.log("decline")}}>Decline</Link></Td>
                {/* <Td><Link onClick={ () => Approve(id) }>Accept</Link></Td> */}
                {/* <Td><Link onClick={ () => Decline(id) }>Decline</Link></Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
  );
};

export default Notifications;

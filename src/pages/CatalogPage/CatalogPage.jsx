import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, TableCaption, } from '@chakra-ui/react';
import { useState, useEffect, } from 'react';

export default function CatalogPage() {
    // Create data state
    const [tableData, setTableData] = useState([])

    // Fetch Table Data: .../catalog
    useEffect(() => { 
        // console.log(process.env.VITE_BACKEND_HOST + "/catalog")
        fetch('http://localhost:3001/catalog')
        .then(response => response.json())
        .then(data => setTableData(data))
    }, [])

    // Render table data
  return (
    <>
        {tableData.map(({id, host, title}) => {
            console.log(id, host, title)

            return <li key={id}>{id} {host} {title}</li>
        })}
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
}

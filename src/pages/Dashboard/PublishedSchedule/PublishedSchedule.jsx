import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    // Td,
    // TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

const PublishedSchedule = () => {
    // get data from database
    //update chakra table container accordingly
    return (
    <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Host</Th>
              <Th isNumeric>Cohort Year</Th>
              <Th>Confirmed?</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* <Tr>
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
            </Tr> */}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Title</Th>
              <Th>Host</Th>
              <Th isNumeric>Cohort Year</Th>
              <Th>Confirmed?</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      )
}

export default PublishedSchedule
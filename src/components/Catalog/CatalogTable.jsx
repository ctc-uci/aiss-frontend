import { Container, Badge, IconButton, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react';
import { /*EditIcon,*/ DeleteIcon } from '@chakra-ui/icons';  // add 'EditIcon' to reinstate edit button.
import s from './Catalog.module.css';
import PropTypes from 'prop-types';

const CatalogTable = ({ tableData, /*handleEditForm,*/ handleDeleteClick }) => {
  return (
    <Table variant="simple" className={s['catalog-table']} borderWidth="0" width="100%" px="1rem">
      <Thead>
        <Tr>
          <Th textAlign="left">Event</Th>
          <Th textAlign="left">Host</Th>
          <Th textAlign="left">Tags</Th>
          <Th width="8rem"></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableData.map(({ id, host, title, eventType, subject, year, season/*, description*/ }) => (
          <Tr key={id}>
            <Td textAlign="left" py="1.5rem">
              {title}
            </Td>
            <Td textAlign="left" py="1.5rem">
              {host}
            </Td>
            <Td textAlign="left" py="1.5rem">
              <Container p="0" m="0" maxW="16rem" display="flex" flexWrap="wrap" gap="0.375rem">
                {season && (
                  <Badge
                    backgroundColor="#CEECC3"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {season}
                  </Badge>
                )}
                {year && (
                  <Badge
                    backgroundColor="#FFE1BE"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {year}
                  </Badge>
                )}
                {subject && (
                  <Badge
                    backgroundColor="#E8D7FF"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {subject}
                  </Badge>
                )}
                {eventType && (
                  <Badge
                    backgroundColor="#CFDCFF"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {eventType}
                  </Badge>
                )}
              </Container>
            </Td>
            <Td>
              {/* <IconButton
                color="gray.400"
                backgroundColor="transparent"
                p="0.5rem"
                h="fit-content"
                w="fit-content"
                icon={<EditIcon />}
                onClick={() =>
                  handleEditForm({
                    id,
                    title,
                    host,
                    year,
                    eventType,
                    subject,
                    description,
                  })
                }
              /> */}
              <IconButton
                color="gray.400"
                backgroundColor="transparent"
                p="0.5rem"
                h="fit-content"
                w="fit-content"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteClick(id)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

CatalogTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.any),
  // handleEditForm: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
};

export default CatalogTable;

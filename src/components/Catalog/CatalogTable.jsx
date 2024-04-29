import { Container, Badge, IconButton, Table, Thead, Tr, Th, Td, Tbody, Text } from '@chakra-ui/react';
import { /*EditIcon,*/ DeleteIcon } from '@chakra-ui/icons';  // add 'EditIcon' to reinstate edit button.
import { IoIosAddCircleOutline } from "react-icons/io";
import s from './Catalog.module.css';
import PropTypes from 'prop-types';

const CatalogTable = ({ tableData, handleActionClick, onDayPlanner, setCurrEvent }) => {
  const setDataAndOpenPSForm = (eventData) => {
    setCurrEvent(eventData);
    handleActionClick();
  }

  return (
    <Table
      variant="simple"
      className={s['catalog-table']}
      borderWidth="0"
      width="100%"
      px="1rem"
    >
      <Thead style={onDayPlanner ? { position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 } : {}}>
        <Tr>
          <Th textAlign="left">Event</Th>
          <Th textAlign="left">Host</Th>
          <Th textAlign="left">Tags</Th>
          <Th width="8rem"></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableData.map(({ id, host, title, eventType, subject, year, season, description}) => (
          <Tr key={id}>
            <Td textAlign="left" py="1.5rem" color="#2D3748">
              <Text mb="0.5rem" fontWeight="700">{title}</Text>
              <Text maxW="20vw" whiteSpace="pre-wrap">{description}</Text>
            </Td>
            <Td textAlign="left" py="1.5rem">
              {host}
            </Td>
            <Td textAlign="left" py="1.5rem">
              <Container p="0" m="0" maxW="16rem" display="flex" flexWrap="wrap" gap="0.375rem">
                {season[0] !== '' && season.map((seasonItem, index) => (
                  <Badge
                    key={index}
                    backgroundColor="#CEECC3"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {seasonItem}
                  </Badge>
                ))}
                {year[0] !== '' && year.map((yearItem, index) => (
                  <Badge
                    key={index}
                    backgroundColor="#FFE1BE"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {yearItem}
                  </Badge>
                ))}
                {subject[0] !== '' && subject.map((subjectItem, index) => (
                  <Badge
                    key={index}
                    backgroundColor="#E8D7FF"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {subjectItem}
                  </Badge>
                ))}
                {eventType[0] !== '' && eventType.map((eventTypeItem, index) => (
                  <Badge
                    key={index}
                    backgroundColor="#CFDCFF"
                    color="gray.900"
                    textTransform="capitalize"
                    borderRadius="10rem"
                    fontWeight="normal"
                    px="0.5rem"
                    mr="0.125rem"
                  >
                    {eventTypeItem}
                  </Badge>
                ))}
              </Container>
            </Td>
            { !onDayPlanner ?
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
                  onClick={() => handleActionClick(id)}
                />
              </Td>
            :
              <Td>
                <IconButton
                  fontSize='24px'
                  color="gray.500"
                  backgroundColor="transparent"
                  p="0.5rem"
                  h="fit-content"
                  w="fit-content"
                  icon={<IoIosAddCircleOutline />}
                  onClick={() => setDataAndOpenPSForm({
                    id,
                    title,
                    host,
                    year,
                    eventType,
                    subject,
                    description,
                    season
                  })}
                />
              </Td>
            }
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

CatalogTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.any),
  handleActionClick: PropTypes.func.isRequired,
  onDayPlanner: PropTypes.bool,
  setCurrEvent: PropTypes.func,
};

CatalogTable.defaultProps = {
  onDayPlanner: false
};

export default CatalogTable;

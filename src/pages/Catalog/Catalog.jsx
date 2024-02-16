import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import DeleteEventModal from '../../components/DeleteEventModal/DeleteEventModal';
import CreateEventFormModal from '../../components/CreateEventForm/CreateEventFormModal';

export default function Catalog() {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditFormOpen, onOpen: onEditFormOpen, onClose: onEditFormClose } = useDisclosure();
  const { isOpen: isCreateFormOpen, onOpen: onCreateFormOpen, onClose: onCreateFormClose } = useDisclosure();

  const [tableData, setTableData] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(-1);
  const [editData, setEditData] = useState({});
  const [isModified, setModified] = useState(false);

  useEffect(() => {
    const fetchCatalogData = async () => {
      const response = await NPOBackend.get('/catalog');
      setTableData(response.data.events);
    };

    fetchCatalogData().catch(console.error);
    setModified(false);
  }, [isModified]);

  const handleRowHover = index => {
    setHoveredRow(index);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };

  const handleEditForm = data => {
    setEditData(data);
    onEditFormOpen();
  };

  const handleDeleteClick = id => {
    setDeleteItemId(id);
    onDeleteOpen();
  };

  return (
    <div>
      <Button onClick={onCreateFormOpen}>Create</Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Host</Th>
              <Th>Cohort Type</Th>
              <Th>Event Type</Th>
              <Th>Subject</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map(({ id, host, title, eventType, subject, description, year }, index) => (
              <Tr key={id} onMouseEnter={() => handleRowHover(index)} onMouseLeave={handleRowLeave}>
                <Td>{title}</Td>
                <Td>{host}</Td>
                <Td>{year}</Td>
                <Td>{eventType}</Td>
                <Td>{subject}</Td>
                <Td>{description}</Td>
                <Td>
                  {hoveredRow === index && (
                    <>
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => handleEditForm({id, title, host, year, eventType, subject, description})}
                      />
                      <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteClick(id)} />
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <CreateEventFormModal isOpen={isCreateFormOpen} onClose={onCreateFormClose} setModified={setModified} />
      <CreateEventFormModal isOpen={isEditFormOpen} onClose={onEditFormClose} eventData={editData} setModified={setModified} />
      <DeleteEventModal isOpen={isDeleteOpen} onClose={onDeleteClose} deleteItemId={deleteItemId} setModified={setModified} />
    </div>
  );
}

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
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import CreateEventForm from '../../components/CreateEventForm/CreateEventForm';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function Catalog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tableData, setTableData] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    const fetchCatalogData = async () => {
      const response = await NPOBackend.get('/catalog');
      setTableData(response.data);
      console.log(editData);
    };

    fetchCatalogData().catch(console.error);
  }, []);

  const openCreateForm = () => {
    setIsCreateFormOpen(!isCreateFormOpen);
  };

  const handleRowHover = index => {
    setHoveredRow(index);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };

  const handleEditForm = data => {
    console.log('Handling edit form');
    setEditData(data);
    console.log(editData);
    setIsEditFormOpen(!isEditFormOpen);
    console.log(isEditFormOpen);
    // populate form with data from setEditData (pass into CreateEventForm component as an event prop?)
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(!isEditFormOpen);
    console.log(isEditFormOpen);
  };

  const handleDeleteClick = id => {
    setDeleteItemId(id);
    onOpen();
  };

  const handleConfirmDelete = async idToDelete => {
    try {
      await NPOBackend.delete(`/catalog/${idToDelete}`);

      const response = await NPOBackend.get('/catalog');
      setTableData(response.data);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={openCreateForm}>Create</Button>
      {/* {isCreateFormOpen && <CreateEventForm />} */}
      <Modal id="createFrom" isOpen={isCreateFormOpen} onClose={openCreateForm}>
        <ModalContent>
          <ModalBody>
            <CreateEventForm />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal id="editForm" isOpen={isEditFormOpen} onClose={handleCloseEditForm}>
        <ModalContent>
          <ModalBody>
            <CreateEventForm event={editData} />
          </ModalBody>
        </ModalContent>
      </Modal>
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
                        icon={
                          <EditIcon
                            onClick={() => {
                              console.log('clicking on edit icon');
                              handleEditForm([
                                id,
                                title,
                                host,
                                year,
                                eventType,
                                subject,
                                description,
                              ]);
                            }}
                          />
                        }
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this row?</ModalBody>
          <ModalFooter>
            <ModalFooter>
              <Button onClick={() => handleConfirmDelete(deleteItemId)}>Delete</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

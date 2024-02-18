import React from 'react';
import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import Notifications from '../../components/Notifications/Notifications';
import { BellIcon } from '@chakra-ui/icons';

const NotificationSandbox = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = React.useRef();

  return (
    <div>
      <h1>Notification Sandbox</h1>
      {/* TODO: Move Notification button and drawer to navbar once layout component is pushed */}
      <>
        <Button ref={buttonRef} colorScheme="teal" onClick={onOpen}>
          <BellIcon />
        </Button>
        <Drawer
          size="lg"
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={buttonRef}
        >
          <DrawerOverlay />
          <DrawerContent borderLeftRadius="2rem">
            <Container m="0" maxW="none" display="flex" alignItems="center" borderBottomColor="gray.300" borderBottomWidth="1px" pl="6">
              <DrawerCloseButton fontSize="0.5rem" p="0" w="6" h="6" borderRadius="100rem" borderColor="black" borderWidth="1px" position="relative" top="0" left="0" />
              <DrawerHeader fontSize="2xl">Notifications</DrawerHeader>
            </Container>
            <DrawerBody padding="0">
              <Notifications />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </div>
  );
};

export default NotificationSandbox;

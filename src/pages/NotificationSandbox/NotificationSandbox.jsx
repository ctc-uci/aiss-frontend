import React from 'react';
import {
  Button,
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
        <Drawer size="lg" isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={buttonRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Notifications</DrawerHeader>
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

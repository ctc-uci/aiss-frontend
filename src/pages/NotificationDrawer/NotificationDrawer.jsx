import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Notifications from '../../components/Notifications/Notifications';

const NotificationsDrawer = ({isOpen, onClose}) => {
  const buttonRef = React.useRef();

  return (
    <Drawer
      size="lg"
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={buttonRef}
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="2rem">
        <Container
          m="0"
          maxW="none"
          display="flex"
          alignItems="center"
          borderBottomColor="gray.300"
          borderBottomWidth="1px"
          pl="6"
        >
          <DrawerCloseButton
            fontSize="0.5rem"
            p="0"
            w="6"
            h="6"
            borderRadius="100rem"
            borderColor="black"
            borderWidth="1px"
            position="relative"
            top="0"
            left="0"
          />
          <DrawerHeader fontSize="2xl">Notifications</DrawerHeader>
        </Container>
        <DrawerBody padding="0">
          <Notifications />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

NotificationsDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default NotificationsDrawer;

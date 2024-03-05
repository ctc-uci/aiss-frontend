import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, HStack, Link, Text, Image, IconButton,
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import Logout from '../Authentication/Logout';
import Notifications from '../Notifications/Notifications';

const Navbar = ({ hasLoaded, isAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = React.useRef();
  // console.log(hasLoaded, isAdmin);

  const makeNavTabs = (page, path) => {
    const selectedTab = location.pathname == path;
    return (
      <Link
        as={NavLink}
        to={path}
        _hover={{ textDecoration: 'none' }}
        paddingY="1.4em"
        borderBottom={selectedTab && '2px solid'}
        borderColor={selectedTab && 'white'}
        marginRight={'30px'}
      >
        <Text
          style={{ fontWeight: selectedTab ? 'bold' : 'normal' }}
          color="white"
          fontSize="16px"
          mx="1em"
          _hover={{ color: 'blue.600' }}
        >
          {page}
        </Text>
      </Link>
    );
  };

  if (!hasLoaded) {
    return null;
  }

  if (isAdmin) {
    return (
      <Flex
        style={{ backgroundColor: '#243268', padding: '0 100px 0 100px' }}
        justify={'space-between'}
        width={'100%'}
        align="center"
        position={'sticky'}
        as={'nav'}
      >
        <HStack>
          <Flex align={'center'}>
            <Image src="../../../aiss-logo.png" marginRight={'48px'}></Image>
            {makeNavTabs('Schedule', '/publishedSchedule')}
            {makeNavTabs('Catalog', '/catalog')}
          </Flex>
        </HStack>
        <Flex alignSelf={'right'} align={'center'} marginLeft={'auto'}>
          <IconButton onClick={onOpen} bgColor={'transparent'} marginRight={'48px'} icon={
            <BellIcon
              color="white"
              alignSelf={'right'}
              width={'24px'}
              height={'24px'}
            />
          }>
          </IconButton>
          <Logout />
        </Flex>
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
      </Flex>
    )
  }
  return ( // might be able to remove this
    <Flex
      style={{ backgroundColor: '#243268', padding: '0 100px 0 100px' }}
      justify={'space-between'}
      width={'100%'}
      align="center"
      position={'sticky'}
      as={'nav'}
    >
      <HStack>
        <Flex align={'center'}>
          <Image src="../../../aiss-logo.png" marginRight={'48px'}></Image>
          {makeNavTabs('Schedule', '/publishedSchedule')}
        </Flex>
      </HStack>
      <Flex alignSelf={'right'} align={'center'} marginLeft={'auto'}>
        <IconButton onClick={onOpen} bgColor={'transparent'} marginRight={'48px'} icon={
          <BellIcon
            color="white"
            alignSelf={'right'}
            width={'24px'}
            height={'24px'}
          />
        }>
        </IconButton>
        <Logout />
      </Flex>
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
    </Flex>
  );
};

Navbar.propTypes = {
  hasLoaded: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

Navbar.defaultProps = {
  hasLoaded: false,
  isAdmin: false,
};

export default Navbar;

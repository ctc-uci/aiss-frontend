import { NavLink } from 'react-router-dom';
import { Flex, Link, Text, Image, useDisclosure, IconButton, Spacer } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

import Logout from '../Authentication/Logout';
import NotificationsDrawer from '../../pages/NotificationDrawer/NotificationDrawer';

const Navbar = ({ hasLoaded, isAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        width={'100%'}
        align="center"
        position={'sticky'}
        as={'nav'}
      >
        <Image src="/Logo.svg" marginRight={'48px'}></Image>
        {makeNavTabs('Schedule', '/publishedSchedule')}
        {makeNavTabs('Catalog', '/catalog')}
        {makeNavTabs('Accounts', '/accounts')}

        <Spacer />
        <IconButton onClick={onOpen} colorScheme="none" color="white" icon={<BellIcon/>} mr={5}/>
        <Logout alignSelf={'right'} />

        <NotificationsDrawer isOpen={isOpen} onClose={onClose} />
      </Flex>
    )
  }
  return (
    <Flex
      style={{ backgroundColor: '#243268', padding: '0 100px 0 100px' }}
      width={'100%'}
      align="center"
      position={'sticky'}
      as={'nav'}
    >
      <Image src="/Logo.svg" marginRight={'48px'}></Image>
      {makeNavTabs('Schedule', '/publishedSchedule')}

      <Spacer />
      <Logout alignSelf={'right'} />
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

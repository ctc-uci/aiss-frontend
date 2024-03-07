import { NavLink } from 'react-router-dom';
import { Flex, HStack, Link, Text, Image } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

import Logout from '../Authentication/Logout';

const Navbar = ({ hasLoaded, isAdmin }) => {
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
            {makeNavTabs('Accounts', '/accounts')}
          </Flex>
        </HStack>
        <Flex alignSelf={'right'} marginLeft={'auto'}>
          <BellIcon
            color="white"
            alignSelf={'right'}
            width={'24px'}
            height={'24px'}
            marginRight={'48px'}
          />
          <Logout alignSelf={'right'} />
        </Flex>
      </Flex>
    )
  }
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
        </Flex>
      </HStack>
      <Flex alignSelf={'right'} marginLeft={'auto'}>
        <Logout alignSelf={'right'} />
      </Flex>

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

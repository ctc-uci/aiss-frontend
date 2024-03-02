import { NavLink } from 'react-router-dom';
import { Flex, HStack, Link, Text, Image } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import Logout from '../Authentication/Logout';

const Navbar = () => {
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
  );
};

export default Navbar;

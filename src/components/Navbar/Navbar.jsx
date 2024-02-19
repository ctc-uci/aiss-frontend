import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { Cookies, withCookies, cookieKeys } from '../../utils/cookie_utils';
import { Flex, HStack, Link, Text, Image } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import Logout from '../Authentication/Logout';
import { refreshToken, getCurrentUser } from '../../utils/auth_utils';
import AUTH_ROLES from '../../utils/auth_config';
const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const Navbar = () => {
  //   const [user, setUser] = useState({});
  const [role, setRole] = useState('');
  //   useEffect(() => {
  //     const checkRole = () => {
  //       const currentUserRole = cookies.get(cookieKeys.ROLE);
  //       setRole(currentUserRole);
  //     };
  //     // const fetchUserFromDB = async () => {
  //     //   const { uid } = await getCurrentUser(auth);
  //     // //   const userFromDB = await getUserFromDB(uid);
  //     // //   setUser(userFromDB);
  //     // };
  //     refreshToken();
  //     // fetchUserFromDB();
  //     checkRole();
  //   }, []);
  //   const checkRole = () => {
  //     const currentUserRole = cookies.get(cookieKeys.ROLE);
  //     setRole(currentUserRole);
  //   };
  //   checkRole();

  //   console.log(cookies);
  useEffect(() => {
    const fetchUser = async () => {
      setRole(getCurrentUser());
    };
    refreshToken();
    fetchUser();
  }, []);

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
  console.log(role);
  return role === ADMIN_ROLE || role === USER_ROLE ? (
    <Flex
      style={{ backgroundColor: '#243268', padding: '0 100px 0 100px' }}
      justify={'space-between'}
      width={'100%'}
      align="center"
      position={'sticky'}
      as={'nav'}
    >
      {/* <Link>Schedule</Link>
      <Link>Catalog</Link>
      <Link>Log out</Link>
      <BellIcon /> */}
      <HStack>
        <Flex align={'center'}>
          <Image src="../../../aiss-logo.png" marginRight={'48px'}></Image>
          {makeNavTabs('Schedule', '/publishedSchedule')}
          {makeNavTabs('Catalog', '/catalog')}
          {/* <Spacer /> */}
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
  ) : null;
};

// export default withCookies(Navbar);
export default Navbar;

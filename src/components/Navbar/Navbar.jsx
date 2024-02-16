import { NavLink } from 'react-router-dom';
// import { Cookies, withCookies } from '../../utils/cookie_utils';
import { Flex, HStack, Link, Text } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import Logout from '../Authentication/Logout';

const Navbar = () => {
  //   const [user, setUser] = useState({});
  //   const [role, setRole] = useState('');
  //   useEffect(() => {
  //     const checkRole = () => {
  //       const currentUserRole = cookies.get(cookieKeys.ROLE);
  //       setRole(currentUserRole);
  //     };
  //     const fetchUserFromDB = async () => {
  //       const { uid } = await getCurrentUser(auth);
  //       const userFromDB = await getUserFromDB(uid);
  //       setUser(userFromDB);
  //     };
  //     refreshToken();
  //     fetchUserFromDB();
  //     checkRole();
  //   }, []);
  //   console.log(cookies);
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
    <Flex style={{ backgroundColor: '#243268' }}>
      {/* <Link>Schedule</Link>
      <Link>Catalog</Link>
      <Link>Log out</Link>
      <BellIcon /> */}
      <HStack>
        <Flex align={'center'} justify={'space-between'}>
          <Flex align="center">
            {makeNavTabs('Schedule', '/publishedSchedule')}
            {makeNavTabs('Catalog', '/catalog')}
          </Flex>
          <Flex align={'center'}>
            <BellIcon color="white" />
            {/* <Link color="white" onClick={Logout}>
              <Text>Log out</Text>
            </Link> */}
            <Logout />
          </Flex>
        </Flex>
      </HStack>
    </Flex>
  );
};

// export default withCookies(Navbar);
export default Navbar;

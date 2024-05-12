import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { Box, HStack, IconButton, Input, InputGroup, InputLeftElement, Select, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import AddDayModal from './AddDayModal.jsx';
import StatModal from './StatisticsModal.jsx';
import { IoStatsChart } from 'react-icons/io5';
const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const PublishedSchedule = () => {
  // get data from database
  const {currentUser} = useAuthContext();
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [seasonHover, setSeasonHover] = useState(false);
  const [dataShouldRevalidate, setShouldDataRevalidate] = useState(false);

  const [allEvents, setAllEvents] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [searchedDate, setSearchedDate] = useState('');

  const { isOpen: isOpenDay, onOpen: onOpenDay, onClose: onCloseDay } = useDisclosure();
  const { isOpen: isOpenStats, onOpen: onOpenStats, onClose: onCloseStats } = useDisclosure();

  const getTodaySeason = () => {
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let season;

    if (month >= 1 && month <= 5) {
      season = 'Spring';
    } else if (month >= 9 && month <= 12) {
      season = 'Fall';
    } else if (month >= 6 && month <= 8) {
      season = 'Summer';
    }
    return season + ' ' + year.toString();
  };

  const curSeason = getTodaySeason();

  const renderSeasons = async () => {
    const { data } = await NPOBackend.get('/published-schedule/all-seasons');
    if (data.indexOf(curSeason) == -1) {
      data.unshift(curSeason);
    }

    const seasonOrder = ['Fall', 'Summer', 'Spring'];
    data.sort((a, b) => {
      // Compare years first
      if (a.split(' ')[1] !== b.split(' ')[1]) {
        return b.split(' ')[1] - a.split(' ')[1];
      } else {
        return seasonOrder.indexOf(a.split(' ')[0]) - seasonOrder.indexOf(b.split(' ')[0]);
      }
    });

    setAllSeasons(data);
  };

  const renderTable = async () => {
    if (selectedSeason.length) {
      const [seasonType, seasonYear] = selectedSeason.split(' ');
      const { data } = await NPOBackend.get(
        `/published-schedule/season?season=${seasonType}&year=${seasonYear}`,
      );
      setAllEvents(data);
      if (!searchedDate.length) {
        setEventData(data);
      }
    }
  };

  useEffect(() => {
    renderTable();
  }, [selectedSeason]);

  useEffect(() => {
    if (selectedSeason === '') {
      setSelectedSeason(curSeason);
    }
    renderSeasons();
    renderTable();
  }, []);

  useEffect(() => {
    if (dataShouldRevalidate) {
      renderSeasons();
      renderTable();
      setShouldDataRevalidate(false);
    }
  }, [dataShouldRevalidate, renderSeasons, renderTable]);

  useEffect(() => {
    if (searchedDate) {
      const searchedData = allEvents.filter(item => item.day.eventDate === searchedDate);
      setEventData(searchedData);
    } else {
      setEventData(allEvents);
    }
  }, [searchedDate])

  //update chakra table container accordingly
  return (
    <Box pt={10} pb={10} pl={100} pr={100}>
      {currentUser.type === ADMIN_ROLE &&
        <>
          <IconButton
            bgColor="grey.700"
            color="blue.700"
            borderRadius="10rem"
            position="fixed"
            bottom="6rem"
            right={{ base: '1rem', lg: '2rem', xl: '3rem' }}
            fontSize="1.25rem"
            w="3.25rem"
            h="3.25rem"
            _hover={{ bgColor: 'blue.500' }}
            onClick={onOpenStats}
            icon={<IoStatsChart />}
          >
            Stats
          </IconButton>

          <IconButton
            bgColor="blue.700"
            color="gray.50"
            borderRadius="10rem"
            position="fixed"
            bottom="2rem"
            right={{ base: '1rem', lg: '2rem', xl: '3rem' }}
            fontSize="0.75rem"
            w="3.25rem"
            h="3.25rem"
            _hover={{ bgColor: 'blue.500' }}
            onClick={onOpenDay}
            icon={<AddIcon />}
          >
            Create
          </IconButton>
        </>
      }


      <AddDayModal isOpenDay={isOpenDay} onCloseDay={onCloseDay} setShouldDataRevalidate={setShouldDataRevalidate}/>
      { selectedSeason && allSeasons &&
        <StatModal isOpen={isOpenStats} onClose={onCloseStats} season={selectedSeason} allSeasons={allSeasons}/>
      }

      <HStack mb="2rem">
        <Box>
          <Text fontSize="30px" fontWeight="bold" style={{ textDecoration: seasonHover ? 'underline': 'none' }}>
            {selectedSeason}
          </Text>
          <Select
            mt="-30px"
            variant="unstyled"
            placeholder={allSeasons.indexOf(curSeason) === -1 && curSeason}
            value={selectedSeason}
            textColor="transparent"
            onChange={(e) => setSelectedSeason(e.target.value)}
            width={`${selectedSeason.length*22}px`}
            onMouseEnter={() => setSeasonHover(true)}
            onMouseLeave={() => setSeasonHover(false)}
            visibility={currentUser.type === USER_ROLE ? 'hidden' : 'visible'}
          >
            { currentUser.type === ADMIN_ROLE &&
              allSeasons.map(item => (
                <option key={item} value={item} className={navigator.userAgent.includes('Windows') ? 'Windows-PSOption' : 'Unix-PSOption'}>
                  {item}
                </option>
              ))
            }
          </Select>
        </Box>

        <Spacer />

        <InputGroup size="sm" maxW="sm" mr="2rem" w="15vw">
          <InputLeftElement>
            {searchedDate.length ?
              <IconButton
                background="transparent"
                size="sm"
                icon={<CloseIcon/>}
                onClick={() => setSearchedDate('')}
              /> :
              <SearchIcon
                position="absolute"
                left="1rem"
                top="50%"
                transform="translateY(-50%)"
                color="gray.600"
                zIndex="10"
              />
            }
          </InputLeftElement>
          <Input
            bgColor="blackAlpha.200"
            borderRadius="6px"
            pl="2.5rem"
            type="date"
            value={searchedDate}
            onChange={e => setSearchedDate(e.target.value)}
          />
        </InputGroup>
      </HStack>

      <PublishedScheduleTable eventData={eventData} setShouldDataRevalidate={setShouldDataRevalidate} />
    </Box>
  );
};

export default PublishedSchedule;

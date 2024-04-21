import { NPOBackend } from '../../utils/auth_utils.js';
import Events from './Events.jsx';
import EventInfo from './EventInfo.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, IconButton, useDisclosure } from '@chakra-ui/react';
import AddDayModal from '../../pages/PublishedSchedule/AddDayModal.jsx'
import StatModal from '../../pages/PublishedSchedule/StatisticsModal.jsx';
import { AddIcon } from '@chakra-ui/icons';
import { IoStatsChart } from "react-icons/io5";
import { useAuthContext } from '../../common/AuthContext.jsx';
import AUTH_ROLES from '../../utils/auth_config.js';
const { ADMIN_ROLE } = AUTH_ROLES.AUTH_ROLES;


const PublishedScheduleTable = ({ season, allSeasons }) => {
  const {currentUser} = useAuthContext();
  const [eventsInDay, setEventsInDay] = useState([]);
  const seasonType = season.split(' ')[0];
  const seasonYear = season.split(' ')[1];
  const [dataShouldRevalidate, setShouldDataRevalidate] = useState(false);
  const { isOpen: isOpenDay, onOpen: onOpenDay, onClose: onCloseDay } = useDisclosure();
  const { isOpen: isOpenStats, onOpen: onOpenStats, onClose: onCloseStats } = useDisclosure();

  const renderTable = async () => {
    const { data } = await NPOBackend.get(
      `/published-schedule/season?season=${seasonType}&year=${seasonYear}`,
    );
    setEventsInDay(data);
  };

  useEffect(() => {
    renderTable();
  }, [seasonType, seasonYear]);

  useEffect(() => {
    if (dataShouldRevalidate) {
      renderTable();
      setShouldDataRevalidate(false);
    }
  }, [dataShouldRevalidate])

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatDate = date => {
    let time = date.split(':');
    let hours = time[0];
    let mins = time[1];
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins} ${ampm}`;
  };

  const getUTCDate = (eventDate) => {
    const utcDate = new Date(eventDate);
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  }

  return (
    <Box>
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
          w="3rem"
          h="3rem"
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
          w="3rem"
          h="3rem"
          _hover={{ bgColor: 'blue.500' }}
          onClick={onOpenDay}
          icon={<AddIcon />}
        >
          Create
        </IconButton>
      </>
      }

      <AddDayModal isOpenDay={isOpenDay} onCloseDay={onCloseDay} setShouldDataRevalidate={setShouldDataRevalidate}/>

      <StatModal isOpen={isOpenStats} onClose={onCloseStats} season={season} allSeasons={allSeasons}/>

      <TableContainer borderWidth={1} borderRadius="10px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Info</Th>
              <Th>Event Schedule</Th>
            </Tr>
          </Thead>
          <Tbody>
            {eventsInDay.map(item => (
              <Tr key={item.day.id} verticalAlign={'top'}>
                <Td pr={0}>
                  <EventInfo
                    dayId={item.day.id}
                    eventDate={getUTCDate(item.day.eventDate).toLocaleDateString('en-US')}
                    day={dayNames[getUTCDate(item.day.eventDate).getDay()]}
                    startTime={formatDate(item.day.startTime)}
                    endTime={formatDate(item.day.endTime)}
                    location={item.day.location}
                    notes={item.day.notes}
                    setShouldDataRevalidate={setShouldDataRevalidate}
                  />
                </Td>
                <Td style={{ textAlign: 'left' }} width="75%">
                  <Events eventData={item.data} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

PublishedScheduleTable.propTypes = {
  season: PropTypes.string.isRequired,
  allSeasons: PropTypes.array.isRequired,
};

export default PublishedScheduleTable;

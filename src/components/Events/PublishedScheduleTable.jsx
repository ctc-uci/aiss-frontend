import { NPOBackend } from '../../utils/auth_utils.js';
import Events from './Events.jsx';
import EventInfo from './EventInfo.jsx';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box } from '@chakra-ui/react';

const PublishedScheduleTable = ({ season }) => {
  const [eventsInDay, setEventsInDay] = useState([]);
  const seasonType = season.split(' ')[0];
  const seasonYear = season.split(' ')[1];

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get(
        `/published-schedule/season?season=${seasonType}&year=${seasonYear}`,
      );
      setEventsInDay(data);
    };
    renderTable();
  }, [seasonType, seasonYear]);

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
                    eventDate={getUTCDate(item.day.eventDate).toLocaleDateString('en-US')}
                    day={dayNames[getUTCDate(item.day.eventDate).getDay()]}
                    startTime={formatDate(item.day.startTime)}
                    endTime={formatDate(item.day.endTime)}
                    location={item.day.location}
                    notes={item.day.notes}
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
};

export default PublishedScheduleTable;

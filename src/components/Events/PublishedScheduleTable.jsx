import { NPOBackend } from '../../utils/auth_utils.js';
import Events from './Events.jsx';
import EventInfo from './EventInfo.jsx';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box } from '@chakra-ui/react';

const PublishedScheduleTable = ({ season }) => {
  const [eventsInDay, setEventsInDay] = useState([]);
  // const [prevEvent, setPrevEvent] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const seasonType = season.split(' ')[0];
  const seasonYear = season.split(' ')[1];

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get(
        `/published-schedule/season?season=${seasonType}&year=${seasonYear}`,
      );
      setEventsInDay(data);
      // setPrevEvent(data.length > 0 ? data[0].day : null);
    };
    renderTable();
  }, [seasonType, seasonYear]);

  useEffect(() => {
    const calculateBreaks = () => {
      const allEvents = eventsInDay.flatMap(item => [
        ...item.data,
        { startTime: item.day.startTime, endTime: item.day.endTime },
      ]);
      const calculatedBreaks = [];
      for (let i = 0; i < allEvents.length - 1; i++) {
        const currentEvent = allEvents[i];
        const nextEvent = allEvents[i + 1];

        if (currentEvent.endTime < nextEvent.startTime) {
          calculatedBreaks.push({
            startTime: currentEvent.endTime,
            endTime: nextEvent.startTime,
            eventTitle: 'Break / Team Time',
          });
        }
      }
      return calculatedBreaks;
    };

    setBreaks(calculateBreaks());
  }, [eventsInDay]);


  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // const checkBreak = day => {
  //   if (
  //     prevEvent !== null &&
  //     new Date(day.startTime).getTime() > new Date(prevEvent.endTime).getTime()
  //   ) {
  //     // const eventData = [0, prevEvent.endTime, day.startTime, 'Break / Team Time'];
  //     setPrevEvent(day);
  //     console.log('there should be a break here');
  //     return true;
  //   } else {
  //     console.log("there isn't a break");
  //     setPrevEvent(day);
  //     console.log(day);
  //     console.log(prevEvent);
  //     return false;
  //   }
  // };

  // const calculateBreaks = events => {
  //   const breaks = [];
  //   for (let i = 0; i < events.length - 1; i++) {
  //     const currentEvent = events[i];
  //     const nextEvent = events[i + 1];

  //     if (currentEvent.endTime < nextEvent.startTime) {
  //       breaks.push({
  //         startTime: currentEvent.endTime,
  //         endTime: nextEvent.startTime,
  //         type: 'Break / Team Time',
  //       });
  //     }
  //   }
  //   return breaks;
  // };

  // const breaks = calculateBreaks(
  //   eventsInDay.flatMap(item => [
  //     ...item.data,
  //     { startTime: item.day.startTime, endTime: item.day.endTime },
  //   ]),
  // );

  return (
    <Box>
      <TableContainer>
        <Table variant="simple" borderWidth={1}>
          <Thead>
            <Tr>
              <Th>Info</Th>
              <Th>Event Schedule</Th>
            </Tr>
          </Thead>
          <Tbody>
            {eventsInDay.map(item => (
              <Tr key={item.day.id} verticalAlign={'top'}>
                <Td>
                  <EventInfo
                    eventDate={item.day.eventDate}
                    day={dayNames[new Date(item.day.eventDate).getDay()]}
                    startTime={item.day.startTime}
                    endTime={item.day.endTime}
                    location={item.day.location}
                    notes={item.day.notes}
                  />
                </Td>
                <Td>
                  <Events eventData={item.data} location={item.day.location} />
                  {breaks.map((breakItem, index) => (
                    <Tr key={`break-${index}`} verticalAlign={['top']}>
                      <Td>
                        <Events
                          eventData={item.data.concat(breaks)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Td>

                {/* {checkBreak(item.day) ? (
                  <Td>
                    <Events
                      eventData={{
                        id: 0,
                        startTime: prevEvent.endTime,
                        endTime: item.day.startTime,
                        eventTitle: 'Break / Team Time',
                      }}
                    />
                  </Td>
                ) : null} */}
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

import Events from './Events.jsx';
import EventInfo from './EventInfo.jsx';
import PropTypes from 'prop-types';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';


const PublishedScheduleTable = ({ eventData, setShouldDataRevalidate}) => {
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
    <TableContainer borderWidth={1} borderRadius="10px" mr="2rem">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Info</Th>
            <Th>Event Schedule</Th>
          </Tr>
        </Thead>
        <Tbody>
          {eventData.map(item => (
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
  );
};

PublishedScheduleTable.propTypes = {
  eventData: PropTypes.array.isRequired,
  setShouldDataRevalidate: PropTypes.func.isRequired,
};

export default PublishedScheduleTable;

import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';

import { useEffect, useState } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';

const PublishedSchedule = () => {
  // get data from database
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const getTodaySeason = () => {
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let season;

    if (month >= 3 && month <= 5) {
      season = 'Spring';
    } else if (month >= 9 && month <= 11) {
      season = 'Fall';
    } else if (month >= 6 && month <= 8) {
      season = 'Summer';
    } else {
      season = 'Winter';
    }
    return season + ' ' + year.toString();
  };

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule/all-seasons');
      const index = data.indexOf(curSeason);
      if (index !== -1) {
        data.splice(index, 1);
      }

      const seasonOrder = ['Summer', 'Fall', 'Winter', 'Spring'];
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
    renderTable();
  }, []);

  const curSeason = getTodaySeason();

  //update chakra table container accordingly
  return (
    <Box pt={10} pb={10} pl={100} pr={100}>
      {selectedSeason != '' ? (
        <Text fontSize="2.5vw" mb="-5vh" fontWeight="bold">
          {selectedSeason}
        </Text>
      ) : (
        <Text fontSize="2.5vw" mb="-5vh" fontWeight="bold">
          {curSeason}
        </Text>
      )}
      <Select
        mb="3vh"
        variant="unstyled"
        placeholder={curSeason}
        textColor="transparent"
        onChange={() => setSelectedSeason(event.target.value)}
        width="23%"
      >
        {allSeasons.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>

      {/* tables for each season */}
      {selectedSeason != '' ? (
        <PublishedScheduleTable season={selectedSeason} />
      ) : (
        <PublishedScheduleTable season={curSeason} />
      )}
    </Box>
  );
};

export default PublishedSchedule;

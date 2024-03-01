import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';
// import s from './PublishedSchedule.module.css';

import { useEffect, useState } from 'react';
import { Box, Select } from '@chakra-ui/react';

const PublishedSchedule = () => {
  // get data from database
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const getTodaySeason = () => {
    let today = new Date();
    let month = today.getMonth() + 1; //January is 0!
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
      data.sort((a, b) => {
        // Compare years first
        if (a.split(' ')[1] !== b.split(' ')[1]) {
          return b.split(' ')[1] - a.split(' ')[1];
        } else {
          // If years are equal, compare alphabetically
          return -1*a.localeCompare(b);
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
      {/* season dropdown menu */}
      <Select
        mb="3vh"
        variant="unstyled"
        placeholder="Current Season"
        fontSize="2.5vw"
        fontWeight="bold"
        size="lg"
        onChange={() => setSelectedSeason(event.target.value)}
        width="25%"
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

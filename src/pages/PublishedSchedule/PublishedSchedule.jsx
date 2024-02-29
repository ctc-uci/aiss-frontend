import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';
// import s from './PublishedSchedule.module.css';

import { useEffect, useState } from 'react';
import {
  Box,
  Select,
} from '@chakra-ui/react';


const PublishedSchedule = () => {
  // get data from database
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule/all-seasons');
      setAllSeasons(data);
    };
    renderTable();

  }, []);

  //update chakra table container accordingly
  return (
    <Box pt={10} pb={10} pl={100} pr={100}>
        {/* season dropdown menu */}
        <Select mb='3vh' variant='unstyled' placeholder='All Seasons' fontSize='2.5vw' fontWeight='bold' size='lg' onChange={() => setSelectedSeason(event.target.value)} width="20%">
            {allSeasons.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
        </Select>

        {/* tables for each season */}
        {selectedSeason != '' ?
          (<PublishedScheduleTable
            season={selectedSeason}
          />) :
          (allSeasons.map(item => (
            <PublishedScheduleTable
              key={item}
              season={item}
            />
          )))
        }
    </Box>
  );
};

export default PublishedSchedule;

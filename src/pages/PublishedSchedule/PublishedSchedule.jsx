import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';

import { useEffect, useState } from 'react';
import {
  Box,
  Select,
} from '@chakra-ui/react';
import AddDayModal from './AddDayModal.jsx';

const PublishedSchedule = () => {
  // get data from database
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule/all-seasons');
      console.log(data)
      setAllSeasons(data);
    };
    renderTable();
    
  }, []);

  //update chakra table container accordingly
  return (
    <Box pt={10} pb={10} pl={100} pr={100}>
        {/* season dropdown menu */}
        <Select variant='unstyled' placeholder='All Seasons' onChange={() => setSelectedSeason(event.target.value)} width="20%">
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
        <AddDayModal />
    </Box>
  );
};

export default PublishedSchedule;

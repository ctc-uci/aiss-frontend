import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';

import { useEffect, useState } from 'react';
import {
  Box,
  Select,
} from '@chakra-ui/react';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const PublishedSchedule = () => {
  // get data from database
  const {currentUser} = useAuthContext();
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule/all-seasons');
    
      setSelectedSeason(currentUser.type === USER_ROLE ? data[0] : ''); // We assume the current season is the first one in the list
      setAllSeasons(data);

    };
    renderTable();
    
  }, [currentUser]);


  //update chakra table container accordingly
  return (
    <Box pt={10} pb={10} pl={100} pr={100}>
        {/* season dropdown menu */}

          <Select variant='unstyled' placeholder={ currentUser.type === ADMIN_ROLE ? 'All Seasons': selectedSeason} onChange={() => setSelectedSeason(event.target.value)} width="20%">
              { currentUser.type === ADMIN_ROLE ?
              allSeasons.map(item => (
                <option key={item} value={item}>{item}</option>
              )) : null }
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

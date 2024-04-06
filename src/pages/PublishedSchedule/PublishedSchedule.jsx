import { NPOBackend } from '../../utils/auth_utils.js';
import PublishedScheduleTable from '../../components/Events/PublishedScheduleTable.jsx';
import AUTH_ROLES from '../../utils/auth_config.js';
import { useAuthContext } from '../../common/AuthContext.jsx';

import { useEffect, useState } from 'react';
const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;
import { Box, Select, Text } from '@chakra-ui/react';

const PublishedSchedule = () => {
  // get data from database
  const {currentUser} = useAuthContext();
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

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

  useEffect(() => {
    const renderTable = async () => {
      const { data } = await NPOBackend.get('/published-schedule/all-seasons');
      if (data.indexOf(curSeason) == -1) {
        data.unshift(curSeason);
      }

      setSelectedSeason(currentUser.type === USER_ROLE ? curSeason : data[0]); // We assume the current season is the first one in the list

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
    renderTable();
  }, [currentUser]);

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
        placeholder={allSeasons.indexOf(curSeason) === -1 && curSeason}
        value={selectedSeason}
        textColor="transparent"
        onChange={(e) => setSelectedSeason(e.target.value)}
        width="23%"
        visibility={currentUser.type == USER_ROLE ? 'hidden' : 'visible'}
      >
        { currentUser.type === ADMIN_ROLE &&
          allSeasons.map(item => (
            <option key={item} value={item} className={navigator.userAgent.includes('Windows') ? 'Windows-PSOption' : 'Unix-PSOption'}>
              {item}
            </option>
          ))
        }
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

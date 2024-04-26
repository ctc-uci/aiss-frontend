import { useState, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Select } from '@chakra-ui/react';
import './StatTable.css';

const StatTable = ({ season, allSeasons }) => {
  const [stats, setStats] = useState([]);
  // const currSeason = season.split(' ')[0];
  // const currYear = season.split(' ')[1];
  // const [selectedSeason, setSelectedSeason] = useState(currSeason.toLowerCase());
  // const [selectedYear, setSelectedYear] = useState(currYear);
  // const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  // const uniqueSeasons = Array.from(new Set(allSeasons.map(season => season.split(' ')[0])));
  // const uniqueYears = Array.from(new Set(allSeasons.map(seasonYear => seasonYear.split(' ')[1])));
  // const toast = useToast();

  console.log(season, allSeasons);

  // useEffect(() => {
  //   const renderTable = async () => {
  //     const { data } = await NPOBackend.get('/published-schedule/all-seasons');
  //     if (data.indexOf(curSeason) == -1) {
  //       data.unshift(curSeason);
  //     }

  //     setSelectedSeason(curSeason);

  //     const seasonOrder = ['Fall', 'Summer', 'Spring'];
  //     data.sort((a, b) => {
  //       // Compare years first
  //       if (a.split(' ')[1] !== b.split(' ')[1]) {
  //         return b.split(' ')[1] - a.split(' ')[1];
  //       } else {
  //         return seasonOrder.indexOf(a.split(' ')[0]) - seasonOrder.indexOf(b.split(' ')[0]);
  //       }
  //     });

  //     setAllSeasons(data);

  //   };
  //   renderTable();
  // }, [curSeason]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!selectedSeason) {
          setSelectedSeason(season);
        }
        const curSeason = selectedSeason.split(' ')[0];
        const curYear = selectedSeason.split(' ')[1];
        const response = await NPOBackend.get(`/published-schedule/stats?season=${curSeason.toLowerCase()}&year=${curYear}`);
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, [selectedSeason]);

  // const showToast = (title, description) => {
  //   toast({
  //     title,
  //     description,
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //     position: 'top',
  //     colorScheme: 'blue'
  //   });
  // };

  // const handleSeasonChange = (event) => {
  //   const newSeason = event.target.value;
  //   setSelectedSeason(newSeason);
  //   showToast('Season Changed', `${newSeason.toUpperCase()}`);
  // };

  // const handleYearChange = (event) => {
  //   const newYear = event.target.value;
  //   setSelectedYear(newYear);
  //   showToast('Year Changed', `Selected year changed to ${newYear}`);
  // };

  const transformData = () => {
    const transformedData = {};

    stats.forEach(stat => {
      const eventType = stat.eventType;
      const subject = stat.subject;
      const totalCount = parseInt(stat.totalCount);

      if (!transformedData[eventType]) {
        transformedData[eventType] = {};
      }

      transformedData[eventType][subject] = totalCount;
    });

    return transformedData;
  };

  const transformedStats = transformData();

  return (
    <div className='container'>
      <div className='select-container'>
        {/* <Select variant='filled' size='md' width = '200px' marginTop='20px' marginRight='20px' transition='all 0.3s ease' value={selectedSeason} onChange={handleSeasonChange}>
          {uniqueSeasons.map((season) => (
            <option key={season} value={season.toLowerCase()}>
              {season}
            </option>
          ))}
        </Select>
        <Select variant='filled' size='md' width='200px' marginTop='20px' value={selectedYear} onChange={handleYearChange}>
          {uniqueYears.map((seasonYear) => (
            <option key={seasonYear} value={seasonYear}>
              {seasonYear}
            </option>
          ))}
        </Select> */}
        <Select
          mb="3vh"
          variant="unstyled"
          textColor="black"
          placeholder={allSeasons.indexOf(season) === -1 && season}
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          width="23%"
        >
          {allSeasons.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))
          }
        </Select>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Event Type</th>
              {Object.keys(transformedStats).length > 0 &&
                Object.keys(transformedStats[Object.keys(transformedStats)[0]]).map(subject => (
                  <th key={subject} style={{ textTransform: 'capitalize' }}>{subject}</th>
                ))}
            </tr>
          </thead>
          <tbody className='table-body'>
            {Object.keys(transformedStats).map((eventType) => (
              <React.Fragment key={eventType}>
                <tr className='table-data'>
                  <td style={{ textTransform: 'capitalize' }}>{eventType}</td>
                  {Object.keys(transformedStats[eventType]).map(subject => (
                    <td key={`${eventType}-${subject}`} >{transformedStats[eventType][subject]}</td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

StatTable.propTypes = {
  season: PropTypes.string,
  year: PropTypes.string,
  allSeasons: PropTypes.array,
};

export default StatTable;

import { useState, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Box, Select } from '@chakra-ui/react';
import './StatTable.css';

const StatTable = ({ season, allSeasons }) => {
  const [stats, setStats] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(season);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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
    <Box>
      <Box mt="1rem">
        <Select
          textColor="black"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          width="max-content"
        >
          {allSeasons.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))
          }
        </Select>
      </Box>
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
    </Box>
  );
};

StatTable.propTypes = {
  season: PropTypes.string,
  year: PropTypes.string,
  allSeasons: PropTypes.array,
};

export default StatTable;

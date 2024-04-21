import { useState, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Select } from '@chakra-ui/react';
import './StatTable.css';

const StatTable = ({ season }) => {
  const [stats, setStats] = useState([]);
  const currSeason = season.split(' ')[0];
  const currYear = season.split(' ')[1]
  const [selectedSeason, setSelectedSeason] = useState(currSeason.toLowerCase());
  const [selectedYear, setSelectedYear] = useState(currYear);
  console.log(season)
  console.log(season.split(' ')[0])
  console.log(season.split(' ')[1])
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await NPOBackend.get(`/published-schedule/stats?season=${selectedSeason}&year=${selectedYear}`);
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, [selectedSeason, selectedYear]);

  const handleSeasonChange = (event) => {
    const newSeason = event.target.value;
    setSelectedSeason(newSeason);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
  };

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
        <Select variant='filled' size='md' width = '200px' marginTop='20px' marginRight='20px' value={selectedSeason} onChange={handleSeasonChange}>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
        </Select>
        <Select variant='filled' size='md' width='200px' marginTop='20px' value={selectedYear} onChange={handleYearChange}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </Select>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Event Type</th>
              {Object.keys(transformedStats).length > 0 &&
                Object.keys(transformedStats[Object.keys(transformedStats)[0]]).map(subject => (
                  <th key={subject}>{subject}</th>
                ))}
            </tr>
          </thead>
          <tbody className='table-body'>
            {Object.keys(transformedStats).map((eventType) => (
              <React.Fragment key={eventType}>
                <tr className='table-data'>
                  <td>{eventType}</td>
                  {Object.keys(transformedStats[eventType]).map(subject => (
                    <td key={`${eventType}-${subject}`}>{transformedStats[eventType][subject]}</td>
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
};

export default StatTable;

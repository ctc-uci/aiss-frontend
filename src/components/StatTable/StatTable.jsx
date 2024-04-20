import { useState, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Select } from '@chakra-ui/react';
import './StatTable.css';

const StatTable = ({ season = 'spring' }) => {
  const [stats, setStats] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(season);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await NPOBackend.get(`/published-schedule/stats?season=${selectedSeason}`);
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, [selectedSeason]);

  const handleSeasonChange = (event) => {
    const newSeason = event.target.value;
    setSelectedSeason(newSeason);
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
    <div>
      <Select value={selectedSeason} onChange={handleSeasonChange}>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="fall">Fall</option>
      </Select>

      <table className='table-container'>
        <thead>
          <tr>
            <th>Event Type</th>
            {Object.keys(transformedStats).length > 0 &&
              Object.keys(transformedStats[Object.keys(transformedStats)[0]]).map(subject => (
                <th key={subject}>{subject}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(transformedStats).map((eventType, index) => (
            <React.Fragment key={eventType}>
              <tr className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{eventType}</td>
                {Object.keys(transformedStats[eventType]).map(subject => (
                  <td key={`${eventType}-${subject}`}>{transformedStats[eventType][subject]}</td>
                ))}
              </tr>
              <tr className="divider-row">
                <td colSpan={Object.keys(transformedStats[eventType]).length + 1}></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

StatTable.propTypes = {
  season: PropTypes.string,
};

export default StatTable;

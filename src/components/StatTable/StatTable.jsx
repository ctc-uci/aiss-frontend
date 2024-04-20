import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Select } from '@chakra-ui/react';

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
        <tbody>
          {Object.keys(transformedStats).map(eventType => (
            <tr key={eventType}>
              <td>{eventType}</td>
              {Object.keys(transformedStats[eventType]).map(subject => (
                <td key={`${eventType}-${subject}`}>{transformedStats[eventType][subject]}</td>
              ))}
            </tr>
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

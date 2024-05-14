import { useState, useEffect, useRef } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { NPOBackend } from '../../utils/auth_utils';
import { Box, Select, Text, IconButton, useDisclosure, Heading, Flex } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import './StatTable.css';
import MoreInfoModal from './MoreInfoModal';

const StatTable = ({ season, allSeasons }) => {
  const [stats, setStats] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [tableWidth, setTableWidth] = useState(0);
  const tableRef = useRef(null);
  const { isOpen: isOpenMoreInfo, onOpen: onOpenMoreInfio, onClose: onCloseMoreInfo } = useDisclosure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const curSeason = selectedSeason.split(' ')[0];
        const curYear = selectedSeason.split(' ')[1];
        const response = await NPOBackend.get(`/published-schedule/stats?season=${curSeason.toLowerCase()}&year=${curYear}`);
        const data = response.data;
        setStats(data);
        if (tableRef.current) {
          setTableWidth(tableRef.current.offsetWidth);
        }
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
    <Box ref={tableRef} mt="40px">
      <Box mt="1rem">
        <Flex justify="space-between">
          <Heading fontSize="30px">
            Event Breakdown
          </Heading>
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
        </Flex>
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
      <Box background="#3182CE1A" padding="16px" mb="12px" maxWidth={tableWidth} borderRadius="5px">
        <Text >
          * Totals reflect the actual number of events. However, individual events
          may appear within the table more than once if it is tagged with more than one subject
          <IconButton color="#3182CE" size="sm" _hover={{bg: "transparent"}} icon={<InfoOutlineIcon/>} onClick={onOpenMoreInfio}/>
        </Text>
      </Box>
      <MoreInfoModal isOpen={isOpenMoreInfo} onClose={onCloseMoreInfo}/>
    </Box>
  );
};

StatTable.propTypes = {
  season: PropTypes.string,
  year: PropTypes.string,
  allSeasons: PropTypes.array,
};

export default StatTable;

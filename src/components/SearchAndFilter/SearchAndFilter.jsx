import { Input, Select, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
const subjectsOptions = ['life skills', 'science', 'technology', 'engineering', 'math', 'college readiness'];
const eventOptions = ['guest speaker', 'study-trip', 'workshop', 'other'];
const yearOptions = ['junior', 'senior', 'both'];
const seasonOptions = ['fall', 'spring', 'summer'];

const SearchAndFilter = ({ onSearch, onChange }) => {
  return (
    <Flex gap="4" mt="4">
      <Input placeholder="Search..." size="md" w="35%" bgColor="gray.200" className="searchBar" onChange={onSearch} />
      <Flex gap="4" ml="auto">
        <Select placeholder="Subject" className="dropDown" bgColor="gray.200" name="subject" onChange={onChange}>
          {subjectsOptions.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
        <Select placeholder="Event Type" className="dropDown" bgColor="gray.200" name="eventType" onChange={onChange}>
          {eventOptions.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
        <Select placeholder="Year" className="dropDown" bgColor="gray.200" name="year" onChange={onChange}>
          {yearOptions.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
        <Select placeholder="Season" className="dropDown" bgColor="gray.200" name="season" onChange={onChange}>
          {seasonOptions.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
};

SearchAndFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  export default SearchAndFilter;

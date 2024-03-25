import PropTypes from 'prop-types';
import {
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FilterCheckbox } from '../Catalog/SearchFilter/SearchFilter';
import { useState, useEffect } from 'react';

const Dropdown = ({ options, filter, selected, defaults, badgeColor, width }) => {
  const { getCheckboxProps } = filter;
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    setSelectedOptions(selected);
  }, [selected]);

  useEffect(() => {
    if (defaults && defaults[0] !== '')
      filter.setValue(defaults);
  }, [])

  return (
    <Menu>
      <MenuButton
        className="my-box"
        as={Button}
        rightIcon={
          <ChevronDownIcon
            fontSize="large"
            sx={{
              '.my-box[data-active] &': {
                transform: 'rotate(180deg)',
              },
            }}
          />
        }
        border="1px"
        size="auto"
        p="0.5rem"
        borderColor="gray.200"
        width={width ? width : '35vw'}
        bgColor="white"
        _hover={{ bgColor: 'white' }}
        _active={{ bgColor: 'white' }}
        fontWeight="normal"
      >
        <HStack wrap="wrap">
          {selectedOptions.length == 0 ? (
            <Text pr="4" color="gray.400" size="sm">
              Choose
            </Text>
          ) : (
            selectedOptions.map((option, index) =>
              <Badge
              key={index}
              backgroundColor={badgeColor}
              color="gray.900"
              textTransform="capitalize"
              borderRadius="10rem"
              fontWeight="normal"
              px="0.5rem"
              mr="0.125rem"
            >
              {option}
            </Badge>
            )
          )}
        </HStack>
      </MenuButton>
      <MenuList>
        {options.map(({ value, name }) => (
          <FilterCheckbox key={value} {...getCheckboxProps({ value: value })} name={name} defaultChecked={defaults && defaults.includes(value)} />
        ))}
      </MenuList>
    </Menu>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.array,
  defaults: PropTypes.array,
  badgeColor: PropTypes.string,
  width: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  filter: PropTypes.shape({
    getCheckboxProps: PropTypes.func,
    setValue: PropTypes.func,
  }),
};

export default Dropdown;

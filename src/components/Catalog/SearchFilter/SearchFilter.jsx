import PropTypes from 'prop-types';
import {
  Button,
  Flex,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  useCheckbox,
  chakra,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const SearchFilter = ({ name, options, filter }) => {
  const { getCheckboxProps } = filter;

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Text overflowX="hidden" textOverflow="ellipsis">
          {name}
        </Text>
      </MenuButton>
      <MenuList>
        {options.map(option => (
          <FilterCheckbox key={option} {...getCheckboxProps({ value: option })} />
        ))}
      </MenuList>
    </Menu>
  );
};

SearchFilter.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  filter: PropTypes.shape({
    getCheckboxProps: PropTypes.func,
  }),
};

const FilterCheckbox = props => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props);

  return (
    <chakra.label
      display="flex"
      flexDirection="row"
      alignItems="center"
      gridColumnGap={2}
      maxW="40"
      bg="green.50"
      border="1px solid"
      borderColor="green.500"
      rounded="lg"
      px={3}
      py={1}
      cursor="pointer"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex
        alignItems="center"
        justifyContent="center"
        border="2px solid"
        borderColor="green.500"
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && <Box w={2} h={2} bg="green.500" />}
      </Flex>
      <Text color="gray.700" {...getLabelProps()}>
        {props.value}
      </Text>
    </chakra.label>
  );
};

FilterCheckbox.propTypes = {
  value: PropTypes.string,
};

export default SearchFilter;

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
import { CheckIcon } from '@chakra-ui/icons';
import { ChevronDownIcon } from '@chakra-ui/icons';

const SearchFilter = ({ name, options, filter }) => {
  const { getCheckboxProps } = filter;

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
        size="sm"
        bgColor="blackAlpha.200"
        _hover={{ bgColor: 'blackAlpha.100' }}
        _active={{ bgColor: 'blackAlpha.100' }}
        fontWeight="normal"
      >
        <Text overflowX="hidden" textOverflow="ellipsis" pr="4">
          {name}
        </Text>
      </MenuButton>
      <MenuList>
        {options.map(({ value, name }) => (
          <FilterCheckbox key={value} {...getCheckboxProps({ value: value })} name={name} />
        ))}
      </MenuList>
    </Menu>
  );
};

SearchFilter.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
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
        borderWidth={state.isChecked ? '0' : '2px'}
        borderColor="blackAlpha.600"
        borderRadius="4"
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && (
          <Box
            w={4}
            h={4}
            bg="blue.400"
            borderRadius="4"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CheckIcon color="white" fontSize="x-small" />
          </Box>
        )}
      </Flex>
      <Text color="gray.700" {...getLabelProps()}>
        {props.name}
      </Text>
    </chakra.label>
  );
};

FilterCheckbox.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
};

export default SearchFilter;
export { FilterCheckbox };

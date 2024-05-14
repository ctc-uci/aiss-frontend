import PropTypes from 'prop-types';
import {
  Box,
  FormLabel,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
  Textarea,
  useToast,
  Flex,
  Heading
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { NPOBackend } from '../../../utils/auth_utils';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../../Catalog/SearchFilter/filterOptions';
import useSearchFilters from '../../Catalog/SearchFilter/useSearchFilters';
import Dropdown from '../../Dropdown/Dropdown';
import { useEffect } from 'react';

const schema = yup.object({
  host: yup.string().max(50, 'Host exceeds 50 character limit').default('').nullable(),
  title: yup.string().required('Title Required').max(50, 'Title exceeds 50 character limit'),
  description: yup
    .string()
    .max(256, 'Description exceeds 256 character limit')
    .default('')
    .nullable(),
  subject: yup.array().min(1, 'Please select at least one subject').required(),
  eventType: yup.array().min(1, 'Please select at least one event type').required(),
});

const CreateEventForm = ({ eventData, setDataShouldRevalidate, closeModal }) => {
  const toast = useToast();
  const {
    setValue,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...eventData },
  });

  const submitData = async data => {
    const { host, title, description } = data;
    console.log(data);
    const season = filterValues.season;
    const eventType = filterValues.eventType;
    const year = filterValues.year;
    const subject = filterValues.subject;

    toast.closeAll();

    // make post request to catalog backend route
    try {
      if (eventData) {
        await NPOBackend.put(`/catalog/${eventData.id}`, {
          host: host,
          title: title,
          season: season,
          eventType: eventType,
          subject: subject,
          description: description,
          year: year,
        });
      } else {
        await NPOBackend.post(`/catalog`, {
          host: host,
          title: title,
          season: season,
          eventType: eventType,
          subject: subject,
          description: description,
          year: year,
        });
      }
      reset();
      toast({
        title: 'Event has been added',
        // description: `Event has been submitted. ID: ${id}`,
        status: 'success',
        variant: 'subtle',
        position: 'bottom',
        containerStyle: {
          mt: '6rem',
        },
        duration: 3000,
        isClosable: true,
      });
      setDataShouldRevalidate(true);
      closeModal();
    } catch (error) {
      toast({
        title: `Error: ${error}`,
        status: 'error',
        variant: 'subtle',
        position: 'bottom',
        containerStyle: {
          mt: '6rem',
        },
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const { filters, filterValues } = useSearchFilters();
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;

  useEffect(() => {
    setValue('season', filterValues.season);
    setValue('year', filterValues.year);
    setValue('subject', filterValues.subject);
    setValue('eventType', filterValues.eventType);
  }, [filterValues]);

  return (
    <Box width="80%" m="auto" mt="20px">
    <Box p="20px" border="1px" borderRadius="10px" borderColor="gray.200">
      <form onSubmit={handleSubmit(data => submitData(data))}>
        <Heading size="md" color="gray.600">Event Information</Heading>
        <Box padding="12px">
          {/* TITLE */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.title} width="35vw">
              <FormLabel fontWeight="bold" color="gray.600">Title *</FormLabel>
              <Input type="text" {...register('title')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* DESCRIPTION */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.description} width="35vw">
              <FormLabel fontWeight="bold" color="gray.600">Description</FormLabel>
              <Textarea {...register('description')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Flex justifyContent="space-between">
            {/* SEASON */}
            <Box mb="15px">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Season</FormLabel>
                <Dropdown
                  options={seasonOptions}
                  filter={seasonFilter}
                  selected={filterValues.season}
                  defaults={eventData && eventData.season}
                  badgeColor="#CEECC3"
                />
              </FormControl>
            </Box>

            {/* YEAR - selected seasons stored in filterValues.year */}
            <Box mb="15px">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Cohort</FormLabel>
                <Dropdown
                  options={yearOptions}
                  filter={yearFilter}
                  selected={filterValues.year}
                  defaults={eventData && eventData.year}
                  badgeColor="#FFE1BE"
                />
              </FormControl>
            </Box>
          </Flex>

          <Flex justifyContent="space-between">
            {/* SUBJECT */}
            <Box mb="15px">
              <FormControl isInvalid={errors && errors.subject}>
                <FormLabel fontWeight="bold" color="gray.600">Subject *</FormLabel>
                <Dropdown
                  options={subjectOptions}
                  filter={subjectFilter}
                  selected={filterValues.subject}
                  defaults={eventData && eventData.subject}
                  badgeColor="#E8D7FF"
                />
                <FormErrorMessage>
                  {errors.subject && errors.subject.message}
                </FormErrorMessage>
              </FormControl>
            </Box>

            {/* EVENT TYPE */}
            <Box mb="15px">
              <FormControl isInvalid={errors && errors.eventType}>
                <FormLabel fontWeight="bold" color="gray.600">Event Type *</FormLabel>
                <Dropdown
                  options={eventOptions}
                  filter={eventFilter}
                  selected={filterValues.eventType}
                  defaults={eventData && eventData.eventType}
                  badgeColor="#CFDCFF"
                />
                <FormErrorMessage>
                  {errors.eventType && errors.eventType.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
        </Box>

        <Heading size="md" color="gray.600">Host Information</Heading>
        <Box padding="12px">
          {/* HOST */}
          <Box>
            <FormControl isInvalid={errors && errors.host} width="35vw">
              <FormLabel fontWeight="bold" color="gray.600">Host</FormLabel>
              <Input type="text" {...register('host')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        <Flex justifyContent="flex-end" p="12px">
          <Button onClick={closeModal} mr="16px">Cancel</Button>
          <Button
            type="submit"
            bgColor="#2c93d1"
            color="white"
            _hover={{ bgColor: '#73bff0' }}
          >
            Add Event
          </Button>
        </Flex>
      </form>
    </Box>
    </Box>
  );
};

CreateEventForm.propTypes = {
  eventData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    host: PropTypes.string,
    year: PropTypes.array,
    season: PropTypes.array,
    eventType: PropTypes.array,
    subject: PropTypes.array,
    description: PropTypes.string,
  }),
  setDataShouldRevalidate: PropTypes.func,
  closeModal: PropTypes.func,
};


CreateEventForm.defaultProps = {
  eventData: undefined,
  setDataShouldRevalidate: undefined,
  closeModal: () => {},
};

export default CreateEventForm;

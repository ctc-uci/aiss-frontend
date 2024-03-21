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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { NPOBackend } from '../../../utils/auth_utils';

import SearchFilter from '../../Catalog/SearchFilter/SearchFilter';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../../Catalog/SearchFilter/filterOptions';
import useSearchFilters from '../../Catalog/SearchFilter/useSearchFilters';

const schema = yup.object({
  // id: yup.string().required('ID required').max(10, 'ID exceeds 10 character limit'),
  host: yup.string().required('Host required').max(50, 'Host exceeds 50 character limit'),
  title: yup.string().required('Title required').max(50, 'Title exceeds 50 character limit'),
  season: yup.array().min(1, 'Must select a season').default([]),
  // eventType: yup.array().min(1, "Must select an event type").default([]),
  // subject: yup.array().min(1, "Must select a subject").default([]),
  description: yup
    .string()
    .required('Description required')
    .max(50, 'Description exceeds 50 character limit'),
  // year: yup.array().min(1, "Must select a year").default([]),
});

const CreateEventForm = ({ eventData, setDataShouldRevalidate, closeModal }) => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...eventData },
  });

  const submitData = async data => {
    console.log(filterValues.eventType);
    const { host, title, description } = data;
    const season = filterValues.season;
    const eventType = filterValues.eventType;
    const year = filterValues.year;
    const subject = filterValues.subject;

    toast.closeAll();

    // make post request to catalog backend route
    try {
      let response;
      let id;
      if (eventData) {
        response = await NPOBackend.put(`/catalog/${eventData.id}`, {
          host: host,
          title: title,
          season: season,
          eventType: eventType,
          subject: subject,
          description: description,
          year: year,
        });
        id = response.data[0].id;
      } else {
        response = await NPOBackend.post(`/catalog`, {
          host: host,
          title: title,
          season: season,
          eventType: eventType,
          subject: subject,
          description: description,
          year: year,
        });
        id = response.data.id;
      }
      reset();
      toast({
        title: 'Event submitted!',
        description: `Event has been submitted. ID: ${id}`,
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

  const { filters, clearFilters, filterValues } = useSearchFilters();
  console.log(clearFilters);
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;

  return (
    <Box p="2vw">
      <form onSubmit={handleSubmit(data => submitData(data))}>
        <Box mb="4vh">
          {/* HOST */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.host} width="80%">
              <FormLabel fontWeight="bold">Host</FormLabel>
              <Textarea {...register('host')} border="1px solid" />
              <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* TITLE */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.title} width="80%">
              <FormLabel fontWeight="bold">Title</FormLabel>
              <Textarea {...register('title')} border="1px solid" />
              <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* SEASON */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.season} width="80%">
              <FormLabel fontWeight="bold">Season</FormLabel>
              <SearchFilter name="Season" options={seasonOptions} filter={seasonFilter} />
              <FormErrorMessage>{errors.season && errors.season.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* EVENT TYPE */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.eventType} width="80%">
              <FormLabel fontWeight="bold">Event Type</FormLabel>
              <SearchFilter name="Event Type" options={eventOptions} filter={eventFilter} />
              <FormErrorMessage>{errors.eventType && errors.eventType.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* SUBJECT */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.subject} width="80%">
              <FormLabel fontWeight="bold">Subject</FormLabel>
              <SearchFilter name="Subject" options={subjectOptions} filter={subjectFilter} />
              <FormErrorMessage>{errors.subject && errors.subject.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* DESCRIPTION */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.description} width="47%">
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Input {...register('description')} border="1px solid" />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          {/* YEAR - selected seasons stored in filterValues.year */}
          <Box mb="4vh">
            <FormControl isInvalid={filterValues.year < 1} width="80%">
              {/* <FormControl isInvalid={errors && errors.year} width="80%"> */}
              <FormLabel fontWeight="bold">Cohort</FormLabel>
              <SearchFilter name="Cohort" options={yearOptions} filter={yearFilter} />
              {/* <FormErrorMessage>{errors.year && errors.year.message}</FormErrorMessage> */}
              <FormErrorMessage>OH NOOOO</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        <Button type="submit">Submit</Button>
      </form>
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
  setModified: undefined,
  closeModal: () => {},
};

export default CreateEventForm;

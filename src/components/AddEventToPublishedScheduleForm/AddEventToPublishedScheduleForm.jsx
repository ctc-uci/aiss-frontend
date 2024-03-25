/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormLabel,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
  Textarea,
  Checkbox,
  useToast,
  Heading,
  Flex,
  Text
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import { DayIdContext } from '../../pages/PublishedSchedule/AddDayContext';
import * as yup from 'yup';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../Catalog/SearchFilter/filterOptions';
import useSearchFilters from '../Catalog/SearchFilter/useSearchFilters';
import Dropdown from '../Dropdown/Dropdown';

  const schema = yup.object({
      startTime: yup.string().required('Start time is required'),
      endTime: yup.string()
        .required('End time is required')
        .test('is-after', 'End time must be after start time', function(endTime) {
          const startTime = this.parent.startTime;
          return startTime && endTime && startTime < endTime;
        }),
      host: yup.string().max(50, 'Host exceeds 50 character limit').default('').nullable(),
      title: yup.string().required('Title Required').max(50, 'Title exceeds 50 character limit'),
      description: yup
        .string()
        .max(256, 'Description exceeds 256 character limit')
        .default('')
        .nullable(),
      tentative: yup.boolean()
  });


const AddEventToPublishedScheduleForm = (eventData) => {
    const toast = useToast();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });

    const { dayId } = useContext(DayIdContext);

    const submitData = async (data) => {
      try {
        const { title, host, description, tentative, startTime, endTime } = data;
        const season = filterValues.season;
        const eventType = filterValues.eventType;
        const year = filterValues.year;
        const subject = filterValues.subject;

        toast.closeAll();
        // console.log("hi")

        const catalogResponse = await NPOBackend.post(`/catalog`, {
          title,
          host,
          description,
          eventType,
          subject,
          year,
          season
        });
        const catalogEventId = catalogResponse.data.id
        console.log(catalogEventId);

        //const dayInfo = await NPOBackend.get(`/day/${dayId}`);

        // Send a POST request to the appropriate backend route
        const response2 = await NPOBackend.post('/published-schedule', {
          eventId: catalogEventId,
          dayId,
          confirmed: !tentative,
          startTime,
          endTime,
          cohort: year,
        });
        console.log(response2);
        reset();
        toast({
          title: 'Event submitted!',
          description: `Event has been submitted. ID: ${catalogEventId}`,
          status: 'success',
          variant: 'subtle',
          position: 'bottom',
          containerStyle: {
            mt: '6rem',
          },
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
      }
    };

  const { filters, filterValues } = useSearchFilters();
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;

  return (
    <Box p="1rem" bgColor="white" borderRadius="5px">
      <form onSubmit={handleSubmit(submitData)}>
        <Heading size="md" color="gray.600" mb="0.5rem">Event Information</Heading>
        <Box px="1rem">
          {/* TITLE */}
          <Box mb="1rem">
            <FormControl isInvalid={errors && errors.title} width="35vw">
              <FormLabel fontWeight="bold" color="gray.600">Title *</FormLabel>
              <Input type="text" {...register('title')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* DESCRIPTION */}
          <Box mb="1rem">
            <FormControl isInvalid={errors && errors.description} width="35vw">
              <FormLabel fontWeight="bold" color="gray.600">Description</FormLabel>
              <Textarea {...register('description')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Flex alignItems="flex-end" >
          {/* START TIME? */}
          <Box mb="1rem">
            <FormControl isInvalid={errors && errors.startTime}>
                <FormLabel fontWeight="bold" color="gray.600">Time</FormLabel>
                <Input
                    size="md"
                    type="time"
                    {...register('startTime')}
                    border="1px solid"
                    borderColor="gray.200"
                />
                <FormErrorMessage>{errors.startTime && errors.startTime.message}</FormErrorMessage>
            </FormControl>
          </Box>

          <Text pb="1.5rem" color="gray.600" mx="1rem">&mdash;</Text>

          {/* END TIME? */}
          <Box mb="1rem">
            <FormControl isInvalid={errors && errors.endTime}>
                <Input
                    size="md"
                    type="time"
                    {...register('endTime')}
                    border="1px solid"
                    borderColor="gray.200"
                />
                <FormErrorMessage>{errors.endTime && errors.endTime.message}</FormErrorMessage>
            </FormControl>
          </Box>
          </Flex>

          <Flex justifyContent="space-between">
            {/* SEASON */}
            <Box mb="1rem">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Season</FormLabel>
                <Dropdown
                  options={seasonOptions}
                  filter={seasonFilter}
                  selected={filterValues.season}
                  defaults={eventData && eventData.season}
                  badgeColor="#CEECC3"
                  width="28vw"
                />
              </FormControl>
            </Box>

            {/* YEAR - selected seasons stored in filterValues.year */}
            <Box mb="1rem">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Cohort</FormLabel>
                <Dropdown
                  options={yearOptions}
                  filter={yearFilter}
                  selected={filterValues.year}
                  defaults={eventData && eventData.year}
                  badgeColor="#FFE1BE"
                  width="28vw"
                />
              </FormControl>
            </Box>
          </Flex>

          <Flex justifyContent="space-between">
            {/* SUBJECT */}
            <Box mb="1rem">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Subject</FormLabel>
                <Dropdown
                  options={subjectOptions}
                  filter={subjectFilter}
                  selected={filterValues.subject}
                  defaults={eventData && eventData.subject}
                  badgeColor="#E8D7FF"
                  width="28vw"
                />
              </FormControl>
            </Box>

            {/* EVENT TYPE */}
            <Box mb="1rem">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Event Type</FormLabel>
                <Dropdown
                  options={eventOptions}
                  filter={eventFilter}
                  selected={filterValues.eventType}
                  defaults={eventData && eventData.eventType}
                  badgeColor="#CFDCFF"
                  width="28vw"
                />
              </FormControl>
            </Box>
          </Flex>
          </Box>

          <Heading size="md" color="gray.600">Host Information</Heading>
          <Box padding="1rem">
            {/* HOST */}
            <Box>
              <FormControl isInvalid={errors && errors.host} width="35vw">
                <FormLabel fontWeight="bold" color="gray.600">Host</FormLabel>
                <Input type="text" {...register('host')} border="1px solid" borderColor="gray.200"/>
                <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Box>

          <Heading size="md" color="gray.600">Event Status</Heading>
          <Box padding="1rem">
            {/* TENTATIVE */}
            <Box mb="1rem">
              <FormControl>
                <Checkbox {...register('tentative')}>Tentative</Checkbox>
              </FormControl>
            </Box>
          </Box>
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

  export default AddEventToPublishedScheduleForm;

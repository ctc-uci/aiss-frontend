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
      confirmed: yup.boolean().default(true).required("Confirmation required"),
      // startTime: yup.date().required('Start time required'),
      // endTime: yup.date().required('End time required').min(yup.ref('startTime'), 'End time must be after start time'),
      startTime: yup.string().required('Start time is required'),
      endTime: yup.string()
        .required('End time is required')
        .test('is-after', 'End time must be after start time', function(endTime) {
          const startTime = this.parent.startTime;
          return startTime && endTime && startTime < endTime;
        }),
      // cohort: yup.number().required('Cohort required').min(2000),
      // notes: yup.string().nullable(),
      host: yup.string().max(50, 'Host exceeds 50 character limit').default('').nullable(),
      title: yup.string().required('Title Required').max(50, 'Title exceeds 50 character limit'),
      description: yup
        .string()
        .max(256, 'Description exceeds 256 character limit')
        .default('')
        .nullable(),
  });


const AddEventToPublishedScheduleForm = (eventData) => {
    const toast = useToast();
    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });


    const handleConfirmedChange = (e) => {
      setValue('confirmed', e.target.checked);
    };

    const { dayId } = useContext(DayIdContext);
    // const dayId = 2;

    const submitData = async (data) => {
      try {
        const { title, host, description, confirmed, startTime, endTime } = data;
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

        // Format the start time and end time to remove the date component
        // const formattedStartTime = new Date(startTime).toISOString().split('T')[1].slice(0, -1);
        // const formattedEndTime = new Date(endTime).toISOString().split('T')[1].slice(0, -1);
        console.log('startTime', startTime);
        console.log('endTime', endTime)

        // Send a POST request to the appropriate backend route
        const response2 = await NPOBackend.post('/published-schedule', {
          eventId: catalogEventId,
          dayId,
          confirmed,
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
    <Box p="2vw">
      <form onSubmit={handleSubmit(submitData)}>
        <Heading size="md" color="gray.600">Event Information</Heading>
        {/* <Box padding="12px"> */}
          {/* TITLE */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.title} width="30vw">
              <FormLabel fontWeight="bold" color="gray.600">Title *</FormLabel>
              <Input type="text" {...register('title')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* DESCRIPTION */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.description} width="30vw">
              <FormLabel fontWeight="bold" color="gray.600">Description</FormLabel>
              <Textarea {...register('description')} border="1px solid" borderColor="gray.200"/>
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Flex justifyContent="space-between" alignItems="flex-end">
          {/* START TIME? */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.startTime} width="30vw">
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

          <Text pb="2rem" color="gray.600">-</Text>

          {/* END TIME? */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.endTime} width="30vw">
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
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Subject</FormLabel>
                <Dropdown
                  options={subjectOptions}
                  filter={subjectFilter}
                  selected={filterValues.subject}
                  defaults={eventData && eventData.subject}
                  badgeColor="#E8D7FF"
                />
              </FormControl>
            </Box>

            {/* EVENT TYPE */}
            <Box mb="15px">
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">Event Type</FormLabel>
                <Dropdown
                  options={eventOptions}
                  filter={eventFilter}
                  selected={filterValues.eventType}
                  defaults={eventData && eventData.eventType}
                  badgeColor="#CFDCFF"
                />
              </FormControl>
            </Box>
          </Flex>

          <Heading size="md" color="gray.600">Host Information</Heading>
          <Box padding="12px">
            {/* HOST */}
            <Box>
              <FormControl isInvalid={errors && errors.host} width="30vw">
                <FormLabel fontWeight="bold" color="gray.600">Host</FormLabel>
                <Input type="text" {...register('host')} border="1px solid" borderColor="gray.200"/>
                <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Box>

          {/* CONFIRMED?*/}
          <Box mb="4vh">
          <FormControl isInvalid={errors && errors.confirmed} width="47%">
            <FormLabel fontWeight="bold">Confirmed</FormLabel>
            <Checkbox defaultChecked onChange={handleConfirmedChange}>Confirmed?</Checkbox>
            <FormErrorMessage>{errors.confirmed && errors.confirmed.message}</FormErrorMessage>
          </FormControl>
          </Box>

          {/* COHORT? */}
{/*}
          <Box mb="4vh">
          <FormControl isInvalid={errors && errors.cohort} width="47%">
            <FormLabel fontWeight="bold">Cohort</FormLabel>
            <Input {...register('cohort')} border="1px solid"/>
            <FormErrorMessage>{errors.cohort && errors.cohort.message}</FormErrorMessage>
          </FormControl>
          </Box>
  */}

          {/* NOTES? */}
          {/* <Box mb="4vh">
          <FormControl isInvalid={errors && errors.notes} width="47%">
            <FormLabel fontWeight="bold">Notes</FormLabel>
            <Textarea {...register('notes')} border="1px solid"/>
            <FormErrorMessage>{errors.notes && errors.notes.message}</FormErrorMessage>
          </FormControl>
          </Box>     */}


        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

  export default AddEventToPublishedScheduleForm;

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
  Text,
  Stack
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { NPOBackend } from '../../utils/auth_utils';
import * as yup from 'yup';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../Catalog/SearchFilter/filterOptions';
import useSearchFilters from '../Catalog/SearchFilter/useSearchFilters';
import Dropdown from '../Dropdown/Dropdown';
import PropTypes from 'prop-types';
import { PlannerContext } from '../Planner/PlannerContext';
import PlannedEvent, { convertTimeToMinutes } from '../Planner/PlannedEvent';

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

const AddEventToPublishedScheduleForm = ({ closeForm, eventData }) => {
  const { plannedEventsContext, dayId } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;
  const { filters, filterValues } = useSearchFilters();
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;

  const [formData, setFormData] = useState({...eventData, tentative: false});

  useEffect(() => {
    if (formData.startTime && formData.endTime && formData.startTime < formData.endTime) {
      const newPlannedEvent = new PlannedEvent(
        -1,
        formData.title,
        convertTimeToMinutes(formData.startTime),
        convertTimeToMinutes(formData.endTime),
        formData.host,
        formData.tentative ? true : false
      )
      setPlannedEvents([...plannedEvents.filter(e => e.id != -1), newPlannedEvent]);
    } else {
      setPlannedEvents(plannedEvents.filter(e => e.id != -1));
    }
  }, [formData])

  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    setPlannedEvents(plannedEvents.filter(e => e.id != -1));
    closeForm();
  }

  const currentDataHasChanged = (originalData, currData) => {
    console.log('org data', originalData);
    console.log('currData', currData);
    for (let key of Object.keys(currData)) {
      if (originalData[key] === undefined || originalData[key] !== currData[key]) {
        console.log('changed: ', key, originalData[key], currData[key]);
        return true;
      }
    }
    console.log('no changes to catalog data');
    return false;
  }

  const submitData = async (data) => {
    try {
      const { title, host, description, tentative, startTime, endTime } = data;
      const season = filterValues.season;
      const eventType = filterValues.eventType;
      const year = filterValues.year;
      const subject = filterValues.subject;

      toast.closeAll();

      const catalogDataChanged = currentDataHasChanged(eventData, {
        title,
        host,
        description,
        eventType,
        subject,
        year,
        season
      });

      let catalogEventId = eventData.id;

      if (catalogDataChanged || !catalogEventId) {
        console.log('adding new event to catalog from PS');
        const catalogResponse = await NPOBackend.post(`/catalog`, {
          title,
          host,
          description,
          eventType,
          subject,
          year,
          season
        });

        catalogEventId = catalogResponse.data.id;
      }

      // console.log(catalogEventId);

      //const dayInfo = await NPOBackend.get(`/day/${dayId}`);

      // Send a POST request to the appropriate backend route
      const publishedScheduleReponse = await NPOBackend.post('/published-schedule', {
        eventId: catalogEventId,
        dayId,
        confirmed: !tentative,
        startTime,
        endTime,
        cohort: year,
      });
      console.log(publishedScheduleReponse);
      const newPlannedEvent = new PlannedEvent(
        publishedScheduleReponse.id,
        title,
        convertTimeToMinutes(startTime),
        convertTimeToMinutes(endTime),
        host,
        tentative
      );
      setPlannedEvents([...plannedEvents.filter(e => e.id != -1), newPlannedEvent]);
      console.log("new planned events", plannedEvents);
      setFormData({tentative: false});

      reset();
      toast({
        title: 'Success!',
        description: 'Added event to day.',
        status: 'success',
        variant: 'subtle',
        position: 'top-right',
        containerStyle: {
          mt: '6rem',
        },
        duration: 3000,
        isClosable: true,
      });

      closeForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box borderRadius="5px">
      <form onSubmit={handleSubmit(submitData)}>
        <Box bgColor="white" borderRadius="5px" p="1rem">
          <Heading size="md" color="gray.600" mb="0.5rem">Event Information</Heading>
          <Box px="1rem">
            {/* TITLE */}
            <Box mb="1rem">
              <FormControl isInvalid={errors && errors.title} width="35vw">
                <FormLabel fontWeight="bold" color="gray.600">Event Name *</FormLabel>
                <Input
                  type="text" {...register('title')}
                  border="1px solid"
                  borderColor="gray.200"
                  defaultValue={eventData && eventData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
              </FormControl>
            </Box>

            {/* DESCRIPTION */}
            <Box mb="1rem">
              <FormControl isInvalid={errors && errors.description} width="35vw">
                <FormLabel fontWeight="bold" color="gray.600">Event Description</FormLabel>
                <Textarea {...register('description')} border="1px solid" borderColor="gray.200" defaultValue={eventData && eventData.description}/>
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <FormLabel fontWeight="bold" color="gray.600">Time</FormLabel>
            <Flex>
            {/* START TIME? */}
            <Box mb="1rem">
              <FormControl isInvalid={errors && errors.startTime}>
                  <Input
                      size="md"
                      type="time"
                      {...register('startTime')}
                      border="1px solid"
                      borderColor="gray.200"
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
                  <FormLabel fontWeight="bold" color="gray.600">Topic</FormLabel>
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
                  <FormLabel fontWeight="bold" color="gray.600">Host Name</FormLabel>
                  <Input
                    type="text"
                    {...register('host')}
                    border="1px solid"
                    borderColor="gray.200"
                    defaultValue={eventData && eventData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  />
                  <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </Box>

            <Heading size="md" color="gray.600">Event Status</Heading>
            <Box padding="1rem">
              {/* TENTATIVE */}
              <Box mb="1rem">
                <FormControl>
                  <Checkbox
                    {...register('tentative')}
                    onChange={() => setFormData({ ...formData, tentative: !formData.tentative })}
                  >
                    Tentative
                  </Checkbox>
                </FormControl>
              </Box>
            </Box>
        </Box>
        <Stack spacing={2} justifyContent="right" direction="row" pb="1.5rem" mt="0.5rem">
          <Button htype="submit" mt="1rem" mr="1rem" onClick={handleCancel}>Cancel</Button>
          <Button colorScheme="blue" type="submit" mt="1rem">Add Event</Button>
        </Stack>
      </form>
    </Box>
  );
};

AddEventToPublishedScheduleForm.propTypes = {
  closeForm: PropTypes.func,
  updateTimeline: PropTypes.func,
  eventData: PropTypes.object
};

export default AddEventToPublishedScheduleForm;

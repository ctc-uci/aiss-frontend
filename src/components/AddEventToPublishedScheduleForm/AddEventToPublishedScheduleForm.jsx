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

const AddEventToPublishedScheduleForm = ({ closeForm }) => {
  const { plannedEventsContext, dayId, editContext, currEventContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;
  const [eventData, setCurrEvent] = currEventContext;
  const [isEdit, setIsEdit] = editContext;
  const { filters, filterValues } = useSearchFilters();
  const [seasonFilter, yearFilter, subjectFilter, eventFilter] = filters;
  const [checkboxVal, setCheckboxVal] = useState(undefined);
  const [formData, setFormData] = useState({...eventData});

  useEffect(() => {
    if (Object.keys(eventData).length === 0) {
      setCheckboxVal(false);
      setFormData({});
      reset();
      setValue('description', '');
      return;
    }

    setValue('title', eventData.title);
    setValue('host', eventData.host);
    setValue('description', eventData.description);
    setFormData(eventData);
    if (!isEdit) {
      setCheckboxVal(false);
    } else {
      setCheckboxVal(eventData && eventData.confirmed !== null && !eventData.confirmed);
    }
    if (isEdit) {
      setValue('startTime', eventData.startTime);
      setValue('endTime', eventData.endTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  useEffect(() => {
    if (formData.startTime && formData.endTime && formData.startTime < formData.endTime) {
      // if (isEdit) {
      //   // setPlannedEvents([...plannedEvents.filter(e => e.id != -1 && e.id != eventData.id)]);
      // }
      const newPlannedEvent = new PlannedEvent(
        -1,
        formData.title,
        convertTimeToMinutes(formData.startTime),
        convertTimeToMinutes(formData.endTime),
        formData.host,
        checkboxVal ? true : false
      )
      setPlannedEvents([...plannedEvents.filter(e => e.id != -1 && e.id != eventData.id), newPlannedEvent]);
    } else {
      setPlannedEvents(plannedEvents.filter(e => e.id != -1));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const toast = useToast();
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    if (isEdit) {
      // let reAddedEvent = plannedEvents.filter(e => e.id == -1)[0];
      // reAddedEvent.id = eventData.id;
      const reAddedEvent = new PlannedEvent(
        eventData.id,
        eventData.title,
        convertTimeToMinutes(eventData.startTime),
        convertTimeToMinutes(eventData.endTime),
        eventData.host,
        !eventData.confirmed
      )
      setPlannedEvents([...plannedEvents.filter(e => e.id != -1), reAddedEvent]);
    } else {
      setPlannedEvents(plannedEvents.filter(e => e.id != -1));
    }
    setCurrEvent({});
    setIsEdit(false);
    closeForm();
  }

  const currentCatalogDataHasChanged = (originalData, currData) => {
    // keys: title,host,description,eventType,subject,year,season
    for (let key of Object.keys(currData)) {
      if (originalData[key] === undefined || originalData[key] !== currData[key]) {
        return true;
      }
    }
    return false;
  }

  const displayToast = () => {
    let toastTitle = 'Success!';
    let toastDescription = 'Added event to day.';
    if (isEdit) {
      toastTitle = 'Saved!';
      toastDescription = 'Changes to event were saved.';
    }

    toast({
      title: toastTitle,
      description: toastDescription,
      status: 'success',
      variant: 'subtle',
      position: 'top-right',
      containerStyle: {
        mt: '6rem',
      },
      duration: 3000,
      isClosable: true,
    });
  }

  const submitData = async (data) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { title, host, description, tentative, startTime, endTime } = data;
      const season = filterValues.season;
      const eventType = filterValues.eventType;
      const year = filterValues.year;
      const subject = filterValues.subject;
      console.log('submmitted data', data, season, eventType, year, subject);

      toast.closeAll();

      const catalogDataChanged = currentCatalogDataHasChanged(eventData, {
        title,
        host,
        description,
        eventType,
        subject,
        year,
        season
      });

      let catalogEventId = eventData.id;
      if(isEdit) {
        catalogEventId = eventData.eventId;
      }

      // not editing timeline event AND (changed catalog data OR is completely new event)
      if (!isEdit && (catalogDataChanged || !catalogEventId)) {
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

      let publishedScheduleReponse;
      let plannedEventId;
      if (isEdit) {
        if (catalogDataChanged) {
          const updateCatalog = await NPOBackend.put(`/catalog/${catalogEventId}`, {
            title, host, description, eventType, subject, year, season
          });
          catalogEventId = updateCatalog.data[0].id;
        }
        // Send a PUT request
        publishedScheduleReponse = await NPOBackend.put(`/published-schedule/${eventData.id}`, {
          eventId: catalogEventId,
          confirmed: !checkboxVal,
          startTime,
          endTime,
          cohort: year,
        });
        plannedEventId = eventData.id;
      } else {
        // Send a POST request to the appropriate backend route
        publishedScheduleReponse = await NPOBackend.post('/published-schedule', {
          eventId: catalogEventId,
          dayId,
          confirmed: !checkboxVal,
          startTime,
          endTime,
          cohort: year,
        });
        plannedEventId = publishedScheduleReponse.data.id;
      }
      const timelineEventsWithoutCurrent = plannedEvents.filter(e => (e.id != -1 && e.id != eventData.id));
      const newPlannedEvent = new PlannedEvent(
        plannedEventId,
        title,
        convertTimeToMinutes(startTime),
        convertTimeToMinutes(endTime),
        host,
        checkboxVal
      );
      setPlannedEvents([...timelineEventsWithoutCurrent, newPlannedEvent]);
      setFormData({tentative: false});

      reset();
      setCurrEvent({});

      displayToast();
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
              </FormControl>
            </Box>

            {/* DESCRIPTION */}
            <Box mb="1rem">
              <FormControl isInvalid={errors && errors.description} width="35vw">
                <FormLabel fontWeight="bold" color="gray.600">Event Description</FormLabel>
                <Textarea {...register('description')} border="1px solid" borderColor="gray.200"/>
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <FormLabel fontWeight="bold" color="gray.600">Time</FormLabel>
            <Flex justifyContent='left'>
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
                    isChecked={checkboxVal}
                    onChange={() => {
                      setCheckboxVal(!checkboxVal);
                      setFormData({ ...formData, tentative: checkboxVal });
                    }}
                  >
                    Tentative
                  </Checkbox>
                </FormControl>
              </Box>
            </Box>
        </Box>
        <Stack spacing={2} justifyContent="right" direction="row" pb="1.5rem" mt="0.5rem">
          <Button htype="submit" mt="1rem" mr="1rem" onClick={handleCancel}>Cancel</Button>
          <Button colorScheme="blue" type="submit" mt="1rem">{isEdit ? 'Save' : 'Add Event'}</Button>
        </Stack>
      </form>
    </Box>
  );
};

AddEventToPublishedScheduleForm.propTypes = {
  closeForm: PropTypes.func
};

export default AddEventToPublishedScheduleForm;

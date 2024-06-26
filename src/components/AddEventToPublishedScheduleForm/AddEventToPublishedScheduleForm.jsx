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
  HStack,
  useDisclosure,
  Spacer
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
import RemoveTimelineEventModal from '../Planner/RemoveTimelineEventModal';

const schema = yup.object({
  startTime: yup.string().required('Start time is required').test('is-after-7-am', 'Start time cannot be earlier than 7 AM', function(startTime) {
    return startTime && startTime >= "07:00";
  }),
  endTime: yup.string()
    .required('End time is required')
    .test('is-after', 'End time must be after start time', function(endTime) {
      const startTime = this.parent.startTime;
      return startTime && endTime && startTime < endTime;
    }).test('is-before-11-pm', 'End time must be earlier than 11 PM', function(endTime) {
      return endTime && endTime <= "23:00";
    }),
  subject: yup.array().min(1, 'Please select at least one subject').required(),
  eventType: yup.array().min(1, 'Please select at least one event type').required(),
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
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();

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
  }, [eventData]);

  useEffect(() => {
    if (formData.startTime && formData.endTime && formData.startTime < formData.endTime && formData.startTime >= "07:00" && formData.endTime <= "23:00") {
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
  }, [formData]);

  useEffect(() => {
    setValue('season', filterValues.season);
    setValue('year', filterValues.year);
    setValue('subject', filterValues.subject);
    setValue('eventType', filterValues.eventType);
  }, [filterValues]);

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
        mt: '3rem',
        mr: '2rem'
      },
      duration: 3000,
      isClosable: true,
    });
  }

  const submitData = async (data) => {
    try {
      const { title, host, description, startTime, endTime } = data;
      const season = filterValues.season;
      const eventType = filterValues.eventType;
      const year = filterValues.year;
      const subject = filterValues.subject;
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
      <form id="add-ps-event-form" onSubmit={handleSubmit(submitData)}>
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
                <FormControl isInvalid={errors && errors.subject}>
                  <FormLabel fontWeight="bold" color="gray.600">Subject *</FormLabel>
                  <Dropdown
                    options={subjectOptions}
                    filter={subjectFilter}
                    selected={filterValues.subject}
                    defaults={eventData && eventData.subject}
                    badgeColor="#E8D7FF"
                    width="28vw"
                  />
                  <FormErrorMessage>
                    {errors.subject && errors.subject.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              {/* EVENT TYPE */}
              <Box mb="1rem">
                <FormControl isInvalid={errors && errors.eventType}>
                  <FormLabel fontWeight="bold" color="gray.600">Event Type *</FormLabel>
                  <Dropdown
                    options={eventOptions}
                    filter={eventFilter}
                    selected={filterValues.eventType}
                    defaults={eventData && eventData.eventType}
                    badgeColor="#CFDCFF"
                    width="28vw"
                  />
                  <FormErrorMessage>
                    {errors.eventType && errors.eventType.message}
                  </FormErrorMessage>
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
      </form>
      <HStack spacing={2} pb="1.5rem" mt="0.5rem">
        {isEdit &&
          <Button variant="outline" mt="1rem" mr="1rem" onClick={onRemoveOpen}>Delete</Button>
        }
        <Spacer />
        <Button htype="submit" mt="1rem" mr="1rem" onClick={handleCancel}>Cancel</Button>
        <Button form="add-ps-event-form" colorScheme="blue" type="submit" mt="1rem">{isEdit ? 'Save' : 'Add Event'}</Button>
      </HStack>
      <RemoveTimelineEventModal onClose={onRemoveClose} isOpen={isRemoveOpen} deleteItemId={eventData.id ? eventData.id : -1} closeForm={closeForm}/>
    </Box>
  );
};

AddEventToPublishedScheduleForm.propTypes = {
  closeForm: PropTypes.func
};

export default AddEventToPublishedScheduleForm;

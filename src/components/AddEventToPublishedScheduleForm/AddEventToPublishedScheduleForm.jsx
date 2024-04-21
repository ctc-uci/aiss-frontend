/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormLabel,
  Input,
  FormControl,
  FormErrorMessage,
  Textarea,
  Checkbox,
  Heading,
  Flex,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  seasonOptions,
  yearOptions,
  subjectOptions,
  eventOptions,
} from '../Catalog/SearchFilter/filterOptions';
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

const AddEventToPublishedScheduleForm = ({ submitData, filterObj }) => {
  const { plannedEventsContext, editContext, currEventContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;
  const eventData = currEventContext;
  const isEdit = editContext;
  const { filters, filterValues } = filterObj;
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

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
        {/* <Stack spacing={2} justifyContent="right" direction="row" pb="1.5rem" mt="0.5rem">
          {isEdit &&
            <>
              <Button mt="1rem" variant='outline' onClick={onRemoveOpen}>Delete</Button>
              <Spacer />
            </>
          }
          <Button htype="submit" mt="1rem" mr="1rem" onClick={handleCancel}>Cancel</Button>
          <Button colorScheme="blue" type="submit" mt="1rem">{isEdit ? 'Save' : 'Add Event'}</Button>
        </Stack> */}
      </form>
    </Box>
  );
};

AddEventToPublishedScheduleForm.propTypes = {
  submitData: PropTypes.func,
  filterObj: PropTypes.object,
};

export default AddEventToPublishedScheduleForm;

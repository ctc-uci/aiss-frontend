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
    Select,
  } from '@chakra-ui/react';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useForm } from 'react-hook-form';
  import { useContext } from 'react';
  import { NPOBackend } from '../../utils/auth_utils';
  import { DayIdContext } from '../../pages/PublishedSchedule/AddDayContext';
  import * as yup from 'yup';
  
  const schema = yup.object({
      confirmed: yup.boolean().default(true).required("Confirmation required"),
      startTime: yup.date().required('Start time required'),
      endTime: yup.date().required('End time required').min(yup.ref('startTime'), 'End time must be after start time'),
      cohort: yup.number().required('Cohort required').min(2000),
      notes: yup.string().nullable()
  });
  
  
  const AddEventToPublishedScheduleForm = () => {
      const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });  


      const handleConfirmedChange = (e) => {
        setValue('confirmed', e.target.checked);
      };

      const { dayId } = useContext(DayIdContext);

      const submitData = async (data) => {
        try {
          const { title, host, eventType, subject, description, year, confirmed, startTime, endTime, notes } = data;
          let response;

          response = await NPOBackend.post(`/catalog`, {
            host: host,
            title: title,
            eventType,
            subject,
            description: description,
            year: year,
          });
          const catalogEventId = response.data.id

          const dayInfo = await NPOBackend.get(`/day/${dayId}`);

              // Format the start time and end time to remove the date component
          const formattedStartTime = new Date(startTime).toISOString().split('T')[1].slice(0, -1);
          const formattedEndTime = new Date(endTime).toISOString().split('T')[1].slice(0, -1);
    
          // Send a POST request to the appropriate backend route
          const response2 = await NPOBackend.post('/published-schedule', {
            eventId: catalogEventId,
            dayId: dayInfo['data'][0].id,
            confirmed,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            cohort: year,
            notes,
          });
          console.log(response2);
        } catch (error) {
          console.log(error);
        }
      };

      
      return (
        <Box p="2vw">
          <form onSubmit={handleSubmit(data => submitData(data))}>
  
            <Box mb="4vh">
      
              {/* TITLE */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.title} width="80%">
                  <FormLabel fontWeight="bold">Title</FormLabel>
                  <Textarea {...register('title')} border="1px solid" />
                  <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>
              </Box>
      
              {/* HOST */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.host} width="80%">
                  <FormLabel fontWeight="bold">Host</FormLabel>
                  <Textarea {...register('host')} border="1px solid" />
                  <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* EVENT TYPE*/}
              <Box mb="4vh">
                <FormControl width="47%">
                  <FormLabel fontWeight="bold">Event Type</FormLabel>
                  <Select {...register('eventType')}>
                    <option value="guest speaker">Guest Speaker</option>
                    <option value="study-trip">Study Trip</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </Select>
                  <FormErrorMessage>{errors.eventType && errors.eventType.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* SUBJECT */}
              <Box mb="4vh">
                <FormControl width="47%">
                  <FormLabel fontWeight="bold">Subject</FormLabel>
                  <Select {...register('subject')}>
                    <option value="life skills">Life Skills</option>
                    <option value="science">Science</option>
                    <option value="technology">Technology</option>
                    <option value="engineering">Engineering</option>
                    <option value="math">Math</option>
                    <option value="college readiness">College Readiness</option>
                  </Select>
                  <FormErrorMessage>{errors.subject && errors.subject.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* DESCRIPTION */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.description} width="47%">
                  <FormLabel fontWeight="bold">Description</FormLabel>
                  <Input
                    {...register('description')}
                    border="1px solid"
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              {/* YEAR */}
              <Box mb="4vh">
                <FormControl width="47%">
                  <FormLabel fontWeight="bold">Year</FormLabel>
                  <Select {...register('year')} >
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="both">Both</option>
                  </Select>
                  <FormErrorMessage>{errors.year && errors.year.message}</FormErrorMessage>
                </FormControl>
              </Box>
              
              {/* CONFIRMED?*/}
              <Box mb="4vh">
              <FormControl isInvalid={errors && errors.confirmed} width="47%">
                <FormLabel fontWeight="bold">Confirmed</FormLabel>
                <Checkbox defaultChecked onChange={handleConfirmedChange}>Confirmed?</Checkbox>
                <FormErrorMessage>{errors.confirmed && errors.confirmed.message}</FormErrorMessage>
              </FormControl>
             </Box>

              {/* START TIME? */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.startTime} width="80%">
                    <FormLabel fontWeight="bold">Start time</FormLabel>
                    <Input
                        size="md"
                        type="datetime-local"
                        {...register('startTime')}
                        border="1px solid"
                    />
                    <FormErrorMessage>{errors.startTime && errors.startTime.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* END TIME? */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.endTime} width="80%">
                    <FormLabel fontWeight="bold">End time</FormLabel>
                    <Input
                        size="md"
                        type="datetime-local"
                        {...register('endTime')}
                        border="1px solid"
                    />
                    <FormErrorMessage>{errors.endTime && errors.endTime.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* COHORT? */}
              {/*
              <Box mb="4vh">
              <FormControl isInvalid={errors && errors.cohort} width="47%">
                <FormLabel fontWeight="bold">Cohort</FormLabel>
                <Input {...register('cohort')} border="1px solid"/>
                <FormErrorMessage>{errors.cohort && errors.cohort.message}</FormErrorMessage>
              </FormControl>
             </Box>
      */}

              {/* NOTES? */}
              <Box mb="4vh">
              <FormControl isInvalid={errors && errors.notes} width="47%">
                <FormLabel fontWeight="bold">Notes</FormLabel>
                <Textarea {...register('notes')} border="1px solid"/>
                <FormErrorMessage>{errors.notes && errors.notes.message}</FormErrorMessage>
              </FormControl>
             </Box>    
  
            </Box>
  
            <Button type="submit">Submit</Button>
          </form>
        </Box>
      );
  }

  export default AddEventToPublishedScheduleForm;
import PropTypes from 'prop-types';
import {
  Box,
  FormLabel,
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { NPOBackend } from '../../utils/auth_utils';
import { DayIdContext } from '../../pages/PublishedSchedule/AddDayContext';

const schema = yup.object({
  // id: yup.string().required('ID required').max(10, 'ID exceeds 10 character limit'),
  host: yup.string().required('Host required').max(50, 'Host exceeds 50 character limit'),
  title: yup.string().required('Title required').max(50, 'Title exceeds 50 character limit'),
  eventType: yup.string().required('Email required'),
  subject: yup.string().required('Subject required'),
  description: yup
    .string()
    .required('Description required')
    .max(50, 'Description exceeds 50 character limit'),
  year: yup.string().required('Year required'),
});

const CreateEventForm = ({ eventData, setModified, closeModal }) => {
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

  const { dayId } = useContext(DayIdContext);

  const submitData = async data => {
    const { host, title, eventType, subject, description, year } = data;
    toast.closeAll();

    // make post request to catalog backend route
    try {
      let response;
      let id;
      if (eventData) {
        response = await NPOBackend.put(`/catalog/${eventData.id}`, {
          host: host,
          title: title,
          eventType: eventType,
          subject: subject,
          description: description, 
          year: year,
        });
        id = response.data[0].id
      } else {
        response = await NPOBackend.post(`/catalog`, {
          host: host,
          title: title,
          eventType: eventType,
          subject: subject,
          description: description,
          year: year,
        });
        //const catalogEventId = response.data.id
        //console.log(catalogEventId)
        console.log(dayId)
        // Extract the ID of the newly created event from the response
        //publishedScheduleResponse = await NPOBackend.get(`/published-schedule`);
        const dayInfo = await NPOBackend.get(`/day/${dayId}`);
        console.log("day id:", dayInfo)


        // // Now, add the event to the published_schedule
        // publishedScheduleResponse = await NPOBackend.post(`/published-schedule`, {
        //   eventId: catalogEventId, // Use the ID of the newly created event
        //   dayId: 45, // Assuming you have `dayId` available
        //   confirmed: true, // Example values, adjust as needed
        //   confirmedOn: "2017-06-15T07:00:00.000Z", // Example values, adjust as needed
        //   startTime: "01:06:27.010498", // Example values, adjust as needed
        //   endTime: "02:06:27.010498", // Example values, adjust as needed
        //   cohort: ["2024", "2025"], // Example values, adjust as needed
        //   notes: "generic", // Example values, adjust as needed
        // });
        // console.log(publishedScheduleResponse)
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
      if (setModified) {
        setModified(true);
      }
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

  return (
    <Box p="2vw">
      <form onSubmit={handleSubmit(data => submitData(data))}>
        <Box mb="4vh">
          {/* ID */}
          {/* <Box mb="4vh">
            <FormControl isInvalid={errors && errors.id} width="47%">
              <FormLabel fontWeight="bold">Id</FormLabel>
              <Input {...register('id')} border="1px solid" />
              <FormErrorMessage>{errors.id && errors.id.message}</FormErrorMessage>
            </FormControl>
          </Box> */}

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
    year: PropTypes.number,
    eventType: PropTypes.string,
    subject: PropTypes.string,
    description: PropTypes.string
  }),
  setModified: PropTypes.func,
  closeModal:PropTypes.func,
  dayId: PropTypes.number,
}

CreateEventForm.defaultProps = {
  eventData: undefined,
  setModified: undefined,
  closeModal: () => {},
};

export default CreateEventForm;

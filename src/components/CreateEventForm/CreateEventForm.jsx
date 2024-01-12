/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormLabel,
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// import axios from 'axios';
import * as yup from 'yup';

// const AISSBackend = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_HOST,
//   withCredentials: true,
// });

const schema = yup.object({
  id: yup.string().required('ID required').max(10, 'ID exceeds 10 character limit'),
  host: yup.string().required('Host required').max(50, 'Host exceeds 50 character limit'),
  title: yup.string().required('Title required').max(50, 'Title exceeds 50 character limit'),
  event_type: yup.string().required('Email required'),
  subject: yup.string().required('Subject required'),
  description: yup
    .string()
    .required('Description required')
    .max(50, 'Description exceeds 50 character limit'),
  year: yup.string().required('Year required'),
});

const CreateEventForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitData = async data => {
    console.log('function is being called');
    console.log(data);
  };

  return (
    <Box p="2vw">
      <form onSubmit={handleSubmit(data => submitData(data))}>
        <Box mb="4vh">
          {/* ID */}
          <Box mb="4vh">
            <FormControl isInvalid={errors && errors.id} width="47%">
              <FormLabel fontWeight="bold">Id</FormLabel>
              <Input {...register('id')} border="1px solid" />
              <FormErrorMessage>{errors.id && errors.id.message}</FormErrorMessage>
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
              <Select {...register('event_type')}>
                <option>Guest Speaker</option>
                <option>Study Trip</option>
                <option>Workshop</option>
                <option>Other</option>
              </Select>
              <FormErrorMessage>{errors.event_type && errors.event_type.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* SUBJECT */}
          <Box mb="4vh">
            <FormControl width="47%">
              <FormLabel fontWeight="bold">Subject</FormLabel>
              <Select {...register('subject')}>
                <option>Life Skills</option>
                <option>Science</option>
                <option>Technology</option>
                <option>Engineering</option>
                <option>Math</option>
                <option>College Readiness</option>
              </Select>
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

          {/* YEAR */}
          <Box mb="4vh">
            <FormControl width="47%">
              <FormLabel fontWeight="bold">Year</FormLabel>
              <Select {...register('year')}>
                <option>Junior</option>
                <option>Senior</option>
                <option>Both</option>
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
export default CreateEventForm;

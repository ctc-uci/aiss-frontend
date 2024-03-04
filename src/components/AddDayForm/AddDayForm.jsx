/* eslint-disable react/jsx-props-no-spreading */
import {
    Box,
    FormLabel,
    Input,
    FormControl,
    FormErrorMessage,
    Button,
    Textarea,
    useToast,
    HStack,
  } from '@chakra-ui/react';
  import { PropTypes } from 'prop-types';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useForm } from 'react-hook-form';
  // import axios from 'axios';
  import * as yup from 'yup';
import { NPOBackend } from '../../utils/auth_utils';
import { useContext } from 'react';
import { DayIdContext } from '../../pages/PublishedSchedule/AddDayContext';
    
  const schema = yup.object({
    // month: yup.number("Must be type number").required('Month required').min(2, "Must be 2 numbers.").max(2, "Must be 2 numbers."),
    // day: yup.number("Must be type number").required('Day required').min(2, "Must be 2 numbers.").max(2, "Must be 2 numbers."),
    // year: yup.number("Must be type number").required('Year required').min(1000, "Must be 4 numbers.").max(, "Must be 4 numbers."),
    date: yup.date().required('Date required'),
    location: yup.string().required('Location required').max(50, 'Location exceeds 50 character limit'),
    details: yup
      .string()
      .max(50, 'Details exceeds 50 character limit'),
  });
  
  const AddDayForm = ({ onClose, onOpen }) => {
    const { setDayId } = useContext(DayIdContext);

    const toast = useToast();
    const {
      handleSubmit,
      register,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    const submitData = async data => {
      const { date, details, location } = data;
      toast.closeAll();
      try {
        const payload = {
          eventDate: date,
          location: location,
          notes: details,
        };

        const response = await NPOBackend.post('/day/', payload);
        if (response.status === 201) {
          toast({
            title: 'add day!',
            description: `date: ${date}, description: ${details}, location: ${location}`,
            status: 'success',
            variant: 'subtle',
            position: 'bottom',
            containerStyle: {
            mt: '6rem',
            },
            duration: 3000,
            isClosable: true,
          });
          const id = response.data['id']
          setDayId(id);
          console.log(id);
          onOpen(id);
        } else {
          toast({
            title: 'Error Adding Day',
            description: `date: ${date}, description: ${details}, location: ${location}`,
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
        
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error Adding Day',
          description: error.response ? error.response.data.message : 'An error occurred',
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
    }
  
    return (
      <Box p="2vw">
        <form onSubmit={handleSubmit(data => submitData(data))}>
          <Box mb="4vh">
  
            {/* DATE */}
            <Box mb="4vh">
              <FormControl isInvalid={errors && errors.date} >
                <FormLabel fontWeight="bold">Date</FormLabel>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  {...register('date')}
                />
                <FormErrorMessage>{errors.date && errors.date.message}</FormErrorMessage>
              </FormControl>
            </Box>

            {/* LOCATION */}
            <Box mb="4vh">
              <FormControl isInvalid={errors && errors.location} >
                <FormLabel fontWeight="bold">Location</FormLabel>
                <Input placeholder='Location' {...register('location')} />
                <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
              </FormControl>
            </Box>


            {/* DETAILS */}
            <Box mb="4vh">
              <FormControl isInvalid={errors && errors.details}>
                <FormLabel fontWeight="bold">Details</FormLabel>
                <Textarea placeholder='Details' {...register('details')} />
                <FormErrorMessage>
                  {errors.details && errors.details.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Box>

          <HStack spacing='1vh'>
            <Button size='lg' onClick={onClose}>
                Cancel
            </Button>
            {/* <Button type='submit' size='lg'> */}
            <Button type='submit' size='lg' >
                Add To Schedule
            </Button>
          </HStack>
        </form>
      </Box>
    );
  };

  AddDayForm.propTypes = {
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  };
  AddDayForm.defaultProps = {
    onClose: () => {},
    onOpen: () => {},
  };
  export default AddDayForm;
  
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
    Heading,
    Flex
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { NPOBackend } from '../../utils/auth_utils';

const schema = yup.object({
  date: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required('Date required'),
  location: yup.string().required('Location required').max(50, 'Location exceeds 50 character limit'),
  details: yup
    .string()
    .max(50, 'Details exceeds 50 character limit'),
});

const AddDayForm = ({ onClose, onOpen, setDayId, dayData, setShouldDataRevalidate }) => {
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

      let response;
      if (dayData) {
        response = await NPOBackend.put(`/day/${dayData.id}`, payload);
        setShouldDataRevalidate(true);
      } else {
        response = await NPOBackend.post('/day/', payload);
      }
      console.log(response);
      if (response.status === 200 || response.status == 201) {
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
        const id = dayData ? dayData.id : response.data['id'];
        setDayId(id);

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
    <Box p="20px">
      <Heading size="lg" textAlign="center" mb="8px" color="#2D3748">{!dayData ? 'Add New Day' : 'Edit Day Details'}</Heading>
      <form onSubmit={handleSubmit(data => submitData(data))}>
        <Box mb="4vh">
          {/* DATE */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.date} >
              <FormLabel fontWeight="bold" color="gray.600">Date *</FormLabel>
              <Input
                size="md"
                type="date"
                {...register('date')}
                defaultValue={dayData && dayData.eventDate}
              />
              <FormErrorMessage>{errors.date && errors.date.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* LOCATION */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.location} >
              <FormLabel fontWeight="bold" color="gray.600">Location *</FormLabel>
              <Input placeholder='Location' {...register('location')} defaultValue={dayData && dayData.location}/>
              <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
            </FormControl>
          </Box>


          {/* DETAILS */}
          <Box mb="15px">
            <FormControl isInvalid={errors && errors.details}>
              <FormLabel fontWeight="bold" color="gray.600">Details</FormLabel>
              <Textarea placeholder='Details' {...register('details')} defaultValue={dayData && dayData.details}/>
              <FormErrorMessage>
                {errors.details && errors.details.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        <Flex justifyContent="space-between">
          <Button width="48%" size='lg' onClick={onClose}>
              Cancel
          </Button>
          <Button
            width="48%"
            type='submit'
            size='lg'
            bgColor="#2c93d1"
            color="white"
            _hover={{ bgColor: '#1b6896' }}
          >
            {!dayData ? '+ Add To Schedule' : 'Save Changes'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

AddDayForm.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  setDayId: PropTypes.func,
  dayData: PropTypes.object,
  setShouldDataRevalidate: PropTypes.func
};
AddDayForm.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
  dayData: null
};
export default AddDayForm;

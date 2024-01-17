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
    Editable,
    EditablePreview
  } from '@chakra-ui/react';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useForm } from 'react-hook-form';
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
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
  

    //   const [confirmed, { setConfirmed }] = useBoolean();

      return (
        <Box p="2vw">
          <form onSubmit={handleSubmit(data => console.log(data))}>
  
            <Box mb="4vh">
  
              {/* TITLE - non-editable*/}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.title} width="80%">
                    <FormLabel fontWeight="bold">Title</FormLabel>
                    <Editable defaultValue='Title Placeholder' isDisabled='true' border="1px solid"> 
                        <EditablePreview />
                    </Editable>
                    <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>
              </Box>
  
              {/* HOST - non-editable */}
              <Box mb="4vh">
                <FormControl isInvalid={errors && errors.host} width="80%">
                    <FormLabel fontWeight="bold">Host</FormLabel>
                    <Editable defaultValue='Host Placeholder' isDisabled='true' border="1px solid"> 
                        <EditablePreview />
                    </Editable>
                    <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
                </FormControl>
              </Box>
              
              {/* CONFIRMED?*/}
              <Box mb="4vh">
              <FormControl isInvalid={errors && errors.confirmed} width="47%">
                <FormLabel fontWeight="bold">Confirmed</FormLabel>
                <Checkbox defaultChecked onClick={register('confirmed').toggle}>Confirmed?</Checkbox>
                <FormErrorMessage>{errors.confirmed && errors.confirmed.message}</FormErrorMessage>
              </FormControl>
             </Box>

              {/* START TIME?*/}
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

              {/* END TIME?*/}
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

              {/* COHORT?*/}
              <Box mb="4vh">
              <FormControl isInvalid={errors && errors.cohort} width="47%">
                <FormLabel fontWeight="bold">Cohort</FormLabel>
                <Input {...register('cohort')} border="1px solid"/>
                <FormErrorMessage>{errors.cohort && errors.cohort.message}</FormErrorMessage>
              </FormControl>
             </Box>

              {/* NOTES?*/}
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
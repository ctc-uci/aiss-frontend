/* eslint-disable react/jsx-props-no-spreading */
import {
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
import * as yup from 'yup';
import styles from './CreateEventForm.module.css';


const schema = yup.object({
    id: yup.string().required('ID required').max(10, "ID exceeds 10 character limit"),
    host: yup.string().required('Host required').max(50, "Host exceeds 50 character limit"),
    title: yup.string().required('Title required').max(50, "Title exceeds 50 character limit"),
    event_type: yup.string().required('Email required'),
    subject: yup.string().required('Subject required'),
    description: yup.string().required('Description required').max(50, "Description exceeds 50 character limit"),
    year: yup.string().required('Year required'),
});


function CreateEventForm() {
    const {
      register,
    //   control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });


    return (
      <div className={styles['form-padding']}>
        {/* eslint-disable-next-line no-console */}
        {/* <form onSubmit={handleSubmit((data) => console.log(data))}> */}
        <form onSubmit={handleSubmit(data => console.log(data))}>
          <div className={styles['field-section']}>

            {/* ID */}
            <div className={styles.form}>
              <FormControl isInvalid={errors && errors.id} width="47%">
                <FormLabel className={styles.title}>Id</FormLabel>
                <Input {...register('id')} />
                <FormErrorMessage>{errors.id && errors.id.message}</FormErrorMessage>
              </FormControl>
            </div>

            {/* HOST */}
            <div className={styles.form}>
              <FormControl isInvalid={errors && errors.host} width="80%">
                  <FormLabel className={styles.title}>Host</FormLabel>
                  <Textarea {...register('host')} />
                  <FormErrorMessage>{errors.host && errors.host.message}</FormErrorMessage>
              </FormControl>
            </div>
            
            {/* TITLE */}
            <div className={styles.form}>
              <FormControl isInvalid={errors && errors.title} width="80%">
                  <FormLabel className={styles.title}>Title</FormLabel>
                  <Textarea {...register('title')} />
                  <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
              </FormControl>
            </div>

            {/* EVENT TYPE*/}
            <div className={styles.form}>
              <FormControl width="47%">
                <FormLabel className={styles.title}>Event Type</FormLabel>
                <Select {...register('event_type')}>
                  <option>Guest Speaker</option>
                  <option>Study Trip</option>
                  <option>Workshop</option>
                  <option>Other</option>
                </Select>
                <FormErrorMessage>{errors.event_type && errors.event_type.message}</FormErrorMessage>
              </FormControl>
            </div>

            {/* SUBJECT */}
            <div className={styles.form}>
              <FormControl width="47%">
                <FormLabel className={styles.title}>Subject</FormLabel>
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
            </div>

          {/* DESCRIPTION */}
            <div className={styles.form}>
              <FormControl isInvalid={errors && errors.description} width="47%">
                <FormLabel className={styles.title}>Description</FormLabel>
                <Input {...register('description')} />
                <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
              </FormControl>
            </div>

          {/* YEAR */}
          <div className={styles.form}>
            <FormControl width="47%">
              <FormLabel className={styles.title}>Year</FormLabel>
              <Select {...register('year')}>
                <option>Junior</option>
                <option>Senior</option>
                <option>Both</option>
              </Select>
              <FormErrorMessage>{errors.year && errors.year.message}</FormErrorMessage>
            </FormControl>
          </div>

        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
  
  export default CreateEventForm;
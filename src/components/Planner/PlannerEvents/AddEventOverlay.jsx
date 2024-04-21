import PropTypes from 'prop-types';
import { Button, HStack, Spacer, useDisclosure, useToast } from "@chakra-ui/react";
import AddEventToPublishedScheduleForm from "../../AddEventToPublishedScheduleForm/AddEventToPublishedScheduleForm";
import RemoveTimelineEventModal from "../RemoveTimelineEventModal";
import { useContext } from "react";
import { PlannerContext } from "../PlannerContext";
import PlannedEvent, { convertTimeToMinutes } from "../PlannedEvent";
import { NPOBackend } from "../../../utils/auth_utils";
import useSearchFilters from "../../Catalog/SearchFilter/useSearchFilters";

const AddEventOverlay = ({ closeForm }) => {
  const { currEventContext, dayId, editContext, plannedEventsContext } = useContext(PlannerContext);
  const [isEdit, setIsEdit] = editContext;
  const [eventData, setCurrEvent] = currEventContext;
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;
  const { filters, filterValues } = useSearchFilters();
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
  const toast = useToast();

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
          confirmed: !tentative,
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
          confirmed: !tentative,
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
        tentative
      );
      setPlannedEvents([...timelineEventsWithoutCurrent, newPlannedEvent]);
      // setFormData({tentative: false});

      setCurrEvent({});
      displayToast();
      closeForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AddEventToPublishedScheduleForm submitData={submitData} filterObj={{filters, filterValues}} />
      <HStack spacing={2} pb="1.5rem" mt="0.5rem">
        {isEdit &&
            <Button mt="1rem" variant='outline' onClick={onRemoveOpen}>Delete</Button>
        }
        <Spacer />
        <Button htype="submit" mt="1rem" mr="1rem" onClick={handleCancel}>Cancel</Button>
        <Button colorScheme="blue" form="add-ps-event-form" type="submit" mt="1rem">{isEdit ? 'Save' : 'Add Event'}</Button>
      </HStack>
      <RemoveTimelineEventModal isOpen={isRemoveOpen} onClose={onRemoveClose} deleteItemId={eventData.id ? eventData.id : -1} closeForm={closeForm} />
    </>
  )
}

AddEventOverlay.propTypes = {
  closeForm: PropTypes.func,
};

export default AddEventOverlay;

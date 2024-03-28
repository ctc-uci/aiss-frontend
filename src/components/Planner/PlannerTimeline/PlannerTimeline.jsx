import s from '../PlannerLayout.module.css';
import { useMemo, useContext, useEffect, useState } from 'react';
import { generateTimestamps, minutesInFormattedTime } from '../chrono';
import { Badge, Text, Box, IconButton, HStack, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { PlannerContext } from '../PlannerContext';
import PlannedEvent, { convertTimeToMinutes } from '../PlannedEvent';
import { NPOBackend } from '../../../utils/auth_utils';
import PropTypes from 'prop-types';
import RemoveTimelineEventModal from '../RemoveTimelineEventModal';

const PlannerTimeline = ({ setIsEditingEvent }) => {
  const { plannedEventsContext, dayId, currEventContext, editContext } = useContext(PlannerContext);
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  const setCurrEvent = currEventContext[1];
  const setIsEdit = editContext[1];
  const [eventHover, setEventHover] = useState(-1);
  const [deleteItemId, setDeleteItemId] = useState(-1);
  //const [addedEvents, setAddedEvents] = useState([]);

  const addedEvents = [];

  const fetchEditData = async (id) => {
    const publishedScheduleReponse = await NPOBackend.get(`/published-schedule/${id}`);
    const responseData = publishedScheduleReponse.data[0];
    if (responseData) {
      setCurrEvent(responseData);
    }
  }

  const startEditAndSetCurrEventId = (id) => {
    console.log('selected', id)
    setIsEditingEvent(true);
    setIsEdit(true);
    // setCurrEvent(id);
    fetchEditData(id);
  }

  const fetchDayInfo = async (id) => {
    const psEvents = await NPOBackend.get((`/published-schedule/dayId?dayId=${id}`));
    return psEvents.data.data;
  }

  useEffect(() => {
    // console.log('updating timeline!');
    updateTimeline();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTimeline = async () => {
    const psEvents = await fetchDayInfo(dayId);
    // console.log(psEvents);
    if (psEvents && psEvents[0].id) {
      setPlannedEvents(psEvents.map((data) => new PlannedEvent(
        data.id,
        data.title,
        convertTimeToMinutes(data.startTime),
        convertTimeToMinutes(data.endTime),
        data.host,
        !data.confirmed,
      )));
    }
  }

  // Memoize function call for time labels to increase efficiency between component re-renders
  const timelineBlocks = useMemo(() => {
    const timeStamps = generateTimestamps();

    return (
      <>
        {timeStamps.map((timeStampLabel, rowIndex) => {
          return (
            <div
              key={timeStampLabel}
              className={s['grid-hour-container']}
              style={{ gridRowStart: rowIndex + 1, gridColumn: '1/-1' }}
            >
              <div className={s['grid-hour-badge']}>
                <Badge backgroundColor="transparent">{timeStampLabel}</Badge>
              </div>
            </div>
          );
        })}
      </>
    );
  }, []);

  // console.log(plannedEvents);

  return (
    <div id={s['planner-timeline-container']}>
      <div className={`${s['timeline-grid']} ${s['gray-scrollbar-vertical']}`}>
        {timelineBlocks}
        {plannedEvents.map(plannedEvent => {
          // console.log(plannedEvent);
          const { id, name, startTime, endTime, hostName, isTentative } = plannedEvent;
          const gridStyles = plannedEvent.calculateGridStyles(addedEvents);
          addedEvents.push({startTime, endTime});

          const formattedStartTime = minutesInFormattedTime(startTime);
          const formattedEndTime = minutesInFormattedTime(endTime);

          let border_color = '#2B93D1';
          let background_color = '#BEE3F8';
          let border_style = 'none none none solid';
          const border_width = '2px 2px 2px 10px'

          if (isTentative) {
            border_color = '#F69052';
            background_color = '#FEF1DC';
          }

          if (id == -1 && !isTentative) {
            border_style = 'dashed dashed dashed solid';
            background_color = '#eaf8ff';
          } else if (id == -1 && isTentative) {
            border_style = 'dashed dashed dashed solid';
            background_color = '#fffaf0';
          }

          return (
            <div key={id} style={gridStyles} className={s['timeline-event-wrapper']}>
              <Box
                className={s['timeline-event-container']}
                bg={background_color}
                borderColor={border_color}
                borderStyle={border_style}
                borderWidth={border_width}
                onMouseEnter={() => setEventHover(id)}
                onMouseLeave={() => setEventHover(-1)}
              >
                <HStack justifyContent='space-between'>
                  <Box>
                    <Text fontSize="sm" fontWeight="600">
                      {name}
                    </Text>
                    <Text fontSize="sm">
                      <span>{formattedStartTime}</span> - <span>{formattedEndTime}</span>
                    </Text>
                    <Text fontSize="xs">
                      {hostName}
                    </Text>
                  </Box>
                  {id == eventHover &&
                    <Box position="absolute" top="0.5rem" right="0.5rem" zIndex={1}>
                      <IconButton
                        isRound={true}
                        icon={<EditIcon />}
                        onClick={() => startEditAndSetCurrEventId(id)}
                        size="sm"
                      />
                      <IconButton
                        ml='0.5rem' isRound={true}
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setDeleteItemId(id);
                          onRemoveOpen();
                        }}
                        size="sm"
                      />
                      {/* <RemoveTimelineEventModal isOpen={isRemoveOpen} onClose={onRemoveClose} deleteItemId={id}/> */}
                    </Box>
                  }
                </HStack>
              </Box>
            </div>
          );
        })}
        <RemoveTimelineEventModal isOpen={isRemoveOpen} onClose={onRemoveClose} deleteItemId={deleteItemId}/>
      </div>
    </div>
  );
};

PlannerTimeline.propTypes = {
  setIsEditingEvent: PropTypes.func
}
export default PlannerTimeline;

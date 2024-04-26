import s from '../PlannerLayout.module.css';
import { useMemo, useContext, useEffect } from 'react';
import { generateTimestamps, minutesInFormattedTime } from '../chrono';
import { Badge, Text, Box, HStack } from '@chakra-ui/react';
import { PlannerContext } from '../PlannerContext';
import PlannedEvent, { convertTimeToMinutes } from '../PlannedEvent';
import { NPOBackend } from '../../../utils/auth_utils';


const PlannerTimeline = () => {
  const { plannedEventsContext, dayId, currEventContext, editContext } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  const [eventData, setCurrEvent] = currEventContext;
  const [isEdit, setIsEdit] = editContext;

  const addedEvents = [];

  const fetchEditData = async (id) => {
    const publishedScheduleReponse = await NPOBackend.get(`/published-schedule/${id}`);
    const responseData = publishedScheduleReponse.data[0];
    if (responseData) {
      setCurrEvent(responseData);
    }
  }

  const startEditAndSetCurrEventId = (id) => {
    // console.log('selected', id);
    if (isEdit) {
      // add back the original state of the currently edited event
      const reAddedEvent = new PlannedEvent(
        eventData.id,
        eventData.title,
        convertTimeToMinutes(eventData.startTime),
        convertTimeToMinutes(eventData.endTime),
        eventData.host,
        !eventData.confirmed
      )
      setPlannedEvents([...plannedEvents.filter(e => e.id != -1), reAddedEvent]);
    }
    setIsEdit(true);
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
          let text_color = '#1A202C';
          let hover_text_color = '#171923';
          let background_color = '#BEE3F8';
          let hover_background_color = '#90CDF4';
          let border_style = 'solid solid solid solid';
          const border_width = '1px 1px 1px 10px'

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
                color={text_color}
                _hover={{ bg: hover_background_color, color: hover_text_color, cursor: "pointer" }}
                borderColor={border_color}
                borderStyle={border_style}
                borderWidth={border_width}
                onClick={() => startEditAndSetCurrEventId(id)}
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
                </HStack>
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlannerTimeline;

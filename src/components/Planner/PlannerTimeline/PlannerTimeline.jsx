import s from '../PlannerLayout.module.css';
import { useMemo, useContext, useEffect } from 'react';
import { generateTimestamps, minutesInFormattedTime } from '../chrono';
import { Badge, Text, Box } from '@chakra-ui/react';
import { PlannerContext } from '../PlannerContext';
import PlannedEvent, { convertTimeToMinutes } from '../PlannedEvent';
import { NPOBackend } from '../../../utils/auth_utils';

const PlannerTimeline = () => {
  const { plannedEventsContext, dayId } = useContext(PlannerContext);
  const [plannedEvents, setPlannedEvents] = plannedEventsContext;

  // useEffect((events) => {
  //   // if (dayId) {
  //   //   fetchDayInfo(dayId);
  //   // }

  //   console.log(events);
  //   // TODO: receive planned events via props and translate them here
  //   setPlannedEvents([
  //     new PlannedEvent(
  //       'sample-1',
  //       'Sample Event 1',
  //       MINUTES_PER_HOUR * 9.5,
  //       MINUTES_PER_HOUR * 10.5,
  //       false,
  //     ),
  //     new PlannedEvent(
  //       'sample-2',
  //       'Sample Event 2',
  //       MINUTES_PER_HOUR * 11,
  //       MINUTES_PER_HOUR * 13,
  //       false,
  //     ),
  //     new PlannedEvent(
  //       'sample-3',
  //       'Sample Event 3',
  //       MINUTES_PER_HOUR * 13.5,
  //       MINUTES_PER_HOUR * 16,
  //       false,
  //     ),
  //   ]);

  //   // Sample Events:
  //   // sample-1:  9:30 - 10:30
  //   // sample-2:  11:00 - 1:00
  //   // sample-3:  13:30 - 16:00
  // }, [setPlannedEvents]);

  const fetchDayInfo = async (id) => {
    const psEvents = await NPOBackend.get((`/published-schedule/dayId?dayId=${id}`));
    return psEvents.data.data;
  }

  useEffect(() => {
    // console.log('updating timeline!');
    updateTimeline();
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

  return (
    <div id={s['planner-timeline-container']}>
      <div className={`${s['timeline-grid']} ${s['gray-scrollbar-vertical']}`}>
        {timelineBlocks}
        {plannedEvents.map(plannedEvent => {
          // console.log(plannedEvent);
          const { id, name, startTime, endTime, hostName, isTentative } = plannedEvent;
          const gridStyles = plannedEvent.calculateGridStyles();

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
                borderRadius="7"
                borderColor={border_color}
                borderStyle={border_style}
                borderWidth={border_width}
              >
                <Text fontSize="sm" fontWeight="600">
                  {name}
                </Text>
                <Text fontSize="sm">
                  <span>{formattedStartTime}</span> - <span>{formattedEndTime}</span>
                </Text>
                <Text fontSize="sm">
                  {hostName}
                </Text>
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlannerTimeline;

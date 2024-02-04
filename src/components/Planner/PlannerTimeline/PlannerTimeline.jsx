import s from '../PlannerLayout.module.css';
import { useMemo } from 'react';
import { generateTimestamps } from '../chrono';
import { Badge } from '@chakra-ui/react';

const PlannerTimeline = () => {
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
        <div
          style={{ gridRowStart: 2, gridColumnStart: 2, backgroundColor: 'pink', borderRadius: 4 }}
        >
          hellos
        </div>
        <div
          style={{ gridRowStart: 4, gridColumnStart: 2, backgroundColor: 'pink', borderRadius: 4 }}
        >
          hellos!
        </div>
        <div
          style={{ gridRowStart: 6, gridColumnStart: 2, backgroundColor: 'pink', borderRadius: 4 }}
        >
          hellos!!
        </div>
      </div>
    </div>
  );
};

export default PlannerTimeline;

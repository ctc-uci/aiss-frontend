import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';
import { PlannerContextProvider } from './PlannerContext';
import { useState } from 'react';

const PlannerLayout = () => {

  const [updateTimelineCount, setUpdateTimeline] = useState(0);

  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider>
        <PlannerTimeline updateTimelineCount={updateTimelineCount}/>
        <PlannerEvents updateTimelineCount={updateTimelineCount} setUpdateTimelineFunc={setUpdateTimeline}/>
      </PlannerContextProvider>
    </main>
  );
};

export default PlannerLayout;

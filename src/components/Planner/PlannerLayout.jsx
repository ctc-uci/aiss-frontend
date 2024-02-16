import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';
import { PlannerContextProvider } from './PlannerContext';

const PlannerLayout = () => {
  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider>
        <PlannerTimeline />
        <PlannerEvents/>
      </PlannerContextProvider>
    </main>
  );
};

export default PlannerLayout;
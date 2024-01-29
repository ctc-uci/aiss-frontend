import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';

const PlannerLayout = () => {
  return (
    <main id={s['planner-page-layout']}>
      <PlannerTimeline />
      <PlannerEvents />
    </main>
  );
};

export default PlannerLayout;

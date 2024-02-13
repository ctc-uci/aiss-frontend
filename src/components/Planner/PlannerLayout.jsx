import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
// import PlannerEvents from './PlannerEvents/PlannerEvents';
// import AddEventOverlay from './PlannerEvents/AddEventOverlay';
import { PlannerContextProvider } from './PlannerContext';
import Catalog from '../../pages/Catalog/Catalog.jsx'

const PlannerLayout = () => {
  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider>
        <PlannerTimeline />
        {/* <AddEventOverlay /> */}
        <Catalog />
      </PlannerContextProvider>
    </main>
  );
};

export default PlannerLayout;
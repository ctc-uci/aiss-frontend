import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';
import { PlannerContextProvider } from './PlannerContext';
import PropTypes from 'prop-types';

const PlannerLayout = ({ dayId, onClose }) => {

  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider dayId={dayId}>
        <PlannerTimeline />
        <PlannerEvents onClose={onClose}/>
      </PlannerContextProvider>
    </main>
  );
};

PlannerLayout.propTypes = {
  dayId: PropTypes.number,
  onClose: PropTypes.func,
};

export default PlannerLayout;

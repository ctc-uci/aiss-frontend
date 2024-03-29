import PlannerLayout from '../../components/Planner/PlannerLayout';
import PropTypes from 'prop-types';

const Planner = ({ dayId }) => {
  return (
    <>
      <PlannerLayout dayId={dayId}/>
    </>
  );
};

Planner.propTypes = {
  dayId: PropTypes.number,
};

export default Planner;

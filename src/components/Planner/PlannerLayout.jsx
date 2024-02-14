import {
  VStack
} from '@chakra-ui/react'
import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';
import { PlannerContextProvider } from './PlannerContext';
import Catalog from '../../pages/Catalog/Catalog.jsx'

const PlannerLayout = () => {
  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider>
        <PlannerTimeline />
        <VStack>
          <PlannerEvents/>
          <Catalog />
        </VStack>
      </PlannerContextProvider>
    </main>
  );
};

export default PlannerLayout;
import { useCheckboxGroup } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

const useSearchFilters = () => {
  const seasonFilter = useCheckboxGroup({ defaultValue: [] });
  const yearFilter = useCheckboxGroup({ defaultValue: [] });
  const subjectFilter = useCheckboxGroup({ defaultValue: [] });
  const eventFilter = useCheckboxGroup({ defaultValue: [] });

  const filters = useMemo(() => {
    return [seasonFilter, yearFilter, subjectFilter, eventFilter];
  }, [eventFilter, seasonFilter, subjectFilter, yearFilter]);

  const filterValues = useMemo(() => {
    return {
      season: seasonFilter.value,
      year: yearFilter.value,
      subject: subjectFilter.value,
      eventType: eventFilter.value,
    };
  }, [eventFilter.value, seasonFilter.value, subjectFilter.value, yearFilter.value]);

  const clearFilters = useCallback(() => {
    filters.forEach(filter => {
      filter.setValue([]);
    });
  }, [filters]);

  return {
    filters,
    filterValues,
    clearFilters,
  };
};

export default useSearchFilters;

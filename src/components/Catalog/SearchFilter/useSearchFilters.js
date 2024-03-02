import { useCheckboxGroup } from '@chakra-ui/react';

const useSearchFilters = () => {
  const seasonFilter = useCheckboxGroup({ defaultValue: [] });
  const yearFilter = useCheckboxGroup({ defaultValue: [] });
  const subjectFilter = useCheckboxGroup({ defaultValue: [] });
  const eventFilter = useCheckboxGroup({ defaultValue: [] });

  const filters = [seasonFilter, yearFilter, subjectFilter, eventFilter];

  const clearFilters = () => {
    filters.forEach(filter => {
      filter.setValue([]);
    });
  };

  return {
    filters,
    clearFilters,
  };
};

export default useSearchFilters;

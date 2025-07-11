import {useState} from 'react';

export const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState({});

  const getQueryObject = () => {
    return {...queryParams};
  };

  const updateQueryParams = params => {
    setQueryParams(prev => {
      const newParams = {...prev};

      // Remove undefined values
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
          delete newParams[key];
        } else {
          newParams[key] = value;
        }
      });

      // Auto set sortBy/minFollowers if not set
      const isAddingSortParams = !newParams.sortBy || !newParams.sortOrder;
      const isExplicitlySettingSort = params.sortBy || params.sortOrder;

      if (isAddingSortParams && !isExplicitlySettingSort) {
        newParams.sortBy = 'minFollowers';
        newParams.sortOrder = 'asc';
      }

      return newParams;
    });
  };

  return {getQueryObject, updateQueryParams};
};

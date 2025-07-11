// import {UpTrendLineSVG} from '@/utils/icons/icons';
import {
  BARTER,
  FILTER_CONFIG,
  barterNavTabs,
  offerNavTabs,
} from '../filterOptions';
import {useQueryParams} from './useQueryParams';

export const useFilters = selectedIndex => {
  const {getQueryObject, updateQueryParams} = useQueryParams();
  const filterParams = getQueryObject();

  const getAppliedFilters = () => {
    const params = {...filterParams};
    const combinedFilters = [];

    (selectedIndex === BARTER ? barterNavTabs : offerNavTabs).forEach(item => {
      delete params[item.key];
    });

    // Check if sorting was explicitly set by the user (not automatically added)
    const hasExplicitSorting = params.sortBy && params.sortOrder;
    const isAutoSorting =
      params.sortBy === 'minFollowers' && params.sortOrder === 'asc';
    const isDefaultSorting =
      params.sortBy === 'campaignScore' && params.sortOrder === 'desc';

    // Only show sorting in filters if it was explicitly set by user and not auto/default sorting
    if (!hasExplicitSorting || isAutoSorting || isDefaultSorting) {
      delete params.sortBy;
      delete params.sortOrder;
    }

    // Handle followers filter
    if ('minFollowers' in filterParams || 'maxFollowers' in filterParams) {
      const min = filterParams.minFollowers;
      const max = filterParams.maxFollowers;
      const config = FILTER_CONFIG.followers;

      let followersValue = '';
      if (min && max) {
        followersValue = `${min}-${max}`;
      } else if (min) {
        followersValue = `${min}+`;
      } else if (max) {
        followersValue = `<${max}`;
      }

      combinedFilters.push({
        realKeys: ['minFollowers', 'maxFollowers'],
        displayKey: config.key,
        value: followersValue,
        prefix: config.prefix,
      });
      delete params.minFollowers;
      delete params.maxFollowers;
    }

    const specificFilters = [
      {key: 'offerPercentage', config: FILTER_CONFIG.offer},
      {key: 'city', config: FILTER_CONFIG.city},
      {key: 'categories', config: FILTER_CONFIG.categories},
      {key: 'uptoAmount', config: FILTER_CONFIG.uptoAmount},
      {key: 'hasFastApproval', config: FILTER_CONFIG.hasFastApproval},
      {key: 'isNegotiable', config: FILTER_CONFIG.isNegotiable},
      {key: 'autoRequestApproval', config: FILTER_CONFIG.autoRequestApproval},
      {key: 'allowedGuests', config: FILTER_CONFIG.allowedGuests},
      {key: 'state', config: FILTER_CONFIG.state},
    ];

    // Only add sortBy to specificFilters if it's explicitly set by user and not auto/default sorting
    if (hasExplicitSorting && !isAutoSorting && !isDefaultSorting) {
      specificFilters.push({key: 'sortBy', config: FILTER_CONFIG.sortBy});
    }

    specificFilters.forEach(({key, config}) => {
      if (key in filterParams) {
        const value = filterParams[key];
        combinedFilters.push({
          realKeys: [key],
          displayKey: config.key,
          value: config.format(value),
          prefix: config.prefix,
        });
        delete params[key];
      }
    });

    Object.entries(params).forEach(([key, value]) => {
      const config = FILTER_CONFIG[key] || {
        key: key.charAt(0).toUpperCase() + key.slice(1),
        format: val => (Array.isArray(val) ? val.join(', ') : val),
        // prefix: <UpTrendLineSVG />,
      };

      combinedFilters.push({
        realKeys: [key],
        displayKey: config.key,
        value: config.format(value),
        prefix: config.prefix,
      });
    });

    return combinedFilters;
  };

  return {filterParams, updateQueryParams, getAppliedFilters};
};

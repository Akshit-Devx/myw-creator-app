import React, {useCallback} from 'react';
import {Text, ScrollView, TouchableOpacity} from 'react-native';

import {Icons} from '../../../assets/icons';
import {FilterLocationSVG} from '../../../utility/icons';
import AvgViewsFilterModal from '../../modals/AvgViewsFilterModal';
import LocationFilterModal from '../../modals/LocationFilterModal';
import {allStateOptions, cityOptions} from '../../../utility/common';
import DeliverablesDropdownModal from '../../modals/DeliverablesDropdownModal';

const Filters = ({
  setFiltersParams,
  filtersParams,
  isProductSection = false,
}) => {
  const handleFilterParams = useCallback(
    (filterKey, value) => {
      setFiltersParams(prev => {
        const newParams = {
          ...prev,
          [filterKey]:
            value === null || value === undefined || value === false
              ? undefined
              : value,
        };

        // Remove any keys with null/undefined values
        Object.keys(newParams).forEach(key => {
          if (
            newParams[key] === null ||
            newParams[key] === undefined ||
            newParams[key] === false
          ) {
            delete newParams[key];
          }
        });

        return newParams;
      });
    },
    [setFiltersParams],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{flexDirection: 'row', gap: 10}}>
      <AvgViewsFilterModal
        placeholder="Follower Range"
        onApply={value => {
          Object.keys(value).forEach(key => {
            value[key] && handleFilterParams(key, value[key]);
          });
        }}
        onClear={value => {
          Object.keys(value).forEach(key => {
            handleFilterParams(key, null);
          });
        }}
        selected={
          filtersParams.minFollowers || filtersParams.maxFollowers
            ? {
                minFollowers: filtersParams.minFollowers,
                maxFollowers: filtersParams.maxFollowers,
              }
            : null
        }
        icon={<Icons.IgFillIcon width={18} height={18} />}
      />
      {!isProductSection && (
        <LocationFilterModal
          data={cityOptions}
          placeholder="City"
          onSelect={data => {
            handleFilterParams('city', data?.value);
          }}
          selected={filtersParams.city}
        />
      )}
      {!isProductSection && (
        <LocationFilterModal
          data={allStateOptions}
          onSelect={data => {
            handleFilterParams('state', data?.value);
          }}
          selected={filtersParams.state}
          placeholder="State"
          icon={<FilterLocationSVG size={18} />}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          handleFilterParams(
            'hasFastApproval',
            !filtersParams?.hasFastApproval,
          );
        }}
        className={`border rounded-lg py-[10] px-[14] flex-row gap-[4] ${
          filtersParams.hasFastApproval
            ? 'border-blue-500 bg-blue-50'
            : 'border-neutral-400'
        }`}>
        <Icons.ClockIcon width={18} height={18} />
        <Text className="text-neutral-800 text-sm ml-[4]">Fast Approval</Text>
      </TouchableOpacity>
      <DeliverablesDropdownModal
        placeholder="Deliverables"
        onSelect={data => {
          Object.keys(data).forEach(key => {
            handleFilterParams(key, data[key]);
          });
        }}
      />
    </ScrollView>
  );
};

export default Filters;

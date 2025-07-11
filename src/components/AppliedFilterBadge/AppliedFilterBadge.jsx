import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {formatFilterDisplay} from '../Filters/filterHelpers';

const AppliedFilterBadge = ({filter, onRemove}) => {
  return (
    <TouchableOpacity
      onPress={onRemove}
      className="bg-blue-100 rounded-xl px-4 py-1 flex-row  items-center border border-blue-500">
      {formatFilterDisplay(filter)}
      <Text>*</Text>
      {/* <CloseOutlineSVG width={16} height={16} color="#64748B" /> */}
    </TouchableOpacity>
  );
};

export default AppliedFilterBadge;

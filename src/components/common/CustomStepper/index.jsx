import React from 'react';
import {View, Text} from 'react-native';

import {twMerge} from 'tailwind-merge';

const CustomStepper = ({steps, currentStep, className = ''}) => {
  const stepsToUse = steps || [];

  const currentStepIndex = stepsToUse.findIndex(
    step => step.value === currentStep,
  );

  return (
    <View className="flex-row px-2">
      {stepsToUse?.map((step, index) => (
        <View key={index} className="flex-col gap-1 items-center flex-1">
          <View
            className={twMerge(
              `w-6 h-6 rounded-full bg-white border z-10 border-[#406AFF] ${
                index <= currentStepIndex ? 'bg-[#406AFF]' : ''
              }`,
            )}
          />
          <Text
            className={twMerge(`text-sm ${
              index <= currentStepIndex
                ? 'text-neutral-800 font-bold'
                : 'text-neutral-400 font-normal'
            }`)}>
            {step.label}
          </Text>
          {index < stepsToUse.length - 1 && (
            <View className="h-[1] flex-1 bg-[#406AFF] w-full absolute top-3 left-2/4" />
          )}
        </View>
      ))}
    </View>
  );
};

export default CustomStepper;

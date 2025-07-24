import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

const StepIcon = ({
  stepNumber,
  status,
  customIcon,
  iconClassName,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base',
    xl: 'w-10 h-10 text-lg',
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'completed':
        return 'bg-blue-600 border-blue-600';
      case 'active':
        return 'bg-blue-600 border-blue-600';
      case 'error':
        return 'bg-red-500 border-red-500';
      case 'warning':
        return 'bg-yellow-500 border-yellow-500';
      default:
        return 'bg-gray-300 border-gray-300';
    }
  };

  const getTextColor = () => {
    return status === 'pending' ? 'text-gray-600' : 'text-white';
  };

  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (status) {
      case 'completed':
        return '';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return stepNumber;
    }
  };

  return (
    <View
      className={`
      ${sizeClasses[size]} 
      ${getStatusClasses()} 
      rounded-full 
      border-2 
      items-center 
      justify-center
      ${iconClassName || ''}
    `}>
      <Text className={`font-bold ${getTextColor()}`}>{getIcon()}</Text>
    </View>
  );
};

const StepConnector = ({
  isLast,
  status,
  nextStatus,
  connectorClassName,
  height = 40,
}) => {
  if (isLast) return null;

  const getConnectorColor = () => {
    if (status === 'completed') return 'bg-blue-600';
    if (
      status === 'active' &&
      (nextStatus === 'completed' || nextStatus === 'active')
    ) {
      return 'bg-blue-600';
    }
    return 'bg-gray-300';
  };

  return (
    <View
      className={`w-0.5 ${getConnectorColor()} ${connectorClassName || ''}`}
      style={{height}}
    />
  );
};

const Step = ({
  step,
  index,
  isLast,
  nextStep,
  onStepPress,
  stepIconSize,
  connectorHeight,
  showContent = true,
  className,
  headerClassName,
  contentClassName,
  iconClassName,
  connectorClassName,
}) => {
  const {
    title,
    description,
    content,
    status = 'pending',
    customIcon,
    disabled = false,
    optional = false,
  } = step;

  const handlePress = () => {
    if (!disabled && onStepPress) {
      onStepPress(index, step);
    }
  };

  return (
    <View className={`flex-row ${className || ''}`}>
      {/* Step Icon and Connector */}
      <View className="items-center">
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}>
          <StepIcon
            stepNumber={index + 1}
            status={status}
            customIcon={customIcon}
            iconClassName={iconClassName}
            size={stepIconSize}
          />
        </TouchableOpacity>

        <StepConnector
          isLast={isLast}
          status={status}
          nextStatus={nextStep?.status}
          connectorClassName={connectorClassName}
          height={connectorHeight}
        />
      </View>

      {/* Step Content */}
      <View className={`flex-1 ml-4 pb-6 ${headerClassName || ''}`}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}>
          <View className="flex-row items-center">
            <Text className={`text-lg font-semibold`}>{title}</Text>
            {optional && (
              <Text className="text-xs text-gray-400 ml-2 italic">
                (Optional)
              </Text>
            )}
          </View>

          {description && (
            <Text className={`text-md mt-1 text-gray-600`}>{description}</Text>
          )}
        </TouchableOpacity>

        {/* Step Content */}
        {showContent && content && status === 'active' && (
          <View className={`mt-3 ${contentClassName || ''}`}>{content}</View>
        )}
      </View>
    </View>
  );
};

const VerticalStepper = ({
  steps = [],
  currentStep = 0,
  onStepPress,
  showContent = true,
  stepIconSize = 'md',
  connectorHeight = 52,
  className,
  stepClassName,
  headerClassName,
  contentClassName,
  iconClassName,
  connectorClassName,
  scrollable = true,
  scrollViewProps = {},
}) => {
  // Auto-calculate status based on currentStep if not provided
  const processedSteps = steps.map((step, index) => ({
    ...step,
    status:
      step.status ||
      (index < currentStep
        ? 'completed'
        : index === currentStep
        ? 'active'
        : 'pending'),
  }));

  const StepperContent = () => (
    <View className={`p-4 ${className || ''}`}>
      {processedSteps.map((step, index) => (
        <Step
          key={step.id || index}
          step={step}
          index={index}
          isLast={index === processedSteps.length - 1}
          nextStep={processedSteps[index + 1]}
          onStepPress={onStepPress}
          stepIconSize={stepIconSize}
          connectorHeight={connectorHeight}
          showContent={showContent}
          className={stepClassName}
          headerClassName={headerClassName}
          contentClassName={contentClassName}
          iconClassName={iconClassName}
          connectorClassName={connectorClassName}
        />
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView {...scrollViewProps}>
        <StepperContent />
      </ScrollView>
    );
  }

  return <StepperContent />;
};

// Helper component for common step content patterns
const StepContent = ({children, className}) => (
  <View
    className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${
      className || ''
    }`}>
    {children}
  </View>
);

// Progress indicator component
const StepperProgress = ({
  steps,
  currentStep,
  className,
  showPercentage = true,
}) => {
  const completedSteps = steps.filter((_, index) => index < currentStep).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <View className={`mb-4 ${className || ''}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">Progress</Text>
        {showPercentage && (
          <Text className="text-sm text-gray-600">{Math.round(progress)}%</Text>
        )}
      </View>
      <View className="w-full bg-gray-200 rounded-full h-2">
        <View
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{width: `${progress}%`}}
        />
      </View>
    </View>
  );
};

export default VerticalStepper;
export {StepContent, StepperProgress};

// Usage Examples:

// Basic Stepper
/*
const basicSteps = [
  {
    id: 'step1',
    title: 'Personal Information',
    description: 'Enter your basic details',
  },
  {
    id: 'step2',
    title: 'Address Details',
    description: 'Provide your address information',
  },
  {
    id: 'step3',
    title: 'Review & Submit',
    description: 'Review and confirm your information',
  },
];

<VerticalStepper
  steps={basicSteps}
  currentStep={1}
  onStepPress={(index, step) => console.log('Step pressed:', index, step)}
/>
*/

// Advanced Stepper with Custom Content
/*
const [currentStep, setCurrentStep] = useState(0);

const advancedSteps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    content: (
      <StepContent>
        <Text className="text-gray-700 mb-2">Enter your details:</Text>
        <View className="space-y-2">
          <Text className="text-sm text-gray-600">• Full Name</Text>
          <Text className="text-sm text-gray-600">• Email Address</Text>
          <Text className="text-sm text-gray-600">• Phone Number</Text>
        </View>
      </StepContent>
    ),
  },
  {
    id: 'address',
    title: 'Address Information',
    description: 'Where can we reach you?',
    optional: true,
    content: (
      <StepContent className="bg-blue-50 border-blue-200">
        <Text className="text-blue-800">Address form would go here</Text>
      </StepContent>
    ),
  },
  {
    id: 'verification',
    title: 'Verification',
    description: 'Verify your information',
    status: 'error', // Custom status
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'All done!',
    customIcon: '🎉',
  },
];

<View>
  <StepperProgress 
    steps={advancedSteps}
    currentStep={currentStep}
    className="px-4 pt-4"
  />
  
  <VerticalStepper
    steps={advancedSteps}
    currentStep={currentStep}
    onStepPress={(index) => setCurrentStep(index)}
    stepIconSize="lg"
    connectorHeight={60}
  />
</View>
*/

// Compact Stepper
/*
<VerticalStepper
  steps={basicSteps}
  currentStep={2}
  stepIconSize="sm"
  connectorHeight={30}
  showContent={false}
  className="bg-white"
  stepClassName="py-2"
  iconClassName="shadow-sm"
/>
*/

// Custom Themed Stepper
/*
<VerticalStepper
  steps={[
    {
      title: 'Start',
      description: 'Begin your journey',
      status: 'completed',
    },
    {
      title: 'In Progress',
      description: 'Currently working on this',
      status: 'active',
    },
    {
      title: 'Warning Step',
      description: 'Needs attention',
      status: 'warning',
    },
    {
      title: 'Error Step',
      description: 'Something went wrong',
      status: 'error',
    },
  ]}
  headerClassName="bg-white rounded-lg p-3 mb-2 shadow-sm"
  iconClassName="shadow-lg"
  connectorClassName="ml-6"
/>
*/
